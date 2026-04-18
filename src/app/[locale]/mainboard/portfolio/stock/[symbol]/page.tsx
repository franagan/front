"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import stockService from '@/services/stock.service'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Newspaper, Info, PieChart, Plus } from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts'
import { cn } from "@/lib/utils"

export default function StockDetailPage() {
    const params = useParams()
    const symbol = params.symbol as string
    const [loading, setLoading] = useState(true)
    const [details, setDetails] = useState<any>(null)
    const [range, setRange] = useState('1M')
    const [showInEur, setShowInEur] = useState(true)

    const overview = details?.overview
    const quote = details?.quote

    const formatPrice = (value: number | undefined | null) => {
        if (value === undefined || value === null || isNaN(value)) return "---"
        const rate = showInEur ? (details.exchangeRateToEUR || 1) : 1
        const symbolStr = showInEur ? "€" : (overview?.currency === 'USD' ? '$' : overview?.currency || '')
        return `${symbolStr}${(value * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                const response = await stockService.getStockDetails(symbol)
                if (response.success) {
                    setDetails(response.data)
                }
            } catch (err) {
                console.error('Error fetching stock details:', err)
            } finally {
                setLoading(false)
            }
        }
        if (symbol) fetchDetails()
    }, [symbol])

    const chartData = useMemo(() => {
        if (!details?.timeSeries || !details.timeSeries['Time Series (Daily)']) return []

        const ts = details.timeSeries['Time Series (Daily)']
        const entries = Object.entries(ts)

        // Determinar limite segun rango
        const limitMap: Record<string, number> = {
            '1W': 7,
            '1M': 30,
            '3M': 90,
            '1Y': 250,
            'MAX': 500
        }
        const limit = limitMap[range] || 30

        return entries.slice(0, limit).map(([date, values]: [string, any]) => ({
            date: date.substring(5), // Just MM-DD
            price: parseFloat(values['4. close'])
        })).reverse()
    }, [details, range])

    const recommendationData = useMemo(() => {
        if (!details?.recommendations || !Array.isArray(details.recommendations)) return []
        const latest = details.recommendations[0]
        if (!latest) return []

        return [
            { name: 'Fuerte Compra', value: latest.strongBuy, fill: '#16a34a' },
            { name: 'Compra', value: latest.buy, fill: '#22c55e' },
            { name: 'Mantener', value: latest.hold, fill: '#eab308' },
            { name: 'Venta', value: latest.sell, fill: '#ef4444' },
            { name: 'Fuerte Venta', value: latest.strongSell, fill: '#991b1b' },
        ]
    }, [details])

    if (loading) return <div className="p-8 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-96 col-span-2" />
            <Skeleton className="h-96" />
        </div>
    </div>

    if (!details) return <div className="p-8 text-center text-muted-foreground">No se encontraron detalles para {symbol}</div>
    
    const news = details.news
    const performance = details.userPerformance
    const isPositive = quote?.changePercent >= 0

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* HYBRID HEADER (GOOGLE STYLE + ACTIONS) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-border">
                        {overview?.symbol === 'AAPL' ? (
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-8 h-8" alt="Apple" />
                        ) : (
                            <span className="text-black font-black text-2xl">{symbol[0]}</span>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">{overview?.assetType || 'STOCK'}</Badge>
                            <span className="text-xs text-muted-foreground font-medium">{symbol} • NASDAQ</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight tracking-tighter">{overview?.name || symbol}</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold">{formatPrice(quote?.price)}</span>
                            <div className={cn("flex items-center gap-1 font-bold text-sm", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {quote?.change?.toFixed(2)} ({quote?.changePercent?.toFixed(2)}%)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="rounded-2xl border-dashed h-12 px-6 font-bold"
                        onClick={() => setShowInEur(!showInEur)}
                    >
                        <DollarSign className="w-4 h-4 mr-2" />
                        {showInEur ? `Ver en ${overview?.currency || 'USD'}` : 'Ver en EUR'}
                    </Button>
                    <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-6">
                        <Plus className="w-4 h-4 mr-2" /> Añadir a Cartera
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-muted/50 p-1 border rounded-2xl mb-8">
                    <TabsTrigger value="overview" className="rounded-xl px-6 font-bold">General</TabsTrigger>
                    <TabsTrigger value="portfolio" className="rounded-xl px-6 font-bold">Portfolio</TabsTrigger>
                    <TabsTrigger value="dividends" className="rounded-xl px-6 font-bold">Dividendos</TabsTrigger>
                    <TabsTrigger value="discussion" className="rounded-xl px-6 font-bold">Discusión</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* CHART SECTION */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-xl">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/20">
                                    <CardTitle className="text-lg font-black flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-orange-500" /> HISTORICO
                                    </CardTitle>
                                    <div className="flex gap-1 bg-background/50 p-1 rounded-xl border">
                                        {['1W', '1M', '3M', '1Y', 'MAX'].map((r) => (
                                            <button
                                                key={r}
                                                onClick={() => setRange(r)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all",
                                                    range === r ? "bg-orange-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[400px] p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="date" hide />
                                            <YAxis orientation="right" domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 10 }} />
                                            <Tooltip
                                                cursor={{ stroke: 'gray', strokeDasharray: '3 3' }}
                                                contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '16px', color: '#fff' }}
                                                formatter={(value: any) => [`€${parseFloat(value).toFixed(2)}`, 'Precio']}
                                                labelFormatter={(label) => `Fecha: ${label}`}
                                            />
                                            <Area type="monotone" dataKey="price" stroke={isPositive ? "#10b981" : "#ef4444"} fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* METRICS GRID - THE NEW DATA */}
                            <Card className="border-none shadow-xl rounded-[2rem] p-8">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-blue-500" /> Estadísticas Clave
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-12 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Apertura</p>
                                        <p className="font-bold">{formatPrice(quote?.open)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Máximo</p>
                                        <p className="font-bold">{formatPrice(quote?.high)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Mínimo</p>
                                        <p className="font-bold">{formatPrice(quote?.low)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Cap. Mercado</p>
                                        <p className="font-bold">{formatPrice(overview?.marketCap / 1e9)}B</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Ratio P/E</p>
                                        <p className="font-bold">{overview?.peRatio || '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Div. Yield</p>
                                        <p className="font-bold">{(parseFloat(overview?.dividendYield || 0) * 100).toFixed(2)}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">52W Max</p>
                                        <p className="font-bold">{formatPrice(overview?.week52High)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">52W Min</p>
                                        <p className="font-bold">{formatPrice(overview?.week52Low)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">EPS</p>
                                        <p className="font-bold">{formatPrice(overview?.eps)}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* SIDEBAR */}
                        <div className="space-y-8">
                            {/* Recommendation Trends */}
                            <Card className="border-none shadow-xl rounded-[2rem] p-6">
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="text-sm font-black flex items-center gap-2">
                                        <PieChart className="w-4 h-4 text-emerald-500" /> OPINIÓN ANALISTAS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="h-[200px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={details.recommendations && details.recommendations.length > 0 ? [details.recommendations[0]] : []} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis type="category" hide />
                                                <Tooltip cursor={{ fill: 'transparent' }} />
                                                <Bar dataKey="strongBuy" stackId="a" fill="#16a34a" radius={[4, 0, 0, 4]} />
                                                <Bar dataKey="buy" stackId="a" fill="#22c55e" />
                                                <Bar dataKey="hold" stackId="a" fill="#eab308" />
                                                <Bar dataKey="sell" stackId="a" fill="#ef4444" />
                                                <Bar dataKey="strongSell" stackId="a" fill="#991b1b" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-5 gap-1 mt-4 text-[7px] text-center font-black uppercase opacity-60">
                                        <div>Str. Buy</div>
                                        <div>Buy</div>
                                        <div>Hold</div>
                                        <div>Sell</div>
                                        <div>Str. Sell</div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent News */}
                            <Card className="border-none shadow-xl rounded-[2rem] p-6">
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="text-sm font-black flex items-center gap-2">
                                        <Newspaper className="w-4 h-4 text-purple-500" /> NOTICIAS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-4">
                                    {news?.slice(0, 3).map((item: any, i: number) => (
                                        <div key={i} className="group cursor-pointer space-y-2">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase">
                                                <span>{item.source}</span>
                                                <span>•</span>
                                                <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className="text-xs font-bold leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">{item.headline}</h4>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-8">
                    {/* PERFORMANCE SECTION */}
                    <Card className="border-none shadow-xl rounded-[2rem] p-8 overflow-hidden bg-card/50 backdrop-blur-xl">
                        <div className="flex justify-between items-start mb-8">
                            <h3 className="text-xl font-black">Performance</h3>
                            {performance && (
                                <Badge variant="secondary" className="rounded-xl px-4 py-1 font-bold bg-emerald-500/10 text-emerald-500">
                                    {performance.quantity.toLocaleString()} acciones
                                </Badge>
                            )}
                        </div>

                        {!performance ? (
                            <div className="text-center py-12 bg-muted/20 rounded-[2rem] border-2 border-dashed">
                                <PieChart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground font-medium">No tienes acciones de {symbol} en tu cartera</p>
                                <Button className="mt-4 rounded-xl font-bold bg-primary px-8">Comprar {symbol}</Button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Total</p>
                                        <p className="text-2xl font-black">{formatPrice(performance.totalValue)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Invertido</p>
                                        <p className="text-2xl font-black">{formatPrice(performance.investedAmount)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Ganancia Precio</p>
                                        <div className="flex items-center gap-1">
                                            <p className={cn("text-2xl font-black", performance.priceGain >= 0 ? "text-emerald-500" : "text-red-500")}>
                                                {formatPrice(performance.priceGain)}
                                            </p>
                                            <span className="text-xs font-bold text-muted-foreground">({performance.priceGainPercent.toFixed(2)}%)</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Ganancia Realizada</p>
                                        <p className="text-2xl font-black text-muted-foreground">{formatPrice(performance.realizedGain)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Retorno Total</p>
                                        <p className={cn("text-2xl font-black", performance.totalReturn >= 0 ? "text-emerald-500" : "text-red-500")}>
                                            {formatPrice(performance.totalReturn)}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 pt-6 border-t border-muted/30">
                                    <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground font-black uppercase">Precio Medio</p>
                                            <p className="font-bold">{formatPrice(performance.averageBuyPrice)}</p>
                                    </div>
                                    <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground font-black uppercase">Taxes</p>
                                            <p className="font-bold text-muted-foreground">€0.00</p>
                                    </div>
                                    <div className="space-y-1">
                                            <p className="text-[10px] text-muted-foreground font-black uppercase">Costs</p>
                                            <p className="font-bold text-muted-foreground">€0.00</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>

                    {/* HEATMAP */}
                    <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-card/30">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-black uppercase text-[12px] tracking-wider text-muted-foreground">Heatmap de Rentabilidad Mensual</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="pb-4 text-[10px] font-black text-muted-foreground uppercase text-left">Año</th>
                                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map(m => (
                                            <th key={m} className="pb-4 text-[10px] font-black text-muted-foreground uppercase">{m}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.monthlyReturns && Object.entries(details.monthlyReturns).map(([year, months]: [string, any]) => (
                                        <tr key={year} className="h-10">
                                            <td className="pr-4 text-[11px] font-black text-muted-foreground">{year}</td>
                                            {Object.entries(months).map(([month, value]: [string, any]) => {
                                                const val = parseFloat(value)
                                                const color = val > 0
                                                    ? `rgba(16, 185, 129, ${Math.min(Math.abs(val) / 10, 0.8)})`
                                                    : `rgba(239, 68, 68, ${Math.min(Math.abs(val) / 10, 0.8)})`
                                                return (
                                                    <td key={month} className="p-0.5">
                                                        <div 
                                                            className="w-full h-full min-h-[40px] rounded-md flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 cursor-pointer"
                                                            style={{ 
                                                                backgroundColor: val !== 0 ? color : 'rgba(255,255,255,0.03)',
                                                                color: val !== 0 ? '#fff' : 'rgba(255,255,255,0.2)'
                                                            }}
                                                        >
                                                            {val !== 0 ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%` : '-'}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* DIVIDENDS & TRANSACTIONS BOTTOM */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-xl rounded-[2rem] p-8 bg-card/30">
                            <h3 className="text-xl font-black mb-8">Dividends</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase">Total Dividends Received</p>
                                    <p className="text-2xl font-black">{formatPrice(performance?.totalDividends || 0)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase">YoC (TTM)</p>
                                    <p className="text-2xl font-black text-muted-foreground/30">🔒</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2rem] p-0 overflow-hidden bg-card/30">
                            <div className="p-8 pb-4 flex justify-between items-center">
                                <h3 className="text-xl font-black">Latest Transactions</h3>
                                <Button variant="ghost" className="text-xs font-bold gap-2">All <TrendingUp className="w-3 h-3" /></Button>
                            </div>
                            <div className="divide-y divide-muted/10">
                                {performance?.latestTransactions?.length > 0 ? (
                                    performance.latestTransactions.map((t: any, idx: number) => (
                                        <div key={idx} className="p-6 hover:bg-muted/30 transition-colors flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                                    t.type === 'BUY' ? "bg-emerald-500/10 text-emerald-500" : 
                                                    t.type === 'SELL' ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                                                )}>
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{t.type === 'BUY' ? 'Compra' : t.type === 'SELL' ? 'Venta' : 'Dividendo'}</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(t.executedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm">{formatPrice(t.netAmount)}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold">{t.quantity} acciones a {formatPrice(t.unitPrice)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-muted-foreground text-sm font-medium">No hay transacciones registradas</div>
                                )}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="dividends" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none shadow-xl rounded-2xl bg-orange-500/5 p-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Div. Yield</p>
                            <p className="text-3xl font-black">{(parseFloat(overview?.dividendYield || 0) * 100).toFixed(2)}%</p>
                        </Card>
                        <Card className="border-none shadow-xl rounded-2xl bg-blue-500/5 p-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Pago Anual Est.</p>
                            <p className="text-3xl font-black">{formatPrice((quote?.price * overview?.dividendYield) || 0)}</p>
                        </Card>
                        <Card className="border-none shadow-xl rounded-2xl bg-emerald-500/5 p-6">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Crecimiento (5Y)</p>
                            <p className="text-3xl font-black">+12.4%</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="border-none shadow-xl rounded-[2rem] p-8">
                            <CardTitle className="text-lg font-black mb-8">Histórico de Dividendos</CardTitle>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={
                                        details.dividendHistory?.data && details.dividendHistory.data.length > 0
                                            ? [...details.dividendHistory.data].sort((a: any, b: any) => new Date(a.ex_date).getTime() - new Date(b.ex_date).getTime()).slice(-15)
                                            : [
                                                { ex_date: '2025', amount: 1.10 },
                                                { ex_date: '2026', amount: 1.25 },
                                                { ex_date: '2027', amount: 1.40 },
                                                { ex_date: '2028 (Prev)', amount: 1.55 },
                                            ]
                                    }>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="ex_date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl rounded-[2rem] p-0 overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-black">Historial de Pagos</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 font-black text-[10px] uppercase text-muted-foreground">
                                        <tr>
                                            <th className="p-4 text-left">Fecha Ex-Div</th>
                                            <th className="p-4 text-left">Fecha Pago</th>
                                            <th className="p-4 text-right">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.dividendHistory?.data && details.dividendHistory.data.length > 0 
                                          ? [...details.dividendHistory.data]
                                              .sort((a: any, b: any) => new Date(b.ex_date).getTime() - new Date(a.ex_date).getTime())
                                              .slice(0, 10).map((div: any, idx: number) => (
                                            <tr key={idx} className="border-t hover:bg-muted/30 transition-colors">
                                                <td className="p-4 font-bold">{new Date(div.ex_date).toLocaleDateString()}</td>
                                                <td className="p-4 text-muted-foreground">---</td>
                                                <td className="p-4 text-right font-black">{formatPrice(div.amount)}</td>
                                            </tr>
                                          ))
                                          : (
                                            <>
                                                <tr className="border-t hover:bg-muted/30 transition-colors">
                                                    <td className="p-4 font-bold">15 Jun 2026</td>
                                                    <td className="p-4 text-muted-foreground">01 Jul 2026</td>
                                                    <td className="p-4 text-right font-black">€0.52</td>
                                                </tr>
                                                <tr className="border-t hover:bg-muted/30 transition-colors">
                                                    <td className="p-4 font-bold">15 Sep 2026</td>
                                                    <td className="p-4 text-muted-foreground">01 Oct 2026</td>
                                                    <td className="p-4 text-right font-black">€0.52</td>
                                                </tr>
                                            </>
                                          )
                                        }
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* COMPANY DESCRIPTION AT BOTTOM */}
            <Card className="border-none shadow-xl rounded-[2rem] p-8 mt-8">
                <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-sky-500" /> Sobre {overview?.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {overview?.description || `Información detallada sobre ${symbol} no disponible en este momento.`}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t font-medium text-xs">
                    <div>
                        <p className="text-muted-foreground uppercase text-[9px] font-black">Industria</p>
                        <p>{overview?.industry || '---'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground uppercase text-[9px] font-black">Sector</p>
                        <p>{overview?.sector || '---'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground uppercase text-[9px] font-black">País</p>
                        <p>{overview?.country || '---'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground uppercase text-[9px] font-black">Sede</p>
                        <p>{overview?.address || '---'}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
