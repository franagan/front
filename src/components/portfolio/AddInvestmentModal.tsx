'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import StockSearchInput from '@/components/stocks/StockSearchInput';
import investmentService from '@/services/investment.service';
import portfolioService from '@/services/portfolio.service';
import stockService from '@/services/stock.service';
import type { StockSearchResult } from '@/types/stock.types';
import type { CreateInvestmentRequest, Portfolio } from '@/types/portfolio.types';
import { useTranslations } from 'next-intl';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddInvestmentModal({
    isOpen,
    onClose,
    onSuccess
}: AddInvestmentModalProps) {
    const t = useTranslations('modals');
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('');
    const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
    const [quantity, setQuantity] = useState('');
    const [averagePrice, setAveragePrice] = useState('');
    const [strategy, setStrategy] = useState('BUY_AND_HOLD');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load portfolios when modal opens
    useEffect(() => {
        if (isOpen) {
            loadPortfolios();
        }
    }, [isOpen]);

    const loadPortfolios = async () => {
        setIsLoadingPortfolios(true);
        try {
            const response = await portfolioService.getPortfolios();
            const portfolioList = response.data.data;
            setPortfolios(portfolioList);

            // Auto-select first portfolio if available
            if (portfolioList && portfolioList.length > 0) {
                setSelectedPortfolioId(portfolioList[0].id);
            }
        } catch (err) {
            console.error('Error loading portfolios:', err);
            setError('Error al cargar portfolios');
        } finally {
            setIsLoadingPortfolios(false);
        }
    };

    const handleStockSelect = async (stock: StockSearchResult) => {
        setSelectedStock(stock);
        setError(null);
        setAveragePrice(''); // Clear previous price

        // Always attempt to fetch price
        setIsFetchingPrice(true);
        try {
            const price = await stockService.getStockPrice(stock.symbol);
            if (price) {
                setAveragePrice(price.toString());
            }
        } catch (err) {
            console.error('Error fetching price:', err);
            // If auto-fetch fails, user can still enter manually
        } finally {
            setIsFetchingPrice(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPortfolioId) {
            setError('Por favor selecciona un portfolio');
            return;
        }

        if (!selectedStock) {
            setError('Por favor selecciona una acción');
            return;
        }

        if (!quantity || parseFloat(quantity) <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }

        if (!averagePrice || parseFloat(averagePrice) <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const investmentData: CreateInvestmentRequest = {
                portfolioId: selectedPortfolioId,
                stockId: selectedStock.symbol,
                stockSymbol: selectedStock.symbol,
                stockName: selectedStock.name,
                quantity: parseFloat(quantity),
                averagePrice: parseFloat(averagePrice),
                currentPrice: parseFloat(averagePrice) // Use same price as current
            };

            await investmentService.createInvestment(investmentData);

            // Reset form
            setSelectedPortfolioId(portfolios.length > 0 ? portfolios[0].id : '');
            setSelectedStock(null);
            setQuantity('');
            setAveragePrice('');
            setStrategy('BUY_AND_HOLD');

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating investment:', err);
            const errorPayload = err as { response?: { data?: { message?: string } } };
            setError(errorPayload.response?.data?.message || 'Error al crear la inversión');
        } finally {

            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setSelectedStock(null);
            setQuantity('');
            setAveragePrice('');
            setStrategy('BUY_AND_HOLD');
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{t('addInvestment.title')}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Portfolio Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="portfolio">{t('addInvestment.portfolio')}</Label>
                        {isLoadingPortfolios ? (
                            <div className="flex items-center justify-center h-10">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <Select value={selectedPortfolioId} onValueChange={setSelectedPortfolioId}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('addInvestment.portfolioPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {portfolios.map((portfolio) => (
                                        <SelectItem key={portfolio.id} value={portfolio.id}>
                                            {portfolio.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {t('addInvestment.portfolioDesc')}
                        </p>
                    </div>

                    {/* Stock Search */}
                    <div className="space-y-2">
                        <Label>{t('addInvestment.stock')}</Label>
                        <StockSearchInput
                            onSelectStock={handleStockSelect}
                            placeholder={t('addInvestment.stockPlaceholder')}
                        />
                        {selectedStock && (
                            <div className="text-sm text-muted-foreground mt-1">
                                {t('addInvestment.selected')} <span className="font-semibold">{selectedStock.symbol}</span> - {selectedStock.name}
                            </div>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">{t('addInvestment.quantity')}</Label>
                        <Input
                            id="quantity"
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder={t('addInvestment.quantityPlaceholder')}
                            required
                        />
                    </div>

                    {/* Average Price */}
                    <div className="space-y-2">
                        <Label htmlFor="averagePrice">{t('addInvestment.price')}</Label>
                        <div className="relative">
                            <Input
                                id="averagePrice"
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={averagePrice}
                                onChange={(e) => setAveragePrice(e.target.value)}
                                placeholder={t('addInvestment.pricePlaceholder')}
                                required
                                disabled={isFetchingPrice}
                            />
                            {isFetchingPrice && (
                                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            )}
                        </div>

                        {/* Show different messages based on data availability */}
                        {averagePrice ? (
                            <p className="text-xs text-muted-foreground">
                                {t('addInvestment.priceAuto')}
                            </p>
                        ) : (
                            <p className="text-xs text-muted-foreground">
                                {t('addInvestment.priceManual')}
                            </p>
                        )}
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2">
                        <Label htmlFor="strategy">{t('addInvestment.strategy')}</Label>
                        <Select value={strategy} onValueChange={setStrategy}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUY_AND_HOLD">Buy and Hold</SelectItem>
                                <SelectItem value="VALUE_INVESTING">Value Investing</SelectItem>
                                <SelectItem value="GROWTH">Growth</SelectItem>
                                <SelectItem value="DIVIDEND">Dividend</SelectItem>
                                <SelectItem value="MOMENTUM">Momentum</SelectItem>
                                <SelectItem value="INDEX">Index</SelectItem>
                                <SelectItem value="OTHER">{t('addInvestment.strategyOther')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !selectedStock}
                            className="bg-yellow-600 hover:bg-yellow-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('creating')}
                                </>
                            ) : (
                                t('addInvestment.submit')
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
