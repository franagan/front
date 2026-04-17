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
    Trash2,
    Edit,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Upload
} from "lucide-react"
import { useTranslations } from 'next-intl'
import budgetService from "@/services/budget.service"
import { BudgetCategory, BudgetPeriod } from "@/types/budget.types"
import CreateBudgetModal from "@/components/budget/CreateBudgetModal"
import {
    ResponsiveContainer, Cell, Pie, PieChart, Tooltip, Legend
} from 'recharts'
import expenseService from "@/services/expense.service"
import { Expense } from "@/types/expense.types"
import AddExpenseModal from "@/components/expenses/AddExpenseModal"
import ImportExpensesModal from "@/components/expenses/ImportExpensesModal"
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
    const [activePeriod, setActivePeriod] = useState<BudgetPeriod>('MONTHLY')
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
    const [dateFilter, setDateFilter] = useState('thisMonth') // Default to this month
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(null)
    const [viewDate, setViewDate] = useState(new Date())
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [budgetsRes, expensesRes] = await Promise.all([
                budgetService.getBudgets(
                    activePeriod,
                    viewDate.getFullYear(),
                    activePeriod === 'MONTHLY' ? viewDate.getMonth() + 1 : undefined
                ),
                expenseService.getExpenses()
            ])
            setBudgets(budgetsRes.data.data || [])

            const fetchedExpenses = expensesRes.data.data || []
            // Sort by date desc
            fetchedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            setExpenses(fetchedExpenses)

            // Set default date filter based on active period if needed
            if (activePeriod === 'MONTHLY' && dateFilter === 'thisYear') {
                setDateFilter('thisMonth')
            } else if (activePeriod === 'ANNUAL' && dateFilter === 'thisMonth') {
                setDateFilter('thisYear')
            }
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
    }, [user, router, activePeriod, viewDate])

    useEffect(() => {
        applyFilter()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFilter, expenses, selectedCategory, activePeriod])

    const applyFilter = () => {
        const filtered = expenses.filter(expense => {
            const expDate = new Date(expense.date)

            // Date Check
            if (activePeriod === 'MONTHLY' || dateFilter === 'thisMonth') {
                if (expDate.getMonth() !== viewDate.getMonth() || expDate.getFullYear() !== viewDate.getFullYear()) {
                    return false
                }
            } else if (activePeriod === 'ANNUAL' || dateFilter === 'thisYear') {
                if (expDate.getFullYear() !== viewDate.getFullYear()) {
                    return false
                }
            }

            // Category Check
            if (selectedCategory) {
                if (expense.category?.toLowerCase().trim() !== selectedCategory.toLowerCase().trim()) {
                    return false
                }
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
                await fetchData()
            } catch (error) {
                console.error("Error deleting expense:", error)
            }
        }
    }

    const handleEditBudget = (budget: BudgetCategory) => {
        setSelectedBudget(budget)
        setIsModalOpen(true)
    }

    const handleDeleteBudget = async (id: string) => {
        if (!id) return;
        if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
            try {
                await budgetService.deleteBudget(id)
                fetchData()
            } catch (error) {
                console.error("Error deleting budget:", error)
            }
        }
    }

    const handleModalSuccess = () => {
        fetchData()
        setIsModalOpen(false)
        setSelectedBudget(null)
    }

    // Aggregation Logic
    const aggregatedBudgets = budgets.reduce((acc, current) => {
        const currentName = (current.name || '').toLowerCase().trim()
        const existing = acc.find(item => (item.name || '').toLowerCase().trim() === currentName)
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

    // Calculations based on aggregated data
    const totalBudget = aggregatedBudgets.reduce((sum, cat) => sum + cat.limit, 0)
    const totalSpent = aggregatedBudgets.reduce((sum, cat) => sum + cat.spent, 0)
    const remaining = totalBudget - totalSpent
    const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="bg-background/50 dark:bg-neutral-950/80 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
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
                            <h1 className="text-2xl font-bold">
                                {activePeriod === 'MONTHLY' ? t('title') : 'Presupuesto Anual'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {activePeriod === 'MONTHLY' ? t('subtitle') : 'Controla tus gastos anuales'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation & Period Selector */}
            <div className="bg-card/30 border-b border-border py-3 sticky top-[73px] z-40 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex bg-muted p-1 rounded-lg">
                        <Button
                            variant={activePeriod === 'MONTHLY' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActivePeriod('MONTHLY')}
                            className={activePeriod === 'MONTHLY' ? 'bg-background shadow-sm' : 'text-muted-foreground'}
                        >
                            Mensual
                        </Button>
                        <Button
                            variant={activePeriod === 'ANNUAL' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActivePeriod('ANNUAL')}
                            className={activePeriod === 'ANNUAL' ? 'bg-background shadow-sm' : 'text-muted-foreground'}
                        >
                            Anual
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                            const d = new Date(viewDate);
                            if (activePeriod === 'MONTHLY') d.setMonth(d.getMonth() - 1);
                            else d.setFullYear(d.getFullYear() - 1);
                            setViewDate(d);
                        }} className="h-9 w-9">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2 px-6 py-2 bg-background rounded-full border border-border/50 shadow-sm min-w-[180px] justify-center text-sm font-bold">
                            <Calendar className="h-4 w-4 text-yellow-500" />
                            {activePeriod === 'MONTHLY'
                                ? viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()
                                : viewDate.getFullYear()
                            }
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => {
                            const d = new Date(viewDate);
                            if (activePeriod === 'MONTHLY') d.setMonth(d.getMonth() + 1);
                            else d.setFullYear(d.getFullYear() + 1);
                            setViewDate(d);
                        }} className="h-9 w-9">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button variant="link" size="sm" onClick={() => setViewDate(new Date())} className="text-xs text-muted-foreground hover:text-yellow-500">
                        Actual
                    </Button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-wider">
                                {activePeriod === 'MONTHLY' ? t('totalBudget') : 'Presupuesto Anual'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">€{totalBudget.toLocaleString('es-ES')}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                {activePeriod === 'MONTHLY' ? t('totalSpent') : 'Total Gastado'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-red-500">€{totalSpent.toLocaleString('es-ES')}</div>
                            <p className="text-xs text-muted-foreground font-medium mt-1">{spentPercentage.toFixed(1)}% consumido</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('remaining')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-3xl font-black ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                €{remaining.toLocaleString('es-ES')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <PieChartIcon className="h-7 w-7 text-yellow-500" />
                        {t('categories')}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(true)} className="border-blue-500/50 text-blue-500 h-9 font-bold">
                            <Upload className="h-4 w-4 mr-2" /> Importar CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsExpenseModalOpen(true)} className="border-green-500 border-2 text-green-600 h-9 font-bold shadow-sm">
                            <Plus className="h-4 w-4 mr-2" /> Añadir Gasto
                        </Button>
                        <Button size="sm" onClick={handleCreate} className="bg-yellow-600 hover:bg-yellow-700 h-9 font-bold shadow-md shadow-yellow-600/20">
                            <Plus className="h-4 w-4 mr-2" /> Presupuesto
                        </Button>
                    </div>
                </div>

                {/* Chart */}
                <Card className="mb-8 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Distribución del Gasto</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {totalSpent > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={aggregatedBudgets.filter(b => b.spent > 0) as any[]}
                                        dataKey="spent"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={4}
                                        onClick={(data) => {
                                            if (selectedCategory === data.name) setSelectedCategory(null);
                                            else setSelectedCategory(data.name);
                                        }}
                                        className="cursor-pointer"
                                        label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                                    >
                                        {aggregatedBudgets.filter(b => b.spent > 0).map((entry, index) => {
                                            const tailwindColors: Record<string, string> = {
                                                'bg-blue-500': '#3b82f6', 'bg-green-500': '#22c55e', 'bg-yellow-500': '#eab308',
                                                'bg-purple-500': '#a855f7', 'bg-pink-500': '#ec4899', 'bg-red-500': '#ef4444',
                                                'bg-orange-500': '#f97316', 'bg-cyan-500': '#06b6d4', 'bg-indigo-500': '#6366f1',
                                                'bg-teal-500': '#14b8a6', 'bg-gray-400': '#9ca3af', 'bg-gray-500': '#6b7280'
                                            };
                                            return <Cell key={`cell-${index}`} fill={tailwindColors[entry.color] || entry.color || '#8884d8'} />;
                                        })}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic">No hay gastos para este periodo</div>
                        )}
                    </CardContent>
                </Card>

                {/* List */}
                <Card className="mb-8 border-border">
                    <CardContent className="p-6">
                        {isLoading ? <div className="text-center py-10">Cargando datos...</div> : aggregatedBudgets.length === 0 ? <div className="text-center py-10 text-muted-foreground">Empieza creando un presupuesto</div> : (
                            <div className="space-y-6">
                                {aggregatedBudgets.map((category) => {
                                    const hasLimit = category.limit > 0;
                                    const percentage = hasLimit ? (category.spent / category.limit) * 100 : (category.spent > 0 ? 100 : 0);
                                    const isOver = hasLimit ? category.spent > category.limit : category.spent > 0;
                                    const isSelected = selectedCategory === category.name;

                                    return (
                                        <div
                                            key={category.name}
                                            onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                                            className={`border-b border-border pb-6 last:border-0 last:pb-0 group cursor-pointer transition-all p-3 rounded-xl hover:bg-muted/30 ${isSelected ? 'bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/20' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                                        {category.name}
                                                        {!hasLimit && <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-black uppercase tracking-tighter">Sin Presupuesto</span>}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground font-medium">€{category.spent.toFixed(2)} {hasLimit ? `de €${category.limit.toFixed(2)}` : ''}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className={`text-xl font-black ${isOver ? 'text-red-500' : 'text-green-500'}`}>
                                                            {hasLimit ? `${percentage.toFixed(1)}%` : `€${category.spent.toFixed(2)}`}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{isOver ? 'Excedido' : 'Optimizado'}</div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {category.id && (
                                                            <>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={(e) => { e.stopPropagation(); handleEditBudget(category); }}><Edit className="h-4 w-4" /></Button>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteBudget(category.id!); }}><Trash2 className="h-4 w-4" /></Button>
                                                            </>
                                                        )}
                                                        {!category.id && (
                                                            <Button variant="ghost" size="icon" onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedBudget({ ...category, limit: category.spent * 1.2 } as any);
                                                                setIsModalOpen(true);
                                                            }} className="text-blue-500 h-8 w-8"><Plus className="h-4 w-4" /></Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner border border-border/50">
                                                <div
                                                    className={`h-full transition-all duration-700 ${category.color || 'bg-gray-400'} ${isOver ? 'opacity-90 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                >
                                                    {isOver && <div className="w-full h-full bg-red-500/20 animate-pulse"></div>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* History */}
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold">{selectedCategory ? `Transacciones: ${selectedCategory}` : 'Historial de Gastos'}</h2>
                            {selectedCategory && <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)} className="h-7 text-xs border-dashed text-red-500 hover:bg-red-50">Ver todos</Button>}
                        </div>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="w-[180px] bg-card border-border h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todo</SelectItem>
                                <SelectItem value="thisMonth">Este Mes</SelectItem>
                                <SelectItem value="thisYear">Este Año</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Card className="border-border shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Fecha</th>
                                        <th className="px-4 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Categoría</th>
                                        <th className="px-4 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Concepto</th>
                                        <th className="px-4 py-3 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Monto</th>
                                        <th className="px-4 py-3 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredExpenses.length === 0 ? <tr><td colSpan={5} className="py-10 text-center italic text-muted-foreground">No hay transacciones registradas</td></tr> : filteredExpenses.map((exp) => {
                                        const cat = budgets.find(b => b.name === exp.category);
                                        return (
                                            <tr key={exp.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground">{new Date(exp.date).toLocaleDateString('es-ES')}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 font-bold text-foreground">
                                                        <div className={`w-2.5 h-2.5 rounded-full ${cat?.color || 'bg-gray-400'}`}></div>
                                                        {exp.category} {exp.subcategory && <span className="font-normal opacity-60 text-[10px] ml-1">({exp.subcategory})</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{exp.concept || '-'}</td>
                                                <td className="px-4 py-3 text-right font-black text-red-500">-€{exp.amount.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(exp.id)} className="h-8 w-8 text-red-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </section>
            </main>

            <CreateBudgetModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedBudget(null); }}
                onSuccess={handleModalSuccess}
                initialData={selectedBudget}
                existingBudgets={budgets}
                defaultPeriod={activePeriod}
            />

            <AddExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                onSuccess={fetchData}
                userCategories={Array.from(new Set(budgets.map(b => b.name)))}
            />

            <ImportExpensesModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    )
}
