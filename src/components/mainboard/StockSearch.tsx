'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2, TrendingUp, X } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import stockService, { FinnhubSearchResult } from '@/services/stock.service'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function StockSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<FinnhubSearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true)
                try {
                    const response = await stockService.searchSymbols(query)
                    if (response.success) {
                        setResults(response.data.slice(0, 8))
                        setIsOpen(true)
                    }
                } catch (error) {
                    console.error('Search error:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [query])

    const handleSelect = (symbol: string) => {
        router.push(`/mainboard/portfolio/stock/${symbol}`)
        setIsOpen(false)
        setQuery('')
    }

    return (
        <div ref={searchRef} className="relative w-full max-w-sm">
            <div className="relative group">
                <Search className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    query ? "text-orange-500" : "text-muted-foreground"
                )} />
                <Input
                    type="text"
                    placeholder="Buscar mercado (AAPL, BTC, DGE.L...)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="pl-11 pr-10 h-10 w-full bg-card/50 border-border rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />
                {loading ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-orange-500" />
                ) : query && (
                    <button 
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-[1.5rem] shadow-2xl p-2 z-[100] animate-in fade-in zoom-in duration-200 ring-1 ring-white/5">
                    <div className="p-2 mb-2 border-b border-zinc-800/50">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-2">Resultados</p>
                    </div>
                    {results.length > 0 ? (
                        <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                            {results.map((item) => (
                                <button
                                    key={item.symbol}
                                    onClick={() => handleSelect(item.symbol)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-orange-500/10 transition-all group text-left mb-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center font-black text-white group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-colors">
                                            {item.symbol.slice(0, 1)}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm text-zinc-100 group-hover:text-orange-500 transition-colors">{item.symbol}</p>
                                            <p className="text-[10px] text-zinc-500 font-bold truncate max-w-[180px] group-hover:text-orange-500/70">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-sm text-zinc-400">
                            No se encontraron resultados para "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
