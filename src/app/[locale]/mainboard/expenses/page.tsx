'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    DollarSign,
    Calendar,
    Tag,
    Upload,
    Loader2,
    Plus
} from "lucide-react"
import { useTranslations } from 'next-intl'


import expenseService from "@/services/expense.service"
import budgetService from "@/services/budget.service"
import { Expense } from "@/types/expense.types"
import { BudgetCategory } from "@/types/budget.types"
import CategorySelector from "@/components/shared/CategorySelector"
import ImportExpensesModal from "@/components/expenses/ImportExpensesModal"
import EditExpenseModal from "@/components/expenses/EditExpenseModal"
import { useToast } from "@/components/ui/toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ResponsiveContainer, Cell, Pie, PieChart as RechartsPieChart, Tooltip
} from 'recharts'

export default function ExpensesPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('expenses')
    const tCommon = useTranslations('common')

    // Local state for manual entry
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])

    // Data state
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [budgets, setBudgets] = useState<BudgetCategory[]>([])

    // Filters
    const [dateFilter, setDateFilter] = useState('all') // 'all', 'thisMonth', 'last3Months', 'thisYear'
    const [categoryFilter, setCategoryFilter] = useState('all')

    const [loading, setLoading] = useState(true)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchData()
    }, [user, router])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [expensesResp, budgetsResp] = await Promise.all([
                expenseService.getExpenses(),
                budgetService.getBudgets()
            ])

            // Sort by date descending
            const sorted = expensesResp.data.data.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            setExpenses(sorted)
            setBudgets(budgetsResp.data.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        applyFilters()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expenses, dateFilter, categoryFilter])

    const applyFilters = () => {
        const now = new Date()
        let filtered = [...expenses]

        // 1. Date filter
        if (dateFilter !== 'all') {
            filtered = filtered.filter(expense => {
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
        }

        // 2. Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(expense => {
                const catName = expense.category || 'Sin categoría'
                return catName === categoryFilter
            })
        }

        setFilteredExpenses(filtered)
    }

    const { addToast } = useToast()

    if (!user) {
        return null
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            await expenseService.createExpense({
                amount: parseFloat(amount),
                category,
                subcategory: subcategory || undefined,
                concept: description, // Mapping description to concept as per backend model
                date,
            })

            addToast({
                type: 'success',
                title: "Gasto añadido",
                description: "El gasto se ha registrado correctamente.",
            })

            // Clear form
            setAmount('')
            setCategory('')
            setSubcategory('')
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])

            // Refresh data
            fetchData()
        } catch (error) {
            console.error('Error creating expense:', error)
            addToast({
                type: 'error',
                title: "Error",
                description: "No se pudo añadir el gasto. Inténtalo de nuevo.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditClick = (expense: Expense) => {
        setSelectedExpense(expense)
        setIsEditModalOpen(true)
    }

    const getCategoryColor = (cat: string | undefined, type: 'tailwind' | 'hex' = 'tailwind') => {
        if (!cat) return type === 'tailwind' ? 'bg-gray-500' : '#6b7280'
        const budget = budgets.find(b => b.name === cat)
        const twColor = budget?.color || 'bg-gray-500'

        if (type === 'tailwind') return twColor

        const tailwindColors: Record<string, string> = {
            'bg-blue-500': '#3b82f6',
            'bg-green-500': '#22c55e',
            'bg-yellow-500': '#eab308',
            'bg-purple-500': '#a855f7',
            'bg-pink-500': '#ec4899',
            'bg-red-500': '#ef4444',
            'bg-orange-500': '#f97316',
            'bg-cyan-500': '#06b6d4',
            'bg-gray-500': '#6b7280'
        };
        return tailwindColors[twColor] || '#6b7280'
    }

    // Chart Data Aggregation
    const chartData = filteredExpenses.reduce((acc, curr) => {
        const catName = curr.category || 'Sin categoría'
        const existing = acc.find(item => item.name === catName)
        if (existing) {
            existing.value += curr.amount
        } else {
            acc.push({
                name: catName,
                value: curr.amount,
                color: getCategoryColor(catName, 'hex')
            })
        }
        return acc
    }, [] as { name: string, value: number, color: string }[])

    // Unique Categories for Filter Dropdown
    const uniqueCategories = Array.from(new Set(expenses.map(e => e.category || 'Sin categoría')))

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
                                <p className="text-sm text-muted-foreground dark:text-gray-300">{t('subtitle')}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all font-medium hover:-translate-y-0.5"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Importar CSV
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Expense Form */}
                    <section>
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-6 w-6 text-yellow-400" />
                                    {t('addExpense')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('amount')}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Category Selector */}
                                    <div className="space-y-2">
                                        <CategorySelector
                                            category={category}
                                            subcategory={subcategory}
                                            onCategoryChange={(val) => {
                                                setCategory(val);
                                                setSubcategory('');
                                            }}
                                            onSubcategoryChange={setSubcategory}
                                            userCategories={Array.from(new Set(budgets.map(b => b.name)))}
                                        />
                                        {category && budgets.find(b => b.name === category) && (
                                            <div className="mt-2 text-xs flex justify-between items-center p-2 bg-muted/50 rounded border border-border">
                                                <span className="text-muted-foreground">Estado del presupuesto:</span>
                                                {(() => {
                                                    const budget = budgets.find(b => b.name === category);
                                                    if (!budget) return null;
                                                    const remaining = budget.limit - budget.spent;
                                                    const isOver = remaining < 0;
                                                    return (
                                                        <span className={`font-bold ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                                                            {isOver ? `Excedido por €${Math.abs(remaining).toFixed(2)}` : `Quedan €${remaining.toFixed(2)}`}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('description')}
                                        </label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            placeholder={t('enterDescription')}
                                            required
                                        />
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            {t('date')}
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white shadow-md shadow-yellow-600/20 transition-all font-semibold hover:-translate-y-0.5 h-11" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5 mr-1.5" strokeWidth={2.5} />}
                                        {t('addExpense')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Chart and Filter Section */}
                    <section className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold mb-2">{t('recentExpenses')}</h2>

                        {/* Filters */}
                        <div className="grid grid-cols-2 gap-4">
                            <Select value={dateFilter} onValueChange={setDateFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Fecha" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todo el tiempo</SelectItem>
                                    <SelectItem value="thisMonth">Este Mes</SelectItem>
                                    <SelectItem value="last3Months">Últimos 3 Meses</SelectItem>
                                    <SelectItem value="thisYear">Este Año</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {uniqueCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Chart */}
                        <Card className="bg-card border-border">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Distribución de Gastos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[250px] flex items-center justify-center p-0">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                                formatter={(value: number, name: string) => [`€${value.toFixed(2)}`, name]}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        No hay datos para la gráfica
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {loading ? (
                            <div className="flex justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                            </div>
                        ) : expenses.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground border border-dashed rounded-lg">
                                <p>No hay gastos registrados</p>
                                <p className="text-sm mt-2">Añade uno o importa un CSV</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {filteredExpenses.map((expense) => (
                                    <Card
                                        key={expense.id}
                                        className="bg-card border-border hover:border-yellow-400 transition-colors cursor-pointer"
                                        onClick={() => handleEditClick(expense)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <div className={`${getCategoryColor(expense.category, 'tailwind')} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
                                                        <Tag className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{expense.concept}</h3>
                                                        <div className="flex flex-col">
                                                            <p className="text-sm text-muted-foreground">{expense.category || 'Sin categoría'}</p>
                                                            {expense.subcategory && (
                                                                <p className="text-xs text-muted-foreground border-l-2 pl-2 border-muted mt-1">
                                                                    ↳ {expense.subcategory}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{new Date(expense.date).toLocaleDateString('es-ES')}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-red-400">
                                                        -€{expense.amount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-blue-500 mt-1 hover:underline">
                                                        Editar
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <ImportExpensesModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onSuccess={fetchData}
                />

                <EditExpenseModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={fetchData}
                    expense={selectedExpense}
                    userCategories={Array.from(new Set(budgets.map(b => b.name)))}
                />
            </main>
        </div>
    )
}
