'use client'

import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import stockService from '@/services/stock.service';
import type { StockSearchResult } from '@/types/stock.types';

interface StockSearchInputProps {
    onSelectStock: (stock: StockSearchResult) => void;
    placeholder?: string;
    className?: string;
}

export default function StockSearchInput({
    onSelectStock,
    placeholder = "Buscar acción (ej: AAPL, GOOGL)...",
    className = ""
}: StockSearchInputProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StockSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                const searchResults = await stockService.searchStocks(query);
                setResults(searchResults);
                setShowResults(true);
            } catch (err) {
                console.error('Error searching stocks:', err);
                setError('Error al buscar acciones');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // Wait 300ms after user stops typing

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelectStock = useCallback((stock: StockSearchResult) => {
        setQuery(stock.symbol);
        setShowResults(false);
        onSelectStock(stock);
    }, [onSelectStock]);

    const handleBlur = useCallback(() => {
        // Delay hiding results to allow click events to fire
        setTimeout(() => setShowResults(false), 200);
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="pl-10 pr-10"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((stock) => (
                        <button
                            key={stock.symbol}
                            onClick={() => handleSelectStock(stock)}
                            className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="font-semibold text-foreground">{stock.symbol}</div>
                                    <div className="text-sm text-muted-foreground truncate">{stock.name}</div>
                                </div>
                                <div className="text-xs text-muted-foreground ml-2">
                                    {stock.region}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {showResults && !isLoading && results.length === 0 && query.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg p-4 text-center text-muted-foreground">
                    No se encontraron resultados para &quot;{query}&quot;
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="absolute z-50 w-full mt-1 bg-destructive/10 border border-destructive rounded-md shadow-lg p-4 text-center text-destructive text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}
