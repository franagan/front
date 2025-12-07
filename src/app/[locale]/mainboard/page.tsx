'use client'

import { useAuthStore } from "../../../stores/useAuthStore"
import { usePathname, useRouter } from "@/i18n/navigation"
import { startTransition, useEffect, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    PiggyBank,
    LineChart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Target,
    Activity,
    BarChart3,
    PieChart,
    Sun,
    Moon
} from "lucide-react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from 'next-intl';

export default function MainBoardPage() {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const pathname = usePathname();
    const t = useTranslations('mainboard');
    const router = useRouter()
    const { user, logout } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const tNav = useTranslations('navigation');
    const firstName = user?.firstName


    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    const onLanguageChange = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    // Datos de ejemplo - estos vendrían de la API
    const financialSummary = {
        netWorth: 45750.50,
        monthlyChange: 2340.25,
        monthlyChangePercent: 5.4,
        totalInvestments: 32500.00,
        investmentReturn: 18.5,
        monthlyInvestmentReturn: 2.1,
        dailyInvestmentReturn: -0.3,
        positions: 8,
        totalSavings: 13250.50,
        monthlyIncome: 3500.00,
        monthlyExpenses: 2100.00,
        savingsRate: 40
    }

    const budgetCategories = [
        { name: t('budget.categories.housing'), spent: 800, budget: 900, color: 'bg-blue-500' },
        { name: t('budget.categories.food'), spent: 450, budget: 500, color: 'bg-green-500' },
        { name: t('budget.categories.transport'), spent: 180, budget: 200, color: 'bg-yellow-500' },
        { name: t('budget.categories.leisure'), spent: 320, budget: 300, color: 'bg-purple-500' },
        { name: t('budget.categories.other'), spent: 350, budget: 400, color: 'bg-pink-500' }
    ]

    const savingsGoals = [
        { name: t('goals.emergencyFund'), current: 8000, target: 10000, icon: '🛡️' },
        { name: t('goals.travel'), current: 2500, target: 5000, icon: '✈️' },
        { name: t('goals.realEstate'), current: 15000, target: 50000, icon: '🏠' }
    ]



    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-background/50 dark:bg-gray-900/50 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Inversión Libre</h1>
                                <p className="text-sm text-muted-foreground">{t('dashboard')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-muted-foreground">{t('welcome')}</p>
                                <p className="font-semibold">{firstName}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    logout()
                                    router.push('/')
                                }}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                {tNav('logout')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                            {/* Selector de Idioma */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onLanguageChange}
                                disabled={isPending}
                                className="border-border text-foreground hover:bg-accent min-w-[3rem] hover:bg-yellow-600"
                            >
                                {locale === 'es' ? 'ES' : 'EN'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Resumen Financiero Principal */}
                <section className="mb-8">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="h-8 w-8 text-yellow-400" />
                        {t('financialSummary')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Patrimonio Neto */}
                        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <Wallet className="h-4 w-4" />
                                    {t('netWorth')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-2">
                                    €{financialSummary.netWorth.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    {financialSummary.monthlyChangePercent > 0 ? (
                                        <ArrowUpRight className="h-4 w-4" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4" />
                                    )}
                                    <span className="font-semibold">
                                        +€{financialSummary.monthlyChange.toLocaleString('es-ES')} ({financialSummary.monthlyChangePercent}%)
                                    </span>
                                    <span className="text-black/70">{t('thisMonth')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inversiones */}
                        <Card className="bg-card border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <LineChart className="h-4 w-4" />
                                    {t('investments')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-2">
                                    €{financialSummary.totalInvestments.toLocaleString('es-ES')}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-green-400">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="font-semibold">+{financialSummary.investmentReturn}%</span>
                                    <span className="text-muted-foreground">{t('totalReturn')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ahorro */}
                        <Card className="bg-card border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <PiggyBank className="h-4 w-4" />
                                    {t('totalSavings')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-2">
                                    €{financialSummary.totalSavings.toLocaleString('es-ES')}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-blue-400">
                                    <Target className="h-4 w-4" />
                                    <span className="font-semibold">{financialSummary.savingsRate}%</span>
                                    <span className="text-muted-foreground">{t('savingsRate')}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Flujo de Caja */}
                        <Card className="bg-card border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    {t('monthlyCashFlow')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold mb-2 text-green-400">
                                    +€{(financialSummary.monthlyIncome - financialSummary.monthlyExpenses).toLocaleString('es-ES')}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    <div>{t('income')}: €{financialSummary.monthlyIncome.toLocaleString('es-ES')}</div>
                                    <div>{t('expenses')}: €{financialSummary.monthlyExpenses.toLocaleString('es-ES')}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Inversiones Detalle */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="h-7 w-7 text-yellow-400" />
                        {t('portfolio.title')}
                    </h2>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">{t('portfolio.totalValue')}</div>
                                    <div className="text-2xl font-bold">€{financialSummary.totalInvestments.toLocaleString('es-ES')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">{t('portfolio.totalReturn')}</div>
                                    <div className="text-2xl font-bold text-green-400">+{financialSummary.investmentReturn}%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">{t('portfolio.monthlyReturn')}</div>
                                    <div className="text-2xl font-bold text-green-400">+{financialSummary.monthlyInvestmentReturn}%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">{t('portfolio.dailyReturn')}</div>
                                    <div className={`text-2xl font-bold ${financialSummary.dailyInvestmentReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {financialSummary.dailyInvestmentReturn >= 0 ? '+' : ''}{financialSummary.dailyInvestmentReturn}%
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-muted-foreground mb-1">{t('portfolio.positions')}</div>
                                    <div className="text-2xl font-bold">{financialSummary.positions}</div>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                                    {t('portfolio.viewFull')}
                                </Button>
                                <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-accent">
                                    {t('portfolio.addInvestment')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Presupuesto y Objetivos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Presupuesto */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <PieChart className="h-7 w-7 text-yellow-400" />
                            {t('budget.title')}
                        </h2>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {budgetCategories.map((category) => {
                                        const percentage = (category.spent / category.budget) * 100
                                        const isOverBudget = percentage > 100

                                        return (
                                            <div key={category.name}>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-medium">{category.name}</span>
                                                    <span className={`font-semibold ${isOverBudget ? 'text-red-400' : 'text-foreground'}`}>
                                                        €{category.spent} / €{category.budget}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2.5">
                                                    <div
                                                        className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700">
                                    {t('budget.manage')}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Objetivos de Ahorro */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Target className="h-7 w-7 text-yellow-400" />
                            {t('goals.title')}
                        </h2>

                        <Card className="bg-card border-border">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {savingsGoals.map((goal) => {
                                        const percentage = (goal.current / goal.target) * 100

                                        return (
                                            <div key={goal.name}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{goal.icon}</span>
                                                        <span className="font-medium">{goal.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2.5 mb-1">
                                                    <div
                                                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2.5 rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    €{goal.current.toLocaleString('es-ES')} de €{goal.target.toLocaleString('es-ES')}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Button className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700">
                                    {t('goals.add')}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Acciones Rápidas */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">{t('quickActions.title')}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-card border-border hover:border-yellow-400 transition-colors cursor-pointer group">
                            <CardContent className="p-6 text-center">
                                <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                    <DollarSign className="h-6 w-6 text-yellow-400" />
                                </div>
                                <h3 className="font-semibold mb-2">{t('quickActions.addExpense.title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('quickActions.addExpense.description')}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400 transition-colors cursor-pointer group">
                            <CardContent className="p-6 text-center">
                                <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                    <LineChart className="h-6 w-6 text-yellow-400" />
                                </div>
                                <h3 className="font-semibold mb-2">{t('quickActions.analyzeStock.title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('quickActions.analyzeStock.description')}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400 transition-colors cursor-pointer group">
                            <CardContent className="p-6 text-center">
                                <div className="h-12 w-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                    <Calendar className="h-6 w-6 text-yellow-400" />
                                </div>
                                <h3 className="font-semibold mb-2">{t('quickActions.fireCalculator.title')}</h3>
                                <p className="text-sm text-muted-foreground">{t('quickActions.fireCalculator.description')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    )
}