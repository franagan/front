'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    PieChart as PieChartIcon,
    Plus,
    Trash2
} from "lucide-react"
import { useTranslations } from 'next-intl'
import budgetService from "@/services/budget.service"
import { BudgetCategory } from "@/types/budget.types"
import CreateBudgetModal from "@/components/budget/CreateBudgetModal"
import {
    ResponsiveContainer, Cell, Pie, PieChart, Tooltip, Legend
} from 'recharts'
import expenseService from "@/services/expense.service"
import { Expense } from "@/types/expense.types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function BudgetPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('budget')
    const tCommon = useTranslations('common')

    // State
    const [budgets, setBudgets] = useState<BudgetCategory[]>([])
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [dateFilter, setDateFilter] = useState('all') // 'all', 'thisMonth', 'last3Months', 'thisYear'
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [budgetsRes, expensesRes] = await Promise.all([
                budgetService.getBudgets(),
                expenseService.getExpenses()
            ])
            setBudgets(budgetsRes.data.data || [])

            const fetchedExpenses = expensesRes.data.data || []
            // Sort by date desc
            fetchedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setExpenses(fetchedExpenses)
            setFilteredExpenses(fetchedExpenses)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchData()
    }, [user, router])

    useEffect(() => {
        applyFilter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFilter, expenses])

    const applyFilter = () => {
        if (dateFilter === 'all') {
            setFilteredExpenses(expenses)
            return
        }

        const now = new Date()
        const filtered = expenses.filter(expense => {
            const expDate = new Date(expense.date)

            if (dateFilter === 'thisMonth') {
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
            }
            if (dateFilter === 'last3Months') {
                const threeMonthsAgo = new Date()
                threeMonthsAgo.setMonth(now.getMonth() - 3)
                return expDate >= threeMonthsAgo
            }
            if (dateFilter === 'thisYear') {
                return expDate.getFullYear() === now.getFullYear()
            }
            return true
        })

        setFilteredExpenses(filtered)
    }

    if (!user) {
        return null
    }

    // Handlers
    const handleCreate = () => {
        setSelectedBudget(null)
        setIsModalOpen(true)
    }

    const handleDeleteExpense = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
            try {
                await expenseService.deleteExpense(id)
                fetchData()
            } catch (error) {
                console.error("Error deleting expense:", error)
            }
        }
    }

    const handleModalSuccess = () => {
        fetchData()
        setIsModalOpen(false)
    }

    // Aggregation Logic
    const aggregatedBudgets = budgets.reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name)
        const currentSpent = Number(current.spent) || 0
        const currentLimit = Number(current.limit) || 0

        if (existing) {
            existing.spent += currentSpent
            // Limit should theoretically be the same for the same category name
            // If they differ, taking the max is a safe bet or just keeping the first one
            existing.limit = Math.max(existing.limit, currentLimit)
        } else {
            // Clone to avoid mutating original state if we were modifyng it directly (though reduce accumulator is new)
            acc.push({ ...current, spent: currentSpent, limit: currentLimit })
        }
        return acc
    }, [] as BudgetCategory[])

    // Calculations based on aggregated data
    const totalBudget = aggregatedBudgets.reduce((sum, cat) => sum + cat.limit, 0)
    const totalSpent = aggregatedBudgets.reduce((sum, cat) => sum + cat.spent, 0)
    const remaining = totalBudget - totalSpent
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0


    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
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
                            <h1 className="text-2xl dark:text-gray-300 font-bold">{t('title')}</h1>
                            <p className="text-sm text-muted-foreground dark:text-gray-300">{t('subtitle')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{t('totalBudget')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                €{totalBudget.toLocaleString('es-ES')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalSpent')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-400">
                                €{totalSpent.toLocaleString('es-ES')}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {spentPercentage.toFixed(1)}% {t('percentage')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{t('remaining')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                €{remaining.toLocaleString('es-ES')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Add Category Button */}
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PieChartIcon className="h-7 w-7 text-yellow-400" />
                        {t('categories')}
                    </h2>
                    <Button onClick={handleCreate} className="bg-yellow-600 hover:bg-yellow-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Añadir Presupuesto
                    </Button>
                </div>

                {/* Chart Section */}
                <section className="mb-8">
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5 text-yellow-400" />
                                Distribución de Gastos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            {budgets.length > 0 && totalSpent > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>

                                        <Pie
                                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                            data={aggregatedBudgets.filter(b => b.spent > 0) as any[]}
                                            dataKey="spent"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            label={({ name, percent }: { name?: string | number, percent?: number }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        >
                                            {aggregatedBudgets.filter(b => b.spent > 0).map((entry, index) => {
                                                const tailwindColors: Record<string, string> = {
                                                    'bg-blue-500': '#3b82f6',
                                                    'bg-green-500': '#22c55e',
                                                    'bg-yellow-500': '#eab308',
                                                    'bg-purple-500': '#a855f7',
                                                    'bg-pink-500': '#ec4899',
                                                    'bg-red-500': '#ef4444',
                                                    'bg-orange-500': '#f97316',
                                                    'bg-cyan-500': '#06b6d4'
                                                };
                                                // If it's a tailwind class, map it. Otherwise assume it's a safe color string (hex/rgb) or fallback.
                                                // Recharts doesn't calculate CSS variables automatically in 'fill'
                                                const colorFill = tailwindColors[entry.color] || entry.color || '#8884d8';

                                                return <Cell key={`cell-${index}`} fill={colorFill} stroke="hsl(var(--background))" strokeWidth={2} />;
                                            })}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                            formatter={(value: number, name: string) => [`€${value}`, name]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    No hay gastos registrados para mostrar
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Budget List */}
                <section className="mb-8">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6">
                            {isLoading ? (
                                <div className="text-center py-6">Cargando...</div>
                            ) : budgets.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    No hay presupuestos definidos. ¡Crea el primero!
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {aggregatedBudgets.map((category) => {
                                        const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : (category.spent > 0 ? 100 : 0)
                                        const isOverBudget = category.limit > 0 ? category.spent > category.limit : category.spent > 0

                                        return (
                                            <div key={category.name} className="border-b border-border pb-6 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{category.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            €{category.spent} / €{category.limit}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <div className={`text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                                                                {percentage.toFixed(1)}%
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {isOverBudget ? t('overBudget') : t('underBudget')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Expense History List */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Historial de Gastos</h2>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todo el historial</SelectItem>
                                <SelectItem value="thisMonth">Este Mes</SelectItem>
                                <SelectItem value="last3Months">Últimos 3 Meses</SelectItem>
                                <SelectItem value="thisYear">Este Año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Card className="bg-card border-border">
                        <CardContent className="p-0">
                            {filteredExpenses.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">No hay gastos registrados en este periodo</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/50 border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                                                <th className="px-4 py-3 text-left font-medium">Categoría</th>
                                                <th className="px-4 py-3 text-left font-medium">Concepto</th>
                                                <th className="px-4 py-3 text-right font-medium">Monto</th>
                                                <th className="px-4 py-3 text-right font-medium">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredExpenses.map((expense) => {
                                                const catBudget = budgets.find(b => b.name === expense.category);
                                                const dotColor = catBudget ? catBudget.color : 'bg-gray-400';

                                                return (
                                                    <tr key={expense.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                                                        <td className="px-4 py-3 text-muted-foreground">
                                                            {new Date(expense.date).toLocaleDateString('es-ES')}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
                                                                {expense.category || 'Sin Categoría'}
                                                                {expense.subcategory && <span className="text-xs text-muted-foreground ml-1">({expense.subcategory})</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-muted-foreground">{expense.concept || '-'}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-red-500">-€{expense.amount.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {/*
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-muted"
                                                                onClick={() => router.push('/mainboard/expenses')} // Or navigate to Edit Expense somewhere
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            */}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </main>

            {/* Modal */}
            <CreateBudgetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                initialData={selectedBudget}
                existingBudgets={budgets}
            />
        </div>
    )
}
