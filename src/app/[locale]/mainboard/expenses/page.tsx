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
    Loader2
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
    const [budgets, setBudgets] = useState<BudgetCategory[]>([])
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

    const getCategoryColor = (cat: string | undefined) => {
        if (!cat) return 'bg-gray-500'
        const budget = budgets.find(b => b.name === cat)
        return budget?.color || 'bg-gray-500'
    }

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
                            className="bg-blue-600 hover:bg-blue-700 text-white"
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
                                    <CategorySelector
                                        category={category}
                                        subcategory={subcategory}
                                        onCategoryChange={(val) => {
                                            setCategory(val);
                                            setSubcategory('');
                                        }}
                                        onSubcategoryChange={setSubcategory}
                                    />

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
                                    <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700" disabled={loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                                        {t('addExpense')}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Recent Expenses List */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">{t('recentExpenses')}</h2>

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
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {expenses.map((expense) => (
                                    <Card
                                        key={expense.id}
                                        className="bg-card border-border hover:border-yellow-400 transition-colors cursor-pointer"
                                        onClick={() => handleEditClick(expense)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <div className={`${getCategoryColor(expense.category)} w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
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
                />
            </main>
        </div>
    )
}
