'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Target,
    Plus,
    Edit,
    Calendar,
    Loader2,
    History,
    Trash2
} from "lucide-react"
import { useTranslations } from 'next-intl'
import goalService from "@/services/goal.service"
import { SavingsGoal } from "@/types/goal.types"
import CreateGoalModal from "@/components/goals/CreateGoalModal"
import GoalMovementsModal from "@/components/goals/GoalMovementsModal"
import { useToast } from "@/components/ui/toast"

export default function GoalsPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('goals')
    const tCommon = useTranslations('common')
    const { addToast } = useToast()

    const [goals, setGoals] = useState<SavingsGoal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchGoals()
    }, [user, router])

    const fetchGoals = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await goalService.getGoals()
            setGoals(response.data.data)
        } catch (err) {
            console.error('Error fetching goals:', err)
            setError('Error al cargar los objetivos de ahorro')
        } finally {
            setLoading(false)
        }
    }

    const getTimeRemaining = (deadline?: string) => {
        if (!deadline) return null
        const now = new Date()
        const end = new Date(deadline)
        const diffTime = end.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays < 0) return "Excedido"
        if (diffDays < 30) return `${diffDays} días`
        
        const months = Math.round(diffDays / 30)
        return `${months} ${months === 1 ? 'mes' : 'meses'}`
    }

    const getGoalDuration = (start?: string, end?: string) => {
        if (!start || !end) return null
        const s = new Date(start)
        const e = new Date(end)
        const diffTime = e.getTime() - s.getTime()
        const months = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30))
        return Math.max(1, months)
    }

    const handleEdit = (goal: SavingsGoal) => {
        setSelectedGoal(goal)
        setIsCreateModalOpen(true)
    }

    const handleViewMovements = (goal: SavingsGoal) => {
        setSelectedGoal(goal)
        setIsMovementsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este objetivo?')) return
        try {
            await goalService.deleteGoal(id)
            addToast({ type: 'success', title: 'Objetivo eliminado', description: 'El objetivo se ha borrado correctamente.' })
            fetchGoals()
        } catch (err) {
            console.error(err)
            addToast({ type: 'error', title: 'Error', description: 'No se pudo eliminar el objetivo.' })
        }
    }

    if (!user) {
        return null
    }

    if (loading && goals.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
                    <p className="text-muted-foreground">{tCommon('loading')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Premium Header */}
            <header className="bg-card/50 border-b border-border sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/mainboard')} className="rounded-xl">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black italic tracking-tight">OBJETIVOS DE <span className="text-orange-500">AHORRO</span></h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Savings & Target Intelligence</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchGoals}
                            className="rounded-xl border-border font-bold h-11"
                        >
                            Refrescar
                        </Button>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black h-11"
                        >
                            <Plus className="h-4 w-4 mr-2" /> AÑADIR OBJETIVO
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => {
                        const percentage = (goal.currentAmount / goal.targetAmount) * 100
                        const duration = getGoalDuration(goal.startDate, goal.deadline)

                        return (
                            <Card key={goal.id} className="bg-card border-border hover:border-yellow-400 transition-all shadow-sm hover:shadow-md group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{goal.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold">{goal.name}</h3>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                                        <Calendar className="h-3 w-3 text-yellow-500" />
                                                        <span>
                                                            {goal.startDate ? new Date(goal.startDate).toLocaleDateString() : '---'} 
                                                            <span className="mx-1 opacity-50">→</span> 
                                                            {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : '---'}
                                                        </span>
                                                    </div>
                                                    {goal.deadline && (
                                                        <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full w-fit font-black">
                                                            {getTimeRemaining(goal.deadline)} restantes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-50/10"
                                                onClick={() => handleViewMovements(goal)}
                                                title="Ver movimientos"
                                            >
                                                <History className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-50/10"
                                                onClick={() => handleEdit(goal)}
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50/10"
                                                onClick={() => handleDelete(goal.id!)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-[11px] mb-2 font-black uppercase tracking-widest text-muted-foreground">
                                            <span>Progreso de Ahorro</span>
                                            <span className="text-foreground">{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden border border-border/50 shadow-inner">
                                            <div
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs mt-3">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Actual</span>
                                                <span className="font-black text-lg">€{goal.currentAmount.toLocaleString('es-ES')}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[10px] text-muted-foreground font-bold uppercase">Objetivo</span>
                                                <span className="font-black text-lg">€{goal.targetAmount.toLocaleString('es-ES')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Goal Analysis */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-2">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Plataforma Temporal</p>
                                            <p className="font-bold text-base">
                                                {duration ? `${duration} meses` : 'Estrategia abierta'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Ahorro Mensual Nec.</p>
                                            <p className="font-black text-base text-yellow-600">
                                                {goal.deadline && goal.targetAmount > goal.currentAmount 
                                                    ? `€${((goal.targetAmount - goal.currentAmount) / Math.max(1, duration || 1)).toFixed(0)}`
                                                    : '---'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Empty State */}
                {!loading && goals.length === 0 && (
                    <Card className="bg-card border-border">
                        <CardContent className="p-12 text-center">
                            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-semibold mb-2">No tienes objetivos activos</h3>
                            <p className="text-muted-foreground mb-6">Define un rango de fechas y un monto para empezar a ahorrar hoy mismo.</p>
                            <Button
                                className="bg-yellow-600 hover:bg-yellow-700 font-bold"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Crear mi Primer Objetivo
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <CreateGoalModal
                    isOpen={isCreateModalOpen}
                    onClose={() => {
                        setIsCreateModalOpen(false)
                        setSelectedGoal(null)
                    }}
                    onSuccess={fetchGoals}
                    initialData={selectedGoal}
                />

                <GoalMovementsModal
                    isOpen={isMovementsModalOpen}
                    onClose={() => {
                        setIsMovementsModalOpen(false)
                        setSelectedGoal(null)
                    }}
                    goal={selectedGoal}
                />
            </main>
        </div>
    )
}
