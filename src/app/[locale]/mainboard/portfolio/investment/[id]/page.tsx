'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    ArrowLeft, 
    TrendingUp, 
    TrendingDown, 
    Calendar, 
    History, 
    Target, 
    AlertCircle,
    Loader2,
    DollarSign,
    BarChart3,
    Activity,
    ExternalLink,
    PieChart,
    Plus,
    Minus,
    Coins
} from "lucide-react"
import investmentService from "@/services/investment.service"
import { useAuthStore } from '@/stores/useAuthStore'
import { useTranslations } from 'next-intl'
import AddTransactionModal from "@/components/portfolio/AddTransactionModal"
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts'

interface InvestmentDetailProps {
    params: Promise<{ id: string }>
}

export default function InvestmentDetailPage({ params }: InvestmentDetailProps) {
    const { id } = use(params)
    const router = useRouter()
    const { user } = useAuthStore()
    const tCommon = useTranslations('common')
    
    const [investment, setInvestment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

    const fetchDetail = async () => {
        try {
            setLoading(true)
            const response = await investmentService.getInvestment(id)
            setInvestment(response.data.data)
        } catch (err) {
            console.error('Error fetching investment detail:', err)
            setError('No se pudo cargar el detalle de la inversión')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        fetchDetail()
    }, [id, user, router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
        )
    }

    if (error || !investment) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="max-w-md bg-card border-border">
                    <CardContent className="p-12 text-center text-red-500">
                        {error || "Inversión no encontrada"}
                        <Button onClick={() => router.back()} className="mt-4 w-full">Volver</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Mock data for the chart (Heatmap simulation and Price History)
    const chartData = [
        { name: 'Ene', value: investment.averagePrice * 0.95 },
        { name: 'Feb', value: investment.averagePrice * 0.98 },
        { name: 'Mar', value: investment.averagePrice * 1.05 },
        { name: 'Abr', value: investment.currentPrice },
    ]

    const heatmapData = Array.from({ length: 4 * 12 }, (_, i) => ({
        month: i % 12,
        year: 2023 + Math.floor(i / 12),
        value: Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5
    }))

    return (
        <div className="min-h-screen bg-background dark:text-gray-100">
            {/* Top Navigation & Status */}
            <header className="bg-background/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold">{investment.stockSymbol}</h1>
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                    {investment.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{investment.stockName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-2xl font-bold">€{investment.currentPrice?.toLocaleString()}</div>
                            <div className="text-xs text-green-400">+1.30 (0.24%)</div>
                        </div>
                        <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                            <Plus className="h-4 w-4 mr-2" />
                            Transacción
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Tabs for different views */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 border border-border">
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="portfolio">Cartera & Historial</TabsTrigger>
                        <TabsTrigger value="dividends">Dividendos</TabsTrigger>
                        <TabsTrigger value="analysis">Análisis AI</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-card border-border overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Activity size={40}/></div>
                                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">VALOR ACTUAL</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">€{investment.currentValue?.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">{investment.quantity} acciones</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">TOTAL INVERTIDO</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">€{investment.totalInvested?.toLocaleString()}</div>
                                    <div className="text-xs text-muted-foreground">Promedio: €{investment.averagePrice?.toFixed(2)}</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">GANANCIA TOTAL</CardTitle></CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${investment.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        €{investment.gainLoss?.toLocaleString()}
                                    </div>
                                    <div className={`text-xs ${investment.gainLossPercentage >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center gap-1`}>
                                        {investment.gainLossPercentage >= 0 ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                                        {investment.gainLossPercentage?.toFixed(2)}%
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card border-border">
                                <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">ESTRATEGIA</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-lg font-semibold flex items-center gap-2">
                                        <Target size={16} className="text-yellow-500" />
                                        {investment.strategy?.replace(/_/g, ' ')}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Holding period: {investment.performance?.holdingPeriodDays || 0} días</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Chart & News Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 bg-card border-border">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">Rendimiento Visual</CardTitle>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className="cursor-pointer">1M</Badge>
                                        <Badge variant="outline" className="cursor-pointer bg-yellow-500/10 text-yellow-500 border-yellow-500/20">YTD</Badge>
                                        <Badge variant="outline" className="cursor-pointer">MAX</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `€${val}`} />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                                    itemStyle={{ color: '#eab308' }}
                                                />
                                                <Area type="monotone" dataKey="value" stroke="#eab308" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="bg-card border-border">
                                    <CardHeader><CardTitle className="text-sm font-semibold">Sobre {investment.stockName}</CardTitle></CardHeader>
                                    <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        {investment.stockName} es una compañía líder en su sector. Actualmente forma parte de tu cartera {investment.strategy?.toLowerCase()} con un peso del 12% sobre el total.
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <Badge variant="outline">Growth</Badge>
                                            <Badge variant="outline">Tech</Badge>
                                            <Badge variant="outline">S&P 500</Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card border-border border-yellow-500/30 bg-yellow-500/5">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <AlertCircle size={16} className="text-yellow-500" />
                                            Alertas Activas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span>Stop Loss</span>
                                            <span className="font-bold text-red-400">€{(investment.averagePrice * 0.9).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span>Take Profit</span>
                                            <span className="font-bold text-green-400">€{(investment.averagePrice * 1.5).toFixed(2)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Heatmap Section */}
                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Mapa de Calor Mensual</CardTitle>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="w-3 h-3 bg-green-500/20 rounded-sm"></div>
                                    <span>Pérdida</span>
                                    <div className="w-3 h-3 bg-green-500/80 rounded-sm ml-2"></div>
                                    <span>Ganancia</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-12 gap-1 mb-2">
                                    {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
                                        <div key={`${m}-${i}`} className="text-[10px] text-center text-muted-foreground">{m}</div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1">
                                    {[2023, 2024, 2025, 2026].map(year => (
                                        <div key={year} className="flex gap-1 items-center">
                                            <div className="text-[10px] w-8 text-muted-foreground">{year}</div>
                                            <div className="flex-1 grid grid-cols-12 gap-1">
                                                {Array.from({ length: 12 }).map((_, m) => {
                                                    const val = Math.random() * 10 - 5;
                                                    const colorClass = val > 0 
                                                        ? val > 2 ? 'bg-green-500/80' : 'bg-green-500/40' 
                                                        : val < -2 ? 'bg-red-500/80' : 'bg-red-500/40';
                                                    return (
                                                        <div 
                                                            key={m} 
                                                            className={`h-6 rounded-sm ${colorClass} hover:ring-1 hover:ring-white/50 cursor-pointer transition-all`}
                                                            title={`${year}-${m+1}: ${val.toFixed(2)}%`}
                                                        ></div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="portfolio" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* History Table */}
                            <Card className="bg-card border-border">
                                <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><History size={20}/> Movimientos de {investment.stockSymbol}</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {investment.transactions && investment.transactions.length > 0 ? (
                                            investment.transactions.map((tx: any) => (
                                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-md border border-border/50 bg-muted/20">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-full ${tx.type === 'BUY' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                            {tx.type === 'BUY' ? <TrendingUp size={14} className="text-green-500"/> : <TrendingDown size={14} className="text-red-500"/>}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold">{tx.type} {tx.quantity} @ €{tx.unitPrice.toFixed(2)}</div>
                                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                <Calendar size={10}/> {new Date(tx.executedAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-bold">€{tx.netAmount.toLocaleString()}</div>
                                                        <Badge variant="outline" className="text-[9px] py-0">{tx.status}</Badge>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                                                <History className="h-12 w-12 mx-auto mb-4 opacity-20 text-yellow-500" />
                                                <p className="font-semibold mb-1">Sin movimientos registrados</p>
                                                <p className="text-xs mb-4">Añade tus compras pasadas para calcular el FIFO y la rentabilidad histórica.</p>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="border-yellow-600/50 text-yellow-500 hover:bg-yellow-500/10"
                                                    onClick={() => setIsTransactionModalOpen(true)}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> Registrar Compra Inicial
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border">
                                <CardHeader><CardTitle className="text-lg font-semibold flex items-center gap-2"><PieChart size={20}/> Análisis de Posición</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-border pb-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase">Dividendo estimado anual</p>
                                            <h3 className="text-2xl font-bold">€{(investment.performance?.dividendsReceived || 0).toFixed(2)}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground uppercase">YoC (Yield on Cost)</p>
                                            <h3 className="text-xl font-bold text-yellow-500">2.45%</h3>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Peso en Portfolio</span>
                                                <span>12.4%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '12.4%' }}></div>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Margen de Seguridad</span>
                                                <span>18.2%</span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 rounded-full" style={{ width: '18.2%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                            <p className="text-[10px] uppercase text-muted-foreground">Impuestos Estimados</p>
                                            <p className="font-bold">€124.50</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                            <p className="text-[10px] uppercase text-muted-foreground">Comisiones Pagadas</p>
                                            <p className="font-bold">€12.00</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="dividends" className="space-y-6">
                         <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Coins className="h-5 w-5 text-yellow-500"/> Métricas de Dividendos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground text-center uppercase">Dividend Yield (TTM)</p>
                                        <p className="text-3xl font-bold text-center">0.84%</p>
                                    </div>
                                    <div className="space-y-1 border-x border-border">
                                        <p className="text-xs text-muted-foreground text-center uppercase">Payout Ratio</p>
                                        <p className="text-3xl font-bold text-center">34.2%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground text-center uppercase">Crecimiento (5Y)</p>
                                        <p className="text-3xl font-bold text-center text-green-400">12.8%</p>
                                    </div>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { year: '2021', div: 1.2 },
                                            { year: '2022', div: 1.4 },
                                            { year: '2023', div: 1.6 },
                                            { year: '2024', div: 1.8 },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                            <XAxis dataKey="year" stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false}/>
                                            <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false}/>
                                            <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} />
                                            <Bar dataKey="div" fill="#eab308" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analysis" className="space-y-6">
                        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="text-yellow-500" />
                                    Análisis Prospectivo (Antigravity AI)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-background/50 border border-border">
                                    <p className="text-sm italic leading-relaxed">
                                        "Basado en tu precio promedio de €{investment.averagePrice?.toFixed(2)}, tu posición en {investment.stockSymbol} presenta un margen de seguridad sólido. 
                                        La correlación con el resto de tu cartera es baja, lo que ayuda a la diversificación. 
                                        Se recomienda mantener la estrategia de {investment.strategy?.replace(/_/g, ' ')} dada la baja volatilidad actual."
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-lg text-center">
                                        <p className="text-[10px] text-muted-foreground font-bold">RATING AI</p>
                                        <p className="text-green-400 font-bold">BUY</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-lg text-center">
                                        <p className="text-[10px] text-muted-foreground font-bold">OBJETIVO</p>
                                        <p className="text-yellow-500 font-bold">€{(investment.currentPrice * 1.25).toFixed(0)}</p>
                                    </div>
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-center">
                                        <p className="text-[10px] text-muted-foreground font-bold">RIESGO</p>
                                        <p className="text-blue-400 font-bold">BAJO</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onSuccess={fetchDetail}
                investment={investment}
            />
        </div>
    )
}
