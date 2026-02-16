'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    BarChart3,
    DollarSign,
    Loader2,
    AlertCircle
} from "lucide-react"
import { useTranslations } from 'next-intl'
import StockSearchInput from "@/components/stocks/StockSearchInput"
import stockService from "@/services/stock.service"
import type { StockSearchResult, StockQuote, CompanyOverview } from "@/types/stock.types"

export default function BolScanPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('bolscan')
    const tCommon = useTranslations('common')

    const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null)
    const [quote, setQuote] = useState<StockQuote | null>(null)
    const [overview, setOverview] = useState<CompanyOverview | null>(null)
    const [isLoadingQuote, setIsLoadingQuote] = useState(false)
    const [isLoadingOverview, setIsLoadingOverview] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    const handleSelectStock = async (stock: StockSearchResult) => {
        setSelectedStock(stock)
        setError(null)
        setQuote(null)
        setOverview(null)

        // Fetch quote
        setIsLoadingQuote(true)
        try {
            const quoteData = await stockService.getStockQuote(stock.symbol)
            setQuote(quoteData)
        } catch (err) {
            console.error('Error fetching quote:', err)
            setError('Error al obtener la cotización')
        } finally {
            setIsLoadingQuote(false)
        }

        // Fetch overview
        setIsLoadingOverview(true)
        try {
            const overviewData = await stockService.getCompanyOverview(stock.symbol)
            setOverview(overviewData)
        } catch (err) {
            console.error('Error fetching overview:', err)
        } finally {
            setIsLoadingOverview(false)
        }
    }

    const formatMarketCap = (value: number | null) => {
        if (!value) return 'N/A'
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
        return `$${value.toFixed(2)}`
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/mainboard')}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {tCommon('back')}
                    </Button>
                    <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>

                {/* Search Bar */}
                <Card className="bg-card border-border mb-8">
                    <CardContent className="p-6">
                        <StockSearchInput
                            onSelectStock={handleSelectStock}
                            placeholder={t('searchStock')}
                        />
                    </CardContent>
                </Card>

                {/* Stock Analysis */}
                {selectedStock && (
                    <div className="space-y-6">
                        {/* Stock Header with Quote */}
                        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black">
                            <CardContent className="p-6">
                                {isLoadingQuote ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : quote ? (
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-3xl font-bold">{quote.symbol}</h2>
                                            <p className="text-lg">{selectedStock.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-bold">${quote.price.toFixed(2)}</div>
                                            <div className={`flex items-center gap-1 justify-end ${quote.change >= 0 ? 'text-black' : 'text-red-900'}`}>
                                                {quote.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                                <span className="font-semibold">
                                                    {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="flex items-center gap-2 text-red-900">
                                        <AlertCircle className="h-5 w-5" />
                                        <span>{error}</span>
                                    </div>
                                ) : null}
                            </CardContent>
                        </Card>

                        {/* Key Metrics */}
                        {quote && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-1">Open</p>
                                        <p className="text-2xl font-bold">${quote.open.toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-1">High</p>
                                        <p className="text-2xl font-bold">${quote.high.toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-1">Low</p>
                                        <p className="text-2xl font-bold">${quote.low.toFixed(2)}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6">
                                        <p className="text-sm text-muted-foreground mb-1">Volume</p>
                                        <p className="text-2xl font-bold">{quote.volume.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Company Overview */}
                        {isLoadingOverview ? (
                            <Card className="bg-card border-border">
                                <CardContent className="p-12 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
                                </CardContent>
                            </Card>
                        ) : overview ? (
                            <>
                                {/* Company Info */}
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle>Company Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                                            <p className="text-sm">{overview.description || 'N/A'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Sector</p>
                                                <p className="font-semibold">{overview.sector || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Industry</p>
                                                <p className="font-semibold">{overview.industry || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Country</p>
                                                <p className="font-semibold">{overview.country || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Currency</p>
                                                <p className="font-semibold">{overview.currency || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Financials and Ratios */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Key Metrics */}
                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="h-6 w-6 text-yellow-400" />
                                                Key Metrics
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-border">
                                                <span className="text-muted-foreground">{t('marketCap')}</span>
                                                <span className="font-semibold text-lg">{formatMarketCap(overview.marketCap)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-border">
                                                <span className="text-muted-foreground">{t('peRatio')}</span>
                                                <span className="font-semibold text-lg">{overview.peRatio?.toFixed(2) || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">{t('eps')}</span>
                                                <span className="font-semibold text-lg">${overview.eps?.toFixed(2) || 'N/A'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Additional Ratios */}
                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3 className="h-6 w-6 text-yellow-400" />
                                                {t('ratios')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-border">
                                                <span className="text-muted-foreground">{t('dividendYield')}</span>
                                                <span className="font-semibold text-lg">{overview.dividendYield ? `${(overview.dividendYield * 100).toFixed(2)}%` : 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-3 border-b border-border">
                                                <span className="text-muted-foreground">Beta</span>
                                                <span className="font-semibold text-lg">{overview.beta?.toFixed(2) || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">52 Week Range</span>
                                                <span className="font-semibold text-lg">
                                                    {overview.week52Low && overview.week52High
                                                        ? `$${overview.week52Low.toFixed(2)} - $${overview.week52High.toFixed(2)}`
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </>
                        ) : null}
                    </div>
                )}

                {/* Empty State */}
                {!selectedStock && (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t('enterSymbol')}</h3>
                            <p className="text-muted-foreground">
                                {t('searchStock')}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
