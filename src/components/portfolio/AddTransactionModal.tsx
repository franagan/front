'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, TrendingDown, CircleDollarSign, Info } from 'lucide-react';
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
    
    // Form fields
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
                    region: '',
                    currency: ''
                });
                setUnitPrice(investment.currentPrice?.toString() || '');
                setStrategy(investment.strategy || 'BUY_AND_HOLD');
            } else {
                setSelectedStock(null);
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
        setIsFetchingPrice(true);
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
        if (!selectedPortfolioId || !selectedStock || !quantity || !unitPrice || !user) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const data = {
                userId: user.id,
                portfolioId: selectedPortfolioId,
                stockId: selectedStock.symbol, // Use symbol as stock identifier
                stockSymbol: selectedStock.symbol,
                stockName: selectedStock.name,
                type: type, // THIS WAS MISSING
                quantity: parseFloat(quantity),
                unitPrice: parseFloat(unitPrice),
                commission: parseFloat(commission),
                taxes: parseFloat(taxes),
                fees: 0,
                executedAt: new Date(executedAt).toISOString(),
                notes,
                currency: 'EUR', 
                status: 'EXECUTED',
                source: 'Manual'
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
            <DialogContent className="sm:max-w-[550px] bg-card border-border overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        {isEditingMode ? `Nuevo movimiento - ${investment.stockSymbol}` : 'Registrar nueva transacción'}
                    </DialogTitle>
                    <DialogDescription>
                        Introduce los detalles de su operación de compra, venta o dividendo para actualizar su cartera.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {/* Transaction Selector Tabs */}
                    <div className="flex bg-muted/40 p-1 rounded-xl border border-border">
                        <button
                            type="button"
                            onClick={() => setType('BUY')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                type === 'BUY' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <TrendingUp size={16} /> COMPRA
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('SELL')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                type === 'SELL' ? 'bg-red-500 text-black shadow-lg shadow-red-500/20' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <TrendingDown size={16} /> VENTA
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('DIVIDEND')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                type === 'DIVIDEND' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <CircleDollarSign size={16} /> DIVIDENDO
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Portfolio Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Portfolio de destino</Label>
                            <Select 
                                value={selectedPortfolioId} 
                                onValueChange={setSelectedPortfolioId}
                                disabled={isEditingMode || isLoadingPortfolios}
                            >
                                <SelectTrigger className="bg-muted/30 border-border h-11">
                                    <SelectValue placeholder="Seleccionar portfolio" />
                                </SelectTrigger>
                                <SelectContent>
                                    {portfolios.map((p) => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stock Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Activo / Acción</Label>
                            {isEditingMode ? (
                                <div className="h-11 flex items-center px-3 rounded-md bg-muted/50 border border-border font-semibold">
                                    {investment.stockSymbol} - {investment.stockName}
                                </div>
                            ) : (
                                <StockSearchInput 
                                    onSelectStock={handleStockSelect} 
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Fecha operación</Label>
                            <Input
                                type="date"
                                value={executedAt}
                                onChange={(e) => setExecutedAt(e.target.value)}
                                className="bg-muted/30 border-border h-11"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Estrategia</Label>
                            <Select value={strategy} onValueChange={setStrategy}>
                                <SelectTrigger className="bg-muted/30 border-border h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BUY_AND_HOLD">Buy & Hold</SelectItem>
                                    <SelectItem value="DIVIDEND_GROWTH">Crecimiento Dividendos</SelectItem>
                                    <SelectItem value="VALUE_INVESTING">Value Investing</SelectItem>
                                    <SelectItem value="SPECULATION">Especulación / Trading</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-1 space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Cant.</Label>
                            <Input
                                type="number"
                                step="any"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="bg-muted/30 h-11"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Precio</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                                <Input
                                    type="number"
                                    step="any"
                                    value={unitPrice}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                    className="bg-muted/30 h-11 pl-7"
                                    placeholder="0.00"
                                    required
                                />
                                {isFetchingPrice && <Loader2 className="absolute right-2 top-3 h-4 w-4 animate-spin text-yellow-500" />}
                            </div>
                        </div>
                        <div className="col-span-1 space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Comisión</Label>
                            <Input
                                type="number"
                                step="any"
                                value={commission}
                                onChange={(e) => setCommission(e.target.value)}
                                className="bg-muted/30 h-11"
                                placeholder="0"
                            />
                        </div>
                        <div className="col-span-1 space-y-2">
                            <Label className="text-xs font-bold uppercase text-muted-foreground">Impuestos</Label>
                            <Input
                                type="number"
                                step="any"
                                value={taxes}
                                onChange={(e) => setTaxes(e.target.value)}
                                className="bg-muted/30 h-11"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">Notas Adicionales</Label>
                        <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-muted/30 h-11"
                            placeholder="Referencia, broker, motivo..."
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                            <Info size={16} />
                            {error}
                        </div>
                    )}

                    <DialogFooter className="gap-3 sm:gap-0 mt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                            className={`min-w-[150px] font-bold ${
                                type === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 
                                type === 'SELL' ? 'bg-red-600 hover:bg-red-700' : 
                                'bg-yellow-600 hover:bg-yellow-700'
                            } text-black h-11`}
                        >
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                            ) : (
                                `Confirmar ${type === 'BUY' ? 'Compra' : type === 'SELL' ? 'Venta' : 'Dividendo'}`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
