'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Bell,
    Plus,
    TrendingUp,
    TrendingDown,
    Target,
    Loader2,
    ArrowLeft,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    Trash2,
    Eye
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import alertService from '@/services/alert.service'
import {
    Alert,
    AlertSummary,
    AlertType,
    getAlertTypeLabel,
    getAlertTypeColor,
    getAlertStatusColor
} from '@/types/alert.types'
import CreateAlertModal from '@/components/alerts/CreateAlertModal'

export default function AlertsPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('common')

    const [alerts, setAlerts] = useState<Alert[]>([])
    const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([])
    const [summary, setSummary] = useState<AlertSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'active' | 'triggered' | 'all'>('active')
    const [refreshing, setRefreshing] = useState(false)

    // Cargar datos
    const loadData = useCallback(async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)

            const [alertsRes, triggeredRes, summaryRes] = await Promise.all([
                alertService.getAlerts(),
                alertService.getTriggeredAlerts(),
                alertService.getAlertSummary()
            ])

            if (alertsRes.success && alertsRes.data) {
                setAlerts(alertsRes.data)
            }

            if (triggeredRes.success && triggeredRes.data) {
                setTriggeredAlerts(triggeredRes.data)
            }

            if (summaryRes.success && summaryRes.data) {
                setSummary(summaryRes.data)
            }

        } catch (err) {
            console.error('Error loading alerts:', err)
            const errorPayload = err as { response?: { data?: { message?: string } } }
            setError(errorPayload.response?.data?.message || 'Error al cargar las alertas')
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        loadData()
    }, [user, router, loadData])

    // Refrescar datos
    const handleRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    // Descartar alerta
    const handleDismiss = async (alertId: string) => {
        try {
            const response = await alertService.dismissAlert(alertId)
            if (response.success) {
                await loadData()
            }
        } catch (err) {
            console.error('Error dismissing alert:', err)
        }
    }

    // Eliminar alerta
    const handleDelete = async (alertId: string) => {
        if (!window.confirm('Estas seguro de que deseas eliminar esta alerta?')) return

        try {
            const response = await alertService.deleteAlert(alertId)
            if (response.success) {
                await loadData()
            }
        } catch (err) {
            console.error('Error deleting alert:', err)
        }
    }

    // Reactivar alerta
    const handleReactivate = async (alertId: string) => {
        try {
            const response = await alertService.reactivateAlert(alertId)
            if (response.success) {
                await loadData()
            }
        } catch (err) {
            console.error('Error reactivating alert:', err)
        }
    }

    // Obtener icono segun tipo de alerta
    const getAlertIcon = (type: AlertType) => {
        switch (type) {
            case 'STOP_LOSS':
                return <TrendingDown className="h-5 w-5" />
            case 'TAKE_PROFIT':
                return <TrendingUp className="h-5 w-5" />
            case 'PRICE_TARGET':
                return <Target className="h-5 w-5" />
            default:
                return <Bell className="h-5 w-5" />
        }
    }

    // Filtrar alertas segun tab
    const getFilteredAlerts = () => {
        switch (activeTab) {
            case 'active':
                return alerts.filter(a => a.isActive && a.status === 'ACTIVE')
            case 'triggered':
                return triggeredAlerts
            case 'all':
            default:
                return alerts
        }
    }

    if (!user) return null

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-400" />
                    <p className="text-muted-foreground">{t('loading')}</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Card className="bg-card border-border max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} className="bg-yellow-600 hover:bg-yellow-700">
                            {t('retry')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const filteredAlerts = getFilteredAlerts()

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
                                {t('back')}
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <Bell className="h-6 w-6 text-yellow-400" />
                                    Alertas de Precio
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Configura alertas para tus activos favoritos
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="border-border"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                            <Button
                                className="bg-yellow-600 hover:bg-yellow-700"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Alerta
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-400/10 rounded-lg">
                                        <Bell className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Activas</p>
                                        <p className="text-2xl font-bold">{summary.activeAlerts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-400/10 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Disparadas</p>
                                        <p className="text-2xl font-bold">{summary.triggeredAlerts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-400/10 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Take Profit</p>
                                        <p className="text-2xl font-bold">{summary.takeProfitAlerts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-400/10 rounded-lg">
                                        <TrendingDown className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Stop Loss</p>
                                        <p className="text-2xl font-bold">{summary.stopLossAlerts}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={activeTab === 'active' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('active')}
                        className={activeTab === 'active' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-border'}
                    >
                        Activas
                    </Button>
                    <Button
                        variant={activeTab === 'triggered' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('triggered')}
                        className={activeTab === 'triggered' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-border'}
                    >
                        {triggeredAlerts.length > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 mr-2">
                                {triggeredAlerts.length}
                            </span>
                        )}
                        Disparadas
                    </Button>
                    <Button
                        variant={activeTab === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab('all')}
                        className={activeTab === 'all' ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-border'}
                    >
                        Todas
                    </Button>
                </div>

                {/* Alerts List */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {activeTab === 'active' && 'Alertas Activas'}
                            {activeTab === 'triggered' && 'Alertas Disparadas'}
                            {activeTab === 'all' && 'Todas las Alertas'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredAlerts.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-muted-foreground mb-4">
                                    {activeTab === 'active' && 'No tienes alertas activas'}
                                    {activeTab === 'triggered' && 'No tienes alertas disparadas'}
                                    {activeTab === 'all' && 'No tienes alertas configuradas'}
                                </p>
                                {activeTab === 'all' && (
                                    <Button
                                        className="bg-yellow-600 hover:bg-yellow-700"
                                        onClick={() => setIsCreateModalOpen(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Crear Primera Alerta
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-4 rounded-lg border transition-all hover:bg-accent/50 ${
                                            alert.status === 'TRIGGERED' || alert.status === 'NOTIFIED'
                                                ? 'border-red-400/50 bg-red-400/5'
                                                : 'border-border'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className={`p-2 rounded-lg ${getAlertTypeColor(alert.alertType)}`}>
                                                    {getAlertIcon(alert.alertType)}
                                                </div>

                                                {/* Info */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-lg">{alert.symbol}</h3>
                                                        <Badge className={getAlertTypeColor(alert.alertType)}>
                                                            {getAlertTypeLabel(alert.alertType)}
                                                        </Badge>
                                                        <Badge className={getAlertStatusColor(alert.status)}>
                                                            {alert.status}
                                                        </Badge>
                                                    </div>

                                                    {alert.symbolName && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {alert.symbolName}
                                                        </p>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                                        <span>
                                                            <span className="text-muted-foreground">Objetivo: </span>
                                                            <span className="font-semibold text-yellow-400">
                                                                ${alert.targetPrice.toFixed(2)}
                                                            </span>
                                                        </span>

                                                        {alert.currentPrice && (
                                                            <span>
                                                                <span className="text-muted-foreground">Actual: </span>
                                                                <span className={`font-semibold ${
                                                                    alert.currentPrice < alert.targetPrice
                                                                        ? 'text-red-400'
                                                                        : 'text-green-400'
                                                                }`}>
                                                                    ${alert.currentPrice.toFixed(2)}
                                                                </span>
                                                            </span>
                                                        )}

                                                        {alert.distancePercentage !== undefined && (
                                                            <span>
                                                                <span className="text-muted-foreground">Distancia: </span>
                                                                <span className={`font-semibold ${
                                                                    alert.distancePercentage <= 5
                                                                        ? 'text-yellow-400'
                                                                        : 'text-muted-foreground'
                                                                }`}>
                                                                    {alert.distancePercentage.toFixed(1)}%
                                                                </span>
                                                            </span>
                                                        )}

                                                        {alert.recurring && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <RefreshCw className="h-3 w-3 mr-1" />
                                                                Recurrente
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {alert.notes && (
                                                        <p className="text-sm text-muted-foreground mt-2 italic">
                                                            "{alert.notes}"
                                                        </p>
                                                    )}

                                                    {alert.triggerMessage && (
                                                        <p className="text-sm text-red-400 mt-2 font-medium">
                                                            {alert.triggerMessage}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {new Date(alert.createdAt).toLocaleDateString('es-ES', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                        {alert.triggerCount > 0 && (
                                                            <span>
                                                                Disparada {alert.triggerCount} vez{alert.triggerCount > 1 ? 'es' : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {alert.status === 'TRIGGERED' || alert.status === 'NOTIFIED' ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDismiss(alert.id)}
                                                            className="border-border"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Descartar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReactivate(alert.id)}
                                                            className="border-green-400 text-green-400 hover:bg-green-400/10"
                                                        >
                                                            <RefreshCw className="h-4 w-4 mr-1" />
                                                            Reactivar
                                                        </Button>
                                                    </>
                                                ) : alert.isActive ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleReactivate(alert.id)}
                                                            className="border-border"
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            Ver
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReactivate(alert.id)}
                                                        className="border-green-400 text-green-400 hover:bg-green-400/10"
                                                    >
                                                        <RefreshCw className="h-4 w-4 mr-1" />
                                                        Reactivar
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(alert.id)}
                                                    className="border-red-400 text-red-400 hover:bg-red-400/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Near Target Alerts */}
                {summary && summary.nearTarget && summary.nearTarget.length > 0 && activeTab === 'active' && (
                    <Card className="bg-card border-border mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-400">
                                <AlertCircle className="h-5 w-5" />
                                Proximas a Dispararse
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {summary.nearTarget.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{alert.symbol}</span>
                                            <Badge className={getAlertTypeColor(alert.alertType)}>
                                                {getAlertTypeLabel(alert.alertType)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-muted-foreground">
                                                Distancia: <span className="text-yellow-400 font-semibold">
                                                    {alert.distancePercentage?.toFixed(1)}%
                                                </span>
                                            </span>
                                            <span className="text-yellow-400 font-semibold">
                                                ${alert.targetPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>

            {/* Create Alert Modal */}
            <CreateAlertModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadData}
            />
        </div>
    )
}