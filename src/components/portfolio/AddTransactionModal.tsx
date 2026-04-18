'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, TrendingDown, CircleDollarSign, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import transactionService from '@/services/transaction.service';
import portfolioService from '@/services/portfolio.service';
import stockService from '@/services/stock.service';
import StockSearchInput from '@/components/stocks/StockSearchInput';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Portfolio } from '@/types/portfolio.types';
import type { StockSearchResult } from '@/types/stock.types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    investment?: any; // Optional: pre-fills stock and portfolio if provided
    initialType?: 'BUY' | 'SELL' | 'DIVIDEND';
    initialPortfolioId?: string;
}

export default function AddTransactionModal({
    isOpen,
    onClose,
    onSuccess,
    investment,
    initialType = 'BUY',
    initialPortfolioId
}: AddTransactionModalProps) {
    const { user } = useAuthStore();
    // Mode logic
    const isEditingMode = !!investment;

    // State
    const [type, setType] = useState<'BUY' | 'SELL' | 'DIVIDEND'>(initialType);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
    const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
    const [strategy, setStrategy] = useState('BUY_AND_HOLD');
    const [assetType, setAssetType] = useState<string>('STOCK');
    const [isManualEntry, setIsManualEntry] = useState(false);
    
    // Form fields
    const [manualSymbol, setManualSymbol] = useState('');
    const [manualName, setManualName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [commission, setCommission] = useState('0');
    const [taxes, setTaxes] = useState('0');
    const [executedAt, setExecutedAt] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    
    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form when modal opens/closes or investment changes
    useEffect(() => {
        if (isOpen) {
            loadPortfolios();
            if (investment) {
                setSelectedPortfolioId(investment.portfolioId);
                setSelectedStock({
                    symbol: investment.stockSymbol,
                    name: investment.stockName,
                    type: '',
                    region: '',
                    currency: '',
                    matchScore: '',
                    hasLiveData: false
                });
                setAssetType(investment.assetType || 'STOCK');
                setUnitPrice(investment.currentPrice?.toString() || '');
                setStrategy(investment.strategy || 'BUY_AND_HOLD');
            } else {
                setSelectedStock(null);
                setManualSymbol('');
                setManualName('');
                setAssetType('STOCK');
                setUnitPrice('');
                if (initialPortfolioId) {
                    setSelectedPortfolioId(initialPortfolioId);
                }
            }
        }
    }, [isOpen, investment, initialPortfolioId]);

    const loadPortfolios = async () => {
        setIsLoadingPortfolios(true);
        try {
            const response = await portfolioService.getPortfolios();
            const list = response.data.data;
            setPortfolios(list);
            if (!selectedPortfolioId && list.length > 0) {
                setSelectedPortfolioId(list[0].id);
            }
        } catch (err) {
            console.error('Error loading portfolios:', err);
        } finally {
            setIsLoadingPortfolios(false);
        }
    };

    const handleStockSelect = async (stock: StockSearchResult) => {
        setSelectedStock(stock);
        setIsManualEntry(false);
        setIsFetchingPrice(true);
        
        // Auto-detect type
        if (stock.symbol?.includes('=')) setAssetType('CRYPTO');
        else if (stock.type === 'ETF') setAssetType('ETF');
        else setAssetType('STOCK');

        try {
            const price = await stockService.getStockPrice(stock.symbol);
            if (price) setUnitPrice(price.toString());
        } catch (err) {
            console.error('Error fetching price:', err);
        } finally {
            setIsFetchingPrice(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const symbol = isManualEntry ? manualSymbol : selectedStock?.symbol;
        const name = isManualEntry ? manualName : selectedStock?.name;

        if (!selectedPortfolioId || !symbol || !quantity || !unitPrice || !user) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const data = {
                userId: user.id,
                portfolioId: selectedPortfolioId,
                stockId: symbol.toUpperCase(),
                stockSymbol: symbol.toUpperCase(),
                stockName: name || symbol,
                assetType: assetType, // Include asset type
                type: type,
                quantity: parseFloat(quantity),
                unitPrice: parseFloat(unitPrice),
                commission: parseFloat(commission),
                taxes: parseFloat(taxes),
                fees: 0,
                executedAt: new Date(executedAt).toISOString(),
                notes,
                currency: 'EUR', 
                status: 'EXECUTED',
                source: isManualEntry ? 'Custom' : 'Manual'
            };

            if (type === 'BUY') {
                await transactionService.buyStock(data);
            } else if (type === 'SELL') {
                await transactionService.sellStock(data);
            } else {
                await transactionService.collectDividend({
                    ...data,
                    netAmount: parseFloat(unitPrice) * parseFloat(quantity)
                });
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error processing transaction:', err);
            setError(err.response?.data?.message || 'Error al procesar la operación');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] bg-card border-border overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black italic">
                        {isEditingMode ? `RE-BALANCEAR - ${investment.stockSymbol}` : 'INTELIGENCIA DE ACTIVOS'}
                    </DialogTitle>
                    <DialogDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Registra compras, ventas o activos personalizados en tu patrimonio.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Transaction Selector Tabs */}
                    <div className="flex bg-muted/40 p-1 rounded-2xl border border-border">
                        {[
                            { id: 'BUY' as const, label: 'COMPRA', color: 'bg-emerald-500', icon: TrendingUp },
                            { id: 'SELL' as const, label: 'VENTA', color: 'bg-red-500', icon: TrendingDown },
                            { id: 'DIVIDEND' as const, label: 'DIVIDENDO', color: 'bg-orange-500', icon: CircleDollarSign },
                        ].map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setType(m.id)}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                    type === m.id ? `${m.color} text-black shadow-lg` : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                <m.icon size={14} /> {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Portfolio Destino</Label>
                            <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId} disabled={isEditingMode || isLoadingPortfolios}>
                                <SelectTrigger className="bg-muted/30 border-border h-12 rounded-xl font-bold">
                                    <SelectValue placeholder="Seleccionar portfolio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {portfolios.map((p) => (
                                        <SelectItem key={p.id} value={p.id} className="font-bold">{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Buscador / Activo</Label>
                                <button type="button" onClick={() => setIsManualEntry(!isManualEntry)} className="text-[9px] font-black text-orange-500 underline uppercase italic">
                                    {isManualEntry ? "Usar buscador" : "Manual / Especial"}
                                </button>
                            </div>
                            {isEditingMode ? (
                                <div className="h-12 flex items-center px-4 rounded-xl bg-muted/50 border border-border font-black text-orange-500">
                                    {investment.stockSymbol} - {investment.stockName}
                                </div>
                            ) : isManualEntry ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input value={manualSymbol} onChange={(e) => setManualSymbol(e.target.value)} placeholder="Ticker (Oro1)" className="bg-muted/30 border-border h-12 rounded-xl font-bold uppercase" />
                                    <Input value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Nombre (Lingote)" className="bg-muted/30 border-border h-12 rounded-xl font-bold" />
                                </div>
                            ) : (
                                <StockSearchInput onSelectStock={handleStockSelect} className="h-12" />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Categoría del activo</Label>
                            <Select value={assetType} onValueChange={setAssetType}>
                                <SelectTrigger className="bg-muted/30 border-border h-12 rounded-xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STOCK">Acción Individual</SelectItem>
                                    <SelectItem value="ETF">ETF (Indexado)</SelectItem>
                                    <SelectItem value="MUTUAL_FUND">Fondo de Inversión</SelectItem>
                                    <SelectItem value="CRYPTO">Criptomoneda</SelectItem>
                                    <SelectItem value="COMMODITY">Materia Prima (Oro...)</SelectItem>
                                    <SelectItem value="REAL_ESTATE">Inmobiliario</SelectItem>
                                    <SelectItem value="FIXED_INCOME">Renta Fija</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fecha y Estrategia</Label>
                            <div className="flex gap-2">
                                <Input type="date" value={executedAt} onChange={(e) => setExecutedAt(e.target.value)} className="bg-muted/30 border-border h-12 rounded-xl font-bold" required />
                                <Select value={strategy} onValueChange={setStrategy}>
                                    <SelectTrigger className="bg-muted/30 border-border h-12 rounded-xl font-bold w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BUY_AND_HOLD">HOLD</SelectItem>
                                        <SelectItem value="SPECULATION">TRADING</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-2xl border border-border">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-muted-foreground">Cantidad</Label>
                            <Input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-background h-11 rounded-lg border-border font-black" placeholder="0" required />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-muted-foreground">Precio (€)</Label>
                            <div className="relative">
                                <Input type="number" step="any" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="bg-background h-11 rounded-lg border-border font-black pl-4" placeholder="0.00" required />
                                {isFetchingPrice && <Loader2 className="absolute right-2 top-3 h-4 w-4 animate-spin text-orange-500" />}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-muted-foreground">Comisión</Label>
                            <Input type="number" step="any" value={commission} onChange={(e) => setCommission(e.target.value)} className="bg-background h-11 rounded-lg border-border font-bold" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-muted-foreground">Impuestos</Label>
                            <Input type="number" step="any" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="bg-background h-11 rounded-lg border-border font-bold" placeholder="0" />
                        </div>
                    </div>

                    {error && <div className="p-4 text-xs font-black bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2 italic uppercase"> <Info size={14} /> {error} </div>}

                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading} className="font-bold opacity-50">Descargar</Button>
                        <Button type="submit" disabled={isLoading} className={cn("min-w-[180px] h-12 rounded-xl font-black italic tracking-widest text-black shadow-2xl transition-all active:scale-95", 
                            type === 'BUY' ? 'bg-emerald-500 hover:bg-emerald-600' : 
                            type === 'SELL' ? 'bg-red-500 hover:bg-red-600' : 
                            'bg-orange-500 hover:bg-orange-600'
                        )}>
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : `CONFIRMAR ${type}`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
