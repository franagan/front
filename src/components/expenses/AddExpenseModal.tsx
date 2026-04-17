'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DollarSign, Loader2, Calendar, Tag, FileText } from 'lucide-react'
import CategorySelector from '@/components/shared/CategorySelector'
import expenseService from '@/services/expense.service'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import goalService from '@/services/goal.service'
import { SavingsGoal } from '@/types/goal.types'
import { useEffect } from 'react'
import { RefreshCcw, Target } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface AddExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    userCategories?: string[]
}

export default function AddExpenseModal({ isOpen, onClose, onSuccess, userCategories = [] }: AddExpenseModalProps) {
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isRecurring, setIsRecurring] = useState(false)
    const [recurringPeriod, setRecurringPeriod] = useState('MONTHLY')
    const [linkedGoalId, setLinkedGoalId] = useState<string | undefined>(undefined)
    const [goals, setGoals] = useState<SavingsGoal[]>([])
    const [loading, setLoading] = useState(false)
    const { addToast } = useToast()

    useEffect(() => {
        if (isOpen) {
            fetchGoals()
        }
    }, [isOpen])

    const fetchGoals = async () => {
        try {
            const res = await goalService.getGoals()
            setGoals(res.data.data || [])
        } catch (error) {
            console.error("Error fetching goals:", error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !category) return

        try {
            setLoading(true)
            await expenseService.createExpense({
                amount: parseFloat(amount),
                category,
                subcategory: subcategory || undefined,
                concept: description,
                date,
                isRecurring,
                recurringPeriod: isRecurring ? recurringPeriod : undefined,
                linkedGoalId: linkedGoalId || undefined
            })

            addToast({
                type: 'success',
                title: "Gasto añadido",
                description: "El gasto se ha registrado correctamente.",
            })

            // Reset
            setAmount('')
            setCategory('')
            setSubcategory('')
            setDescription('')
            setDate(new Date().toISOString().split('T')[0])

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error creating expense:', error)
            addToast({
                type: 'error',
                title: "Error",
                description: "No se pudo añadir el gasto.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <DollarSign className="h-6 w-6 text-yellow-500" />
                        Añadir Gasto
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    {/* Amount */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Monto (€)</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                            <Input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8 bg-background border-border"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Categoría</Label>
                        <CategorySelector
                            category={category}
                            subcategory={subcategory}
                            onCategoryChange={(val) => {
                                setCategory(val);
                                setSubcategory('');
                            }}
                            onSubcategoryChange={setSubcategory}
                            userCategories={userCategories}
                            allowCustom={true}
                        />
                    </div>

                    {/* Description/Concept */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            Concepto (Opcional)
                        </Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ej: Compra semanal, Cena..."
                            className="bg-background border-border"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Fecha
                        </Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-background border-border"
                            required
                        />
                    </div>

                    {/* Recurring & Goal Options */}
                    <div className="pt-2 space-y-4 border-t border-border/50">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="recurring"
                                checked={isRecurring}
                                onCheckedChange={(checked: boolean) => setIsRecurring(!!checked)}
                            />
                            <Label htmlFor="recurring" className="text-sm cursor-pointer flex items-center gap-2">
                                <RefreshCcw className="h-3 w-3" />
                                Es un gasto recurrente
                            </Label>
                        </div>

                        {isRecurring && (
                            <div className="pl-6">
                                <Select value={recurringPeriod} onValueChange={setRecurringPeriod}>
                                    <SelectTrigger className="h-8 text-xs bg-background">
                                        <SelectValue placeholder="Periodo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="WEEKLY">Semanal</SelectItem>
                                        <SelectItem value="MONTHLY">Mensual</SelectItem>
                                        <SelectItem value="YEARLY">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-500" />
                                Vincular a Objetivo (Ahorro)
                            </Label>
                            <Select value={linkedGoalId || "none"} onValueChange={(val) => setLinkedGoalId(val === "none" ? undefined : val)}>
                                <SelectTrigger className="bg-background border-border">
                                    <SelectValue placeholder="Ningún objetivo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin objetivo</SelectItem>
                                    {goals.map(goal => (
                                        <SelectItem key={goal.id} value={goal.id!}>
                                            <span className="mr-2">{goal.icon}</span>
                                            {goal.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[10px] text-muted-foreground italic pl-1">
                                El monto se sumará automáticamente al progreso del objetivo.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !amount || !category}
                            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar Gasto"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
