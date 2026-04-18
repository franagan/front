'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ArrowLeft,
    PieChart as PieChartIcon,
    Plus,
    Loader2,
    ArrowUpDown,
    History,
    TrendingUp,
    TrendingDown,
    Filter,
    Layers,
    Target,
    Upload
} from "lucide-react"
import { useTranslations } from 'next-intl'
import portfolioService from "@/services/portfolio.service"
import investmentService from "@/services/investment.service"
import { Portfolio, Investment, AssetType } from "@/types/portfolio.types"
import AddTransactionModal from "@/components/portfolio/AddTransactionModal"
import CreatePortfolioModal from "@/components/portfolio/CreatePortfolioModal"
import BrokerImportModal from "@/components/portfolio/BrokerImportModal"
import { ExportButtons } from "@/components/reports/ExportButtons"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { cn } from "@/lib/utils"
import StockSearch from "@/components/mainboard/StockSearch"

export default function PortfolioPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('portfolio')
    const tCommon = useTranslations('common')

    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
    const [allInvestments, setAllInvestments] = useState<Investment[]>([])
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'name' | 'value' | 'return' | 'gainLoss'>('value')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [distributionMode, setDistributionMode] = useState<'ticker' | 'category'>('ticker')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const portfoliosResponse = await portfolioService.getPortfolios()
                const userPortfolios = portfoliosResponse.data.data

                if (userPortfolios && userPortfolios.length > 0) {
                    setPortfolios(userPortfolios)
                    const allInvs: Investment[] = []
                    for (const p of userPortfolios) {
                        try {
                            const investmentsResponse = await investmentService.getInvestments(p.id)
                            allInvs.push(...investmentsResponse.data.data)
                        } catch (err) {
                            console.error(`Error loading investments for portfolio ${p.id}:`, err)
                        }
                    }
                    setAllInvestments(allInvs)
                    setPortfolio(userPortfolios[0])
                }
            } catch (err) {
                console.error('Error fetching portfolio data:', err)
                setError('Error al cargar los datos')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user, router])

    const investments = selectedPortfolioId
        ? allInvestments.filter(inv => inv.portfolioId === selectedPortfolioId)
        : allInvestments

    const groupedInvestments = useMemo(() => {
        const groups: Record<string, any> = {};
        investments.forEach(inv => {
            const sym = inv.stockSymbol;
            if (!groups[sym]) {
                groups[sym] = { ...inv };
            } else {
                const g = groups[sym];
                g.quantity += (inv.quantity || 0);
                g.totalInvested += (inv.totalInvested || 0);
                g.currentValue += (inv.currentValue || 0);
                g.averagePrice = g.quantity > 0 ? g.totalInvested / g.quantity : 0;
                g.gainLoss = g.currentValue - g.totalInvested;
                g.gainLossPercentage = g.totalInvested > 0 ? (g.gainLoss / g.totalInvested) * 100 : 0;
            }
        });
        return Object.values(groups);
    }, [investments]);

    const sortedInvestments = useMemo(() => {
        let filtered = [...groupedInvestments];
        if (selectedCategory !== 'ALL') {
            filtered = filtered.filter(inv => {
                const type = inv.assetType || 'STOCK';
                return type === selectedCategory;
            });
        }

        return filtered.sort((a, b) => {
            let comp = 0;
            if (sortBy === 'name') comp = (a.stockName || '').localeCompare(b.stockName || '');
            else if (sortBy === 'value') comp = (a.currentValue || 0) - (b.currentValue || 0);
            else if (sortBy === 'return') comp = (a.gainLossPercentage || 0) - (b.gainLossPercentage || 0);
            else if (sortBy === 'gainLoss') comp = (a.gainLoss || 0) - (b.gainLoss || 0);
            return sortOrder === 'asc' ? comp : -comp;
        });
    }, [groupedInvestments, sortBy, sortOrder, selectedCategory]);

    const stats = useMemo(() => {
        const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
        const totalInvested = investments.reduce((sum, inv) => sum + (inv.totalInvested || 0), 0)
        
        // Find Winners/Losers
        const sortedByReturn = [...groupedInvestments].sort((a, b) => (b.gainLossPercentage || 0) - (a.gainLossPercentage || 0))
        const winner = sortedByReturn[0] || null
        const loser = sortedByReturn[sortedByReturn.length - 1] || null

        return {
            totalValue,
            totalInvested,
            gainLoss: totalValue - totalInvested,
            return: totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0,
            winner,
            loser
        }
    }, [investments, groupedInvestments])

    const TICKER_COLORS: Record<string, string> = {
        'AAPL': '#A2AAAD',   // Apple Silver
        'GOOG': '#4285F4',   // Google Blue
        'GOOGL': '#4285F4',
        'MSFT': '#00A4EF',   // Microsoft Blue
        'AMZN': '#FF9900',   // Amazon Orange
        'TSLA': '#E81010',   // Tesla Red
        'META': '#0668E1',   // Meta Blue
        'NVDA': '#76B900',   // Nvidia Green
        'BTC': '#F7931A',    // Bitcoin Orange
        'ETH': '#627EEA',    // Ethereum Blue
        'EUR': '#2e5baf',
        'USD': '#85bb65',
    }

    const pieChartData = useMemo(() => {
        if (distributionMode === 'ticker') {
            return groupedInvestments.map(inv => ({ 
                name: inv.stockSymbol, 
                value: inv.currentValue || 0,
                color: TICKER_COLORS[inv.stockSymbol.toUpperCase()]
            }))
            .sort((a, b) => b.value - a.value)
        } else {
            const catMap: Record<string, number> = {}
            investments.forEach(inv => {
                const cat = inv.assetType === 'STOCK' ? 'Acciones' : 
                            inv.assetType === 'CRYPTO' ? 'Cripto' : 
                            inv.assetType === 'REAL_ESTATE' ? 'Inmuebles' :
                            inv.assetType === 'MUTUAL_FUND' ? 'Fondos' :
                            inv.assetType === 'ETF' ? 'ETFs' :
                            inv.assetType || 'Otros'
                catMap[cat] = (catMap[cat] || 0) + (inv.currentValue || 0)
            })
            return Object.entries(catMap).map(([name, value]) => ({ 
                name, 
                value,
                color: undefined as string | undefined
            }))
                .sort((a, b) => b.value - a.value)
        }
    }, [investments, groupedInvestments, distributionMode])

    const COLORS = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#facc15', '#ef4444', '#06b6d4']

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
    )

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Nav Header */}
            <header className="bg-card/50 border-b border-border sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/mainboard')} className="rounded-xl">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tight">MI <span className="text-orange-500">PORTFOLIO</span></h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Personal Wealth center</p>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center max-w-md px-8">
                        <StockSearch />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)} className="rounded-xl border-border font-bold">
                            <Upload className="h-4 w-4 mr-2" /> Importar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsCreatePortfolioModalOpen(true)} className="rounded-xl border-border font-bold">
                            <Plus className="h-4 w-4 mr-2" /> Portafolio
                        </Button>
                        <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black">
                            <Plus className="h-4 w-4 mr-2" /> POSICIÓN
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Global Stats bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card border-border border-l-4 border-l-orange-500 rounded-2xl p-6 shadow-xl">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Capital Actual</p>
                        <p className="text-3xl font-black">€{stats.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                    </Card>
                    <Card className="bg-card border-border rounded-2xl p-6 shadow-xl">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">P/L Total</p>
                        <p className={cn("text-3xl font-black", stats.gainLoss >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {stats.gainLoss >= 0 ? "+" : ""}€{stats.gainLoss.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </p>
                    </Card>
                    <Card className="bg-card border-border rounded-2xl p-6 shadow-xl">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Rentabilidad</p>
                        <p className={cn("text-3xl font-black", stats.return >= 0 ? "text-emerald-500" : "text-red-500")}>
                            {stats.return >= 0 ? "+" : ""}{stats.return.toFixed(2)}%
                        </p>
                    </Card>
                    <Card className="bg-orange-500 rounded-2xl p-6 shadow-xl shadow-orange-500/10 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-80 mb-1">Mejor Activo</p>
                                <p className="text-xl font-black">{stats.winner?.stockSymbol || "N/A"}</p>
                                <p className="text-xs font-bold">+{stats.winner?.gainLossPercentage?.toFixed(2)}%</p>
                            </div>
                            <TrendingUp className="h-4 w-4 opacity-50" />
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Distribution Chart Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-muted/30">
                                <CardTitle className="text-sm font-black flex items-center gap-2">
                                    <PieChartIcon className="h-4 w-4 text-orange-500" /> DISTRIBUCIÓN
                                </CardTitle>
                                <div className="flex bg-background rounded-lg p-1 border border-border">
                                    <button 
                                        onClick={() => setDistributionMode('category')}
                                        className={cn("px-2 py-1 text-[10px] font-black rounded-md transition-all", distributionMode === 'category' ? "bg-orange-500 text-white" : "text-muted-foreground")}
                                    >TIPO</button>
                                    <button 
                                        onClick={() => setDistributionMode('ticker')}
                                        className={cn("px-2 py-1 text-[10px] font-black rounded-md transition-all", distributionMode === 'ticker' ? "bg-orange-500 text-white" : "text-muted-foreground")}
                                    >TICKER</button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#18181b', color: '#fff' }} 
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value: number) => `€${value.toLocaleString()}`}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2 mt-4">
                                    {pieChartData.slice(0, 4).map((entry, i) => (
                                        <div key={entry.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || COLORS[i % COLORS.length] }} />
                                                <span className="font-bold">{entry.name}</span>
                                            </div>
                                            <span className="text-muted-foreground">€{entry.value.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Loser and Performance Stats */}
                        <Card className="bg-card border-border rounded-[2rem] p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">En Revisión</h3>
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-red-500/10 p-4 rounded-2xl">
                                    <Target className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-lg font-black">{stats.loser?.stockSymbol || "N/A"}</p>
                                    <p className="text-xs text-red-500 font-bold">{stats.loser?.gainLossPercentage?.toFixed(2)}% desde la compra</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Tab Filters */}
                        <div className="flex gap-2 p-1 bg-muted/30 border border-border rounded-2xl overflow-x-auto no-scrollbar">
                            {['ALL', 'STOCK', 'ETF', 'CRYPTO', 'COMMODITY', 'REAL_ESTATE', 'MUTUAL_FUND'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all whitespace-nowrap",
                                        selectedCategory === cat 
                                            ? "bg-orange-500 text-black shadow-lg" 
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {cat === 'ALL' ? 'GENERAL' : 
                                     cat === 'STOCK' ? 'ACCIONES' :
                                     cat === 'MUTUAL_FUND' ? 'FONDOS' :
                                     cat === 'COMMODITY' ? 'ORO/METALES' :
                                     cat === 'REAL_ESTATE' ? 'INMUEBLES' : cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex bg-card p-1 border border-border rounded-xl">
                                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                                    <SelectTrigger className="h-9 border-0 bg-transparent text-xs font-black uppercase tracking-tight w-[160px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="value">Valor</SelectItem>
                                        <SelectItem value="return">Rentabilidad</SelectItem>
                                        <SelectItem value="gainLoss">P/L €</SelectItem>
                                        <SelectItem value="name">Nombre</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="h-9 w-9">
                                    <ArrowUpDown className={cn("h-4 w-4 transition-all", sortOrder === 'desc' ? "rotate-180" : "")} />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <ExportButtons type="portfolio" variant="outline" size="sm" className="rounded-xl h-11" />
                                <Button 
                                    variant="outline" size="sm" className="rounded-xl h-11 h-11"
                                    onClick={() => router.push('/mainboard/portfolio/transactions')}
                                >
                                    <History className="h-4 w-4 mr-2" /> Historial
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {sortedInvestments.map((inv) => (
                                <Card 
                                    key={inv.id} 
                                    onClick={() => router.push(`/mainboard/portfolio/stock/${inv.stockSymbol}`)}
                                    className="bg-card border-border hover:border-orange-500/50 hover:bg-orange-500/[0.02] cursor-pointer transition-all rounded-3xl p-6 shadow-lg group relative overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-xl shadow-inner", 
                                                inv.assetType === AssetType.CRYPTO ? "bg-orange-500/10 text-orange-500" :
                                                inv.assetType === AssetType.STOCK ? "bg-blue-500/10 text-blue-500" :
                                                inv.assetType === AssetType.REAL_ESTATE ? "bg-emerald-500/10 text-emerald-500" : "bg-muted"
                                            )}>
                                                {inv.stockSymbol.slice(0, 1)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-black group-hover:text-orange-500 transition-colors uppercase italic">{inv.stockName}</h3>
                                                    <Badge variant="outline" className="text-[9px] font-black uppercase text-muted-foreground bg-muted/30 border-0">{inv.assetType || "Acción"}</Badge>
                                                </div>
                                                <p className="text-[11px] font-bold text-muted-foreground mt-1">
                                                    {inv.stockSymbol} • {inv.quantity.toLocaleString()} UNIDADES
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-8 md:gap-16">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Valorización</p>
                                                <p className="text-xl font-black">€{inv.currentValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                            <div className="text-right pointer-events-none">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Resultado</p>
                                                <div className={cn("text-lg font-black", inv.gainLoss >= 0 ? "text-emerald-500" : "text-red-500")}>
                                                    {inv.gainLoss >= 0 ? "+" : ""}€{inv.gainLoss.toFixed(2)}
                                                </div>
                                                <div className={cn("text-xs font-bold", inv.gainLoss >= 0 ? "text-emerald-500" : "text-red-500")}>
                                                    {inv.gainLoss >= 0 ? "+" : ""}{inv.gainLossPercentage.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Small subtle bar at bottom */}
                                    <div className={cn("absolute bottom-0 left-0 h-1 transition-all group-hover:h-2", inv.gainLoss >= 0 ? "bg-emerald-500" : "bg-red-500")} style={{ width: '100%', opacity: 0.3 }} />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => window.location.reload()} />
                <CreatePortfolioModal isOpen={isCreatePortfolioModalOpen} onClose={() => setIsCreatePortfolioModalOpen(false)} onSuccess={() => window.location.reload()} />
                <BrokerImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} portfolioId={portfolio?.id} onSuccess={() => window.location.reload()} />
            </main>
        </div>
    )
}
