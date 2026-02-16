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
    Loader2
} from "lucide-react"
import { useTranslations } from 'next-intl'
import goalService from "@/services/goal.service"
import { SavingsGoal } from "@/types/goal.types"
import CreateGoalModal from "@/components/goals/CreateGoalModal"

export default function GoalsPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('goals')
    const tCommon = useTranslations('common')

    const [goals, setGoals] = useState<SavingsGoal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
        if (!deadline) return 0
        const now = new Date()
        const end = new Date(deadline)
        const months = Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30))
        return Math.max(0, months)
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
                            <h1 className="text-2xl font-bold">{t('title')}</h1>
                            <p className="text-sm text-muted-foreground dark:text-gray-300">{t('subtitle')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Goal Button */}
                <div className="mb-6">
                    <Button
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('addGoal')}
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
                        {error}
                    </div>
                )}

                {/* Goals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal) => {
                        const percentage = (goal.currentAmount / goal.targetAmount) * 100
                        const timeRemaining = getTimeRemaining(goal.deadline)

                        return (
                            <Card key={goal.id} className="bg-card border-border hover:border-yellow-400 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{goal.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold">{goal.name}</h3>
                                                {goal.deadline && (
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{timeRemaining} {timeRemaining === 1 ? 'mes' : 'meses'} restantes</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">{t('progress')}</span>
                                            <span className="font-semibold">{percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full transition-all"
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                                            <span>€{goal.currentAmount.toLocaleString('es-ES')}</span>
                                            <span>€{goal.targetAmount.toLocaleString('es-ES')}</span>
                                        </div>
                                    </div>

                                    {/* Goal Details */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                        <div>
                                            {/* We don't have monthly contribution in backend model yet, so hiding or mocking */}
                                            <p className="text-xs text-muted-foreground">{t('timeRemaining')}</p>
                                            <p className="font-semibold text-lg">
                                                {goal.deadline ? `${timeRemaining} meses` : 'Sin fecha'}
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
                            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t('noGoals')}</h3>
                            <p className="text-muted-foreground mb-6">{t('createFirst')}</p>
                            <Button
                                className="bg-yellow-600 hover:bg-yellow-700"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('addGoal')}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <CreateGoalModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={fetchGoals}
                />
            </main>
        </div>
    )
}
