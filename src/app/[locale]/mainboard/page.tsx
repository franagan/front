'use client'

import { useAuthStore } from "../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import {
    TrendingUp,
    Wallet,
    PiggyBank,
    LineChart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Activity,
    BarChart3,
    PieChart,
    Plus
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts'
import { Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'
import portfolioService from "@/services/portfolio.service"
import investmentService from "@/services/investment.service"
import budgetService from "@/services/budget.service"
import goalService from "@/services/goal.service"
import incomeService from "@/services/income.service"
import stockService from "@/services/stock.service"
import expenseService from "@/services/expense.service"
import { Investment } from "@/types/portfolio.types"
import { BudgetCategory } from "@/types/budget.types"
import { SavingsGoal } from "@/types/goal.types"
import { IncomeSource } from "@/types/income.types"
import { Expense } from "@/types/expense.types"
import CreateBudgetModal from "@/components/budget/CreateBudgetModal"
import CreateGoalModal from "@/components/goals/CreateGoalModal"
import CreateIncomeModal from "@/components/income/CreateIncomeModal"
import FinancialCharts from "@/components/dashboard/FinancialCharts"

export default function MainBoardPage() {
    const t = useTranslations('mainboard')
    const tCommon = useTranslations('common')
    const router = useRouter()
    const { user } = useAuthStore()

    // Real Data State
    const [portfolioData, setPortfolioData] = useState({
        totalValue: 0,
        totalReturn: 0,
        positions: 0,
        dailyReturn: 0
    })
    const [budgets, setBudgets] = useState<BudgetCategory[]>([])
    const [goals, setGoals] = useState<SavingsGoal[]>([])
    const [incomes, setIncomes] = useState<IncomeSource[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])

    // Modal States
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)

    // Data Fetching
    const fetchData = async () => {
        try {
            // 1. Fetch primary data in parallel
            const [portfoliosResp, budgetsResp, goalsResp, incomesResp, expensesResp] = await Promise.all([
                portfolioService.getPortfolios().catch(err => { console.error("Error loading portfolios", err); return { data: { data: [] } } }),
                budgetService.getBudgets().catch(err => { console.error("Error loading budgets", err); return { data: { data: [] } } }),
                goalService.getGoals().catch(err => { console.error("Error loading goals", err); return { data: { data: [] } } }),
                incomeService.getIncomes().catch(err => { console.error("Error loading incomes", err); return { data: { data: [] } } }),
                expenseService.getExpenses().catch(err => { console.error("Error loading expenses", err); return { data: { data: [] } } })
            ])

            const userPortfolios = portfoliosResp.data.data
            setBudgets(budgetsResp.data.data || [])
            setGoals(goalsResp.data.data || [])
            setIncomes(incomesResp.data.data || [])
            setExpenses(expensesResp.data.data || [])

            let totalValue = 0
            let totalInvested = 0
            let positions = 0
            let weightedDailyChangeSum = 0

            if (userPortfolios && userPortfolios.length > 0) {
                const investmentsPromises = userPortfolios.map((p: { id: string }) => investmentService.getInvestments(p.id))
                const investmentsResponses = await Promise.all(investmentsPromises)

                const allInvestments: Investment[] = []
                const symbolsToFetch = new Set<string>()

                investmentsResponses.forEach(resp => {
                    const invs = resp.data.data || []
                    allInvestments.push(...invs)
                    invs.forEach((inv: Investment) => {
                        if (inv.stockSymbol) symbolsToFetch.add(inv.stockSymbol)
                    })
                })

                // 3. Fetch real-time quotes in parallel
                const quoteMap = new Map<string, { price: number, changePercent: number }>()
                await Promise.all(
                    Array.from(symbolsToFetch).map(async (symbol) => {
                        try {
                            const quote = await stockService.getStockQuote(symbol)
                            if (quote && quote.price) {
                                quoteMap.set(symbol, {
                                    price: quote.price,
                                    changePercent: quote.changePercent || 0
                                })
                            }
                        } catch (e) {
                            console.error(`Failed to fetch quote for ${symbol}`, e)
                        }
                    })
                )

                // Calculate totals with fresh prices
                allInvestments.forEach(inv => {
                    const quote = quoteMap.get(inv.stockSymbol)
                    const currentPrice = quote?.price ?? inv.currentPrice ?? inv.averagePrice
                    const quantity = inv.quantity || 0
                    const currentValue = quantity * currentPrice
                    const invested = inv.totalInvested || (quantity * (inv.averagePrice || 0))

                    totalValue += currentValue
                    totalInvested += invested
                    positions++
                })

                // Calculate Weighted Daily Return
                if (totalValue > 0) {
                    allInvestments.forEach(inv => {
                        const quote = quoteMap.get(inv.stockSymbol)
                        if (quote) {
                            const quantity = inv.quantity || 0
                            const currentVal = quantity * quote.price
                            const weight = currentVal / totalValue
                            weightedDailyChangeSum += (weight * quote.changePercent)
                        }
                    })
                }
            }

            const totalGainLoss = totalValue - totalInvested
            const totalReturn = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0

            setPortfolioData({
                totalValue,
                totalReturn,
                positions,
                dailyReturn: weightedDailyChangeSum
            })

        } catch (err) {
            console.error('Error fetching dashboard data:', err)
        }
    }

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchData()
    }, [user, router])

    if (!user) {
        return null
    }

    // Aggregation Logic for Budgets
    const aggregatedBudgets = budgets.reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name)
        const currentSpent = Number(current.spent) || 0
        const currentLimit = Number(current.limit) || 0

        if (existing) {
            existing.spent += currentSpent
            existing.limit = Math.max(existing.limit, currentLimit)
        } else {
            acc.push({ ...current, spent: currentSpent, limit: currentLimit })
        }
        return acc
    }, [] as BudgetCategory[])

    // Calculated Totals
    const totalSavings = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
    const totalBudgetSpent = aggregatedBudgets.reduce((sum, b) => sum + (b.spent || 0), 0)

    const totalMonthlyIncome = incomes.reduce((sum, inc) => {
        const monthlyAmount = inc.frequency === 'ANNUALLY' ? inc.amount / 12 : inc.amount
        return sum + monthlyAmount
    }, 0)

    const monthlyCashFlow = totalMonthlyIncome - totalBudgetSpent
    const monthlySavingsRate = totalMonthlyIncome > 0 ? (monthlyCashFlow / totalMonthlyIncome) * 100 : 0

    const financialSummary = {
        netWorth: totalSavings + portfolioData.totalValue,
        monthlyChange: monthlyCashFlow,
        monthlyChangePercent: 0,
        totalInvestments: portfolioData.totalValue,
        investmentReturn: portfolioData.totalReturn,
        positions: portfolioData.positions,
        totalSavings: totalSavings,
        monthlyIncome: totalMonthlyIncome,
        monthlyExpenses: totalBudgetSpent,
        savingsRate: monthlySavingsRate
    }


    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const expensesThisMonth = expenses.filter(exp => {
        const d = new Date(exp.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).reduce((sum, exp) => sum + exp.amount, 0)

    // Data for the Chart (Bottom Evolution Chart)
    const monthlyExpensesChartData = (() => {
        const monthsMap: Record<string, number> = {};
        const now = new Date();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            monthsMap[key] = 0;
        }

        expenses.forEach(exp => {
            const d = new Date(exp.date);
            const key = d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            if (monthsMap[key] !== undefined) {
                monthsMap[key] += exp.amount;
            }
        });

        return Object.entries(monthsMap).map(([date, amount]) => ({
            date,
            amount
        }));
    })();

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Resumen Financiero Principal */}
            <section id="tour-summary" className="mb-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    <Activity className="h-8 w-8 text-yellow-400" />
                    {t('financialSummary')}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-primary border-0 text-primary-foreground">
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
                                {financialSummary.monthlyChange >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4" />
                                )}
                                <span className="font-semibold">
                                    {financialSummary.monthlyChange >= 0 ? '+' : ''}
                                    €{financialSummary.monthlyChange.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-primary-foreground/70">{t('thisMonth')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <LineChart className="h-4 w-4" />
                                {t('investments.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">
                                €{financialSummary.totalInvestments.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${financialSummary.investmentReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                <TrendingUp className="h-4 w-4" />
                                <span className="font-semibold">
                                    {financialSummary.investmentReturn >= 0 ? '+' : ''}
                                    {financialSummary.investmentReturn.toFixed(2)}%
                                </span>
                                <span className="text-muted-foreground">{t('totalReturn')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <PiggyBank className="h-4 w-4" />
                                {t('totalSavings')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-2">
                                €{financialSummary.totalSavings.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-blue-400">
                                <Target className="h-4 w-4" />
                                <span className="text-muted-foreground">{t('goals.inCount', { count: goals.length })}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                {t('monthlyCashFlow')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold mb-2 ${financialSummary.monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {financialSummary.monthlyChange >= 0 ? '+' : ''}
                                €{financialSummary.monthlyChange.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <div>{t('income.label')}: €{financialSummary.monthlyIncome.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                                <div>{t('expenses.label')}: €{financialSummary.monthlyExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Visual Charts Section */}
            <FinancialCharts
                portfolioData={portfolioData}
                budgets={aggregatedBudgets}
                goals={goals}
                incomes={incomes}
                expenses={expenses}
            />

            {/* Inversiones Detalle */}
            <section id="tour-portfolio" className="mb-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="h-7 w-7 text-yellow-400" />
                    {t('portfolio.title')}
                </h2>

                <Card className="bg-card border-border">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">{t('portfolio.totalValue')}</div>
                                <div className="text-2xl font-bold">€{financialSummary.totalInvestments.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">{t('portfolio.totalReturn')}</div>
                                <div className={`text-2xl font-bold ${financialSummary.investmentReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {financialSummary.investmentReturn >= 0 ? '+' : ''}
                                    {financialSummary.investmentReturn.toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">{t('portfolio.monthlyReturn')}</div>
                                <div className="text-2xl font-bold text-muted-foreground">--</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">{t('portfolio.dailyReturn')}</div>
                                <div className={`text-2xl font-bold ${portfolioData.dailyReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {portfolioData.dailyReturn >= 0 ? '+' : ''}
                                    {portfolioData.dailyReturn.toFixed(2)}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">{t('portfolio.positions')}</div>
                                <div className="text-2xl font-bold">{financialSummary.positions}</div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                onClick={() => router.push('/mainboard/portfolio')}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {t('portfolio.viewFull')}
                            </Button>
                            <Button
                                onClick={() => router.push('/mainboard/portfolio')}
                                variant="outline"
                                className="flex-1 border-border text-foreground hover:bg-muted"
                            >
                                {t('portfolio.addInvestment')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Evolución de Gastos (Bar Chart) */}
            <section id="tour-expenses" className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-7 w-7 text-red-500" />
                        {t('expenses.evolution')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase font-semibold">{t('expenses.totalThisMonth')}</div>
                            <div className="text-xl font-bold text-red-400">€{expensesThisMonth.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => router.push('/mainboard/expenses')}
                                className="bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all shadow-red-500/20"
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-1.5" strokeWidth={3} />
                                {t('expenses.add')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/mainboard/expenses')}
                                className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500/50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300 transition-all font-medium"
                            >
                                {t('expenses.manage')}
                            </Button>
                        </div>
                    </div>
                </div>

                <Card className="bg-card border-border overflow-hidden p-6">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyExpensesChartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value: number) => `€${value}`}
                                />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-background border border-border p-2 rounded shadow-md text-sm">
                                                    <p className="font-semibold">{payload[0].payload.date}</p>
                                                    <p className="text-red-400 font-bold">€{Number(payload[0].value).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </section>

            {/* Fuentes de Ingresos */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <DollarSign className="h-7 w-7 text-yellow-400" />
                        {t('income.title')}
                    </h2>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsIncomeModalOpen(true)}
                        className="border-yellow-500/40 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 dark:border-yellow-600/40 dark:text-yellow-400 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-300 transition-all font-semibold shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                        {tCommon('add')}
                    </Button>
                </div>

                <Card className="bg-card border-border">
                    <CardContent className="p-6">
                        {incomes.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                                <p>{t('income.empty')}</p>
                                <div className="mt-2 text-sm max-w-sm flex items-center justify-center gap-1 text-primary-foreground/70" title={t('income.emptyTooltip')}>
                                    <Info className="h-4 w-4" />
                                    <span>{t('income.emptyTooltip')}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {incomes.map((income) => (
                                    <div key={income.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full bg-green-500`}></div>
                                            <div>
                                                <div className="font-medium">{income.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {income.frequency === 'MONTHLY' ? tCommon('monthly') : tCommon('annually')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-bold text-green-400">
                                            +€{income.amount.toLocaleString('es-ES')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            {/* Presupuesto y Objetivos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <section id="tour-budget">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <PieChart className="h-7 w-7 text-yellow-400" />
                            {t('budget.title')}
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsBudgetModalOpen(true)}
                            className="border-yellow-500/40 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 dark:border-yellow-600/40 dark:text-yellow-400 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-300 transition-all font-semibold shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                            {tCommon('add')}
                        </Button>
                    </div>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            {budgets.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                                    <p>{t('budget.empty')}</p>
                                    <div className="mt-2 text-sm max-w-sm flex items-center justify-center gap-1 text-primary-foreground/70" title={t('budget.emptyTooltip')}>
                                        <Info className="h-4 w-4" />
                                        <span>{t('budget.emptyTooltip')}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {aggregatedBudgets.map((category) => {
                                        const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : (category.spent > 0 ? 100 : 0)
                                        const isOverBudget = category.limit > 0 ? category.spent > category.limit : category.spent > 0

                                        return (
                                            <div key={category.id || category.name}>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-medium">{category.name}</span>
                                                    <span className={`font-semibold ${isOverBudget ? 'text-red-400' : 'text-foreground'}`}>
                                                        €{category.spent} / €{category.limit}
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
                            )}

                            <Button
                                onClick={() => router.push('/mainboard/budget')}
                                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {t('budget.manage')}
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                <section id="tour-goals">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Target className="h-7 w-7 text-yellow-400" />
                            {t('goals.title')}
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsGoalModalOpen(true)}
                            className="border-yellow-500/40 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 dark:border-yellow-600/40 dark:text-yellow-400 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-300 transition-all font-semibold shadow-sm"
                        >
                            <Plus className="h-4 w-4 mr-1.5" strokeWidth={2.5} />
                            {tCommon('add')}
                        </Button>
                    </div>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            {goals.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                                    <p>{t('goals.empty')}</p>
                                    <div className="mt-2 text-sm max-w-sm flex items-center justify-center gap-1 text-primary-foreground/70" title={t('goals.emptyTooltip')}>
                                        <Info className="h-4 w-4" />
                                        <span>{t('goals.emptyTooltip')}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {goals.map((goal) => {
                                        const percentage = (goal.currentAmount / goal.targetAmount) * 100

                                        return (
                                            <div key={goal.id}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{goal.icon}</span>
                                                        <span className="font-medium">{goal.name}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2.5">
                                                    <div
                                                        className="bg-primary h-2.5 rounded-full"
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                                    <span>€{goal.currentAmount.toLocaleString()}</span>
                                                    <span>€{goal.targetAmount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            <Button
                                onClick={() => router.push('/mainboard/goals')}
                                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {t('goals.viewAll')}
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </div>

            <CreateBudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onSuccess={fetchData}
            />
            <CreateGoalModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                onSuccess={fetchData}
            />
            <CreateIncomeModal
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                onSuccess={fetchData}
            />
        </main>
    )
}
