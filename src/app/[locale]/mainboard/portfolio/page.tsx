'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    ArrowLeft,
    PieChart,
    Plus,
    Loader2,
    ArrowUpDown
} from "lucide-react"
import { useTranslations } from 'next-intl'
import portfolioService from "@/services/portfolio.service"
import investmentService from "@/services/investment.service"
import { Portfolio, Investment } from "@/types/portfolio.types"
import AddInvestmentModal from "@/components/portfolio/AddInvestmentModal"
import CreatePortfolioModal from "@/components/portfolio/CreatePortfolioModal"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function PortfolioPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('portfolio')
    const tCommon = useTranslations('common')

    const [portfolios, setPortfolios] = useState<Portfolio[]>([])
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
    const [allInvestments, setAllInvestments] = useState<Investment[]>([])
    const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null) // null = "All Portfolios"
    const [sortBy, setSortBy] = useState<'name' | 'value' | 'return' | 'gainLoss'>('value')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        // Fetch all portfolios and their investments
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get user's portfolios
                const portfoliosResponse = await portfolioService.getPortfolios()
                const userPortfolios = portfoliosResponse.data.data

                if (userPortfolios && userPortfolios.length > 0) {
                    setPortfolios(userPortfolios)

                    // Load investments from ALL portfolios
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

                    // Set first portfolio as selected (for compatibility)
                    setPortfolio(userPortfolios[0])
                    console.log('Loaded', userPortfolios.length, 'portfolios with', allInvs.length, 'total investments')
                } else {
                    console.log('No portfolios found')
                    // Portfolio will remain null, showing empty state
                }
            } catch (err) {
                console.error('Error fetching portfolio data:', err)
                const errorPayload = err as { response?: { data?: { message?: string } } };
                setError(errorPayload.response?.data?.message || 'Error al cargar los datos')
            } finally {


                setLoading(false)
            }
        }

        fetchData()
    }, [user, router])

    // Filter investments based on selected portfolio
    const investments = selectedPortfolioId
        ? allInvestments.filter(inv => inv.portfolioId === selectedPortfolioId)
        : allInvestments

    // Sort investments
    const sortedInvestments = [...investments].sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
            case 'name':
                comparison = a.stockName.localeCompare(b.stockName)
                break
            case 'value':
                comparison = (a.currentValue || 0) - (b.currentValue || 0)
                break
            case 'return':
                comparison = (a.gainLossPercentage || 0) - (b.gainLossPercentage || 0)
                break
            case 'gainLoss':
                comparison = (a.gainLoss || 0) - (b.gainLoss || 0)
                break
        }
        return sortOrder === 'asc' ? comparison : -comparison
    })

    if (!user) {
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
                    <p className="text-muted-foreground">{tCommon('loading')}</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="bg-card border-border max-w-md">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-yellow-600 hover:bg-yellow-700">
                            {tCommon('retry')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Show empty state if no portfolio exists
    if (!portfolio) {
        return (
            <div className="min-h-screen bg-background">
                <header className="bg-background/50 dark:bg-neutral-950/80 dark:text-white border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/mainboard')}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {tCommon('back')}
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">{t('title')}</h1>
                                <p className="text-sm text-muted-foreground dark:text-gray-300">{t('subtitle')}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <PieChart className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold mb-2">No tienes portfolios</h2>
                                <p className="text-muted-foreground mb-6">
                                    Crea tu primer portfolio para empezar a gestionar tus inversiones
                                </p>
                                <Button
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                    onClick={() => setIsCreatePortfolioModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Portfolio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create Portfolio Modal */}
                    <CreatePortfolioModal
                        isOpen={isCreatePortfolioModalOpen}
                        onClose={() => setIsCreatePortfolioModalOpen(false)}
                        onSuccess={() => {
                            // Reload page to show new portfolio
                            window.location.reload();
                        }}
                    />
                </main>
            </div>
        )
    }

    // Calculate global totals from filtered investments
    const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue || 0), 0)
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.totalInvested || 0), 0)
    const totalGainLoss = totalValue - totalInvested
    const totalReturn = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

    // Prepare data for Pie Chart
    const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1']
    const pieChartData = investments.reduce((acc, inv) => {
        const existing = acc.find(item => item.name === inv.stockSymbol)
        if (existing) {
            existing.value += inv.currentValue || 0
        } else {
            acc.push({ name: inv.stockSymbol, value: inv.currentValue || 0 })
        }
        return acc
    }, [] as { name: string; value: number }[])
        .sort((a, b) => b.value - a.value)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background/50 dark:bg-neutral-950/80 dark:text-white border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/mainboard')}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {tCommon('back')}
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">{t('title')}</h1>
                                <p className="text-sm text-muted-foreground dark:text-gray-300">
                                    {portfolios.length} {portfolios.length === 1 ? 'Portfolio' : 'Portfolios'} • {investments.length} {investments.length === 1 ? 'Posición' : 'Posiciones'}
                                </p>
                            </div>
                        </div>

                        {/* Create Portfolio Button */}
                        <Button
                            variant="outline"
                            onClick={() => setIsCreatePortfolioModalOpen(true)}
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Portfolio
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Portfolio Selector and Sort Controls */}
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                    {/* Portfolio Selector */}
                    <div className="flex-1 w-full md:w-auto">
                        <Select
                            value={selectedPortfolioId || "all"}
                            onValueChange={(value) => setSelectedPortfolioId(value === "all" ? null : value)}
                        >
                            <SelectTrigger className="w-full md:max-w-xs">
                                <SelectValue placeholder="Seleccionar portfolio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    📊 Todos los Portfolios
                                </SelectItem>
                                {portfolios.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name} - €{(p.totalValue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Controls */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="value">Ordenar por Valor</SelectItem>
                                <SelectItem value="return">Ordenar por Retorno %</SelectItem>
                                <SelectItem value="gainLoss">Ordenar por Ganancia</SelectItem>
                                <SelectItem value="name">Ordenar por Nombre</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{t('totalValue')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                €{totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalReturn')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{t('positions')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {investments.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Asset Allocation Chart */}
                {investments.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 mb-8">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Distribución de Activos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full flex justify-center">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={150}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                    const RADIAN = Math.PI / 180;
                                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                    const angle = (midAngle || 0) * -1;
                                                    const x = cx + radius * Math.cos(angle * RADIAN);
                                                    const y = cy + radius * Math.sin(angle * RADIAN);

                                                    return (
                                                        <text
                                                            x={x}
                                                            y={y}
                                                            fill="white"
                                                            textAnchor={x > cx ? 'start' : 'end'}
                                                            dominantBaseline="central"
                                                            className="text-sm font-bold drop-shadow-md"
                                                        >
                                                            {`${((percent || 0) * 100).toFixed(0)}%`}
                                                        </text>
                                                    );
                                                }}
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => `€${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`}
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                                itemStyle={{ color: '#f3f4f6' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add Position Button */}
                <div className="mb-6">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addPosition')}
                    </Button>
                </div>

                {/* Positions List */}
                <Card className="bg-card border-border mb-8">
                    <CardHeader>
                        <CardTitle>{t('positions')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedInvestments.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                No hay posiciones en {selectedPortfolioId ? 'este portfolio' : 'tus portfolios'}
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {sortedInvestments.map((investment) => (
                                    <div
                                        key={investment.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{investment.stockSymbol}</h3>
                                            <p className="text-sm text-muted-foreground">{investment.stockName}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {investment.quantity} acciones @ €{investment.averagePrice?.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                €{(investment.currentValue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                            </div>
                                            <div className={`text-sm ${(investment.gainLossPercentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {(investment.gainLossPercentage || 0) >= 0 ? '+' : ''}
                                                {(investment.gainLossPercentage || 0).toFixed(2)}%
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {(investment.gainLoss || 0) >= 0 ? '+' : ''}
                                                €{(investment.gainLoss || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add Investment Modal */}
                <AddInvestmentModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={async () => {
                        // Refresh all investments from all portfolios
                        try {
                            const allInvs: Investment[] = []
                            for (const p of portfolios) {
                                const investmentsResponse = await investmentService.getInvestments(p.id)
                                allInvs.push(...investmentsResponse.data.data)
                            }
                            setAllInvestments(allInvs)
                        } catch (err) {
                            console.error('Error refreshing investments:', err)
                        }
                    }}
                />

                {/* Create Portfolio Modal */}
                <CreatePortfolioModal
                    isOpen={isCreatePortfolioModalOpen}
                    onClose={() => setIsCreatePortfolioModalOpen(false)}
                    onSuccess={() => {
                        // Reload page to show new portfolio
                        window.location.reload();
                    }}
                />
            </main>
        </div>
    )
}
