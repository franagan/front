// Alert Types - Sistema de Alertas Inteligentes
// Tipos TypeScript para el modulo de alertas de precios

export type AlertType = 'STOP_LOSS' | 'TAKE_PROFIT' | 'PRICE_TARGET'
export type AlertStatus = 'ACTIVE' | 'TRIGGERED' | 'NOTIFIED' | 'DISMISSED' | 'EXPIRED'

export interface Alert {
    id: string
    userId: string
    symbol: string
    symbolName?: string
    alertType: AlertType
    targetPrice: number
    currentPrice?: number
    status: AlertStatus
    isActive: boolean
    triggeredAt?: string
    triggerMessage?: string
    triggerCount: number
    notes?: string
    emailNotification: boolean
    pushNotification: boolean
    recurring: boolean
    expiresAt?: string
    createdAt: string
    updatedAt?: string
    lastCheckedAt?: string
    distancePercentage?: number
    isExpired?: boolean
    isNearTarget?: boolean
}

export interface CreateAlertRequest {
    symbol: string
    symbolName?: string
    alertType: AlertType
    targetPrice: number
    notes?: string
    emailNotification?: boolean
    pushNotification?: boolean
    recurring?: boolean
    expiresAt?: string
}

export interface UpdateAlertRequest {
    targetPrice?: number
    notes?: string
    emailNotification?: boolean
    pushNotification?: boolean
    recurring?: boolean
    isActive?: boolean
    expiresAt?: string
}

export interface AlertSummary {
    totalAlerts: number
    activeAlerts: number
    triggeredAlerts: number
    stopLossAlerts: number
    takeProfitAlerts: number
    priceTargetAlerts: number
    recentTriggered: Alert[]
    nearTarget: Alert[]
}

export interface AlertApiResponse<T> {
    success: boolean
    data: T
    message: string
    timestamp?: string
}

// Helper functions for alert display
export const getAlertTypeLabel = (type: AlertType): string => {
    const labels: Record<AlertType, string> = {
        STOP_LOSS: 'Stop Loss',
        TAKE_PROFIT: 'Take Profit',
        PRICE_TARGET: 'Objetivo de Precio'
    }
    return labels[type] || type
}

export const getAlertTypeDescription = (type: AlertType): string => {
    const descriptions: Record<AlertType, string> = {
        STOP_LOSS: 'Alerta cuando el precio cae por debajo del umbral',
        TAKE_PROFIT: 'Alerta cuando el precio sube por encima del umbral',
        PRICE_TARGET: 'Alerta cuando el precio alcanza el objetivo'
    }
    return descriptions[type] || ''
}

export const getAlertStatusColor = (status: AlertStatus): string => {
    const colors: Record<AlertStatus, string> = {
        ACTIVE: 'text-blue-400 bg-blue-400/10',
        TRIGGERED: 'text-red-400 bg-red-400/10',
        NOTIFIED: 'text-yellow-400 bg-yellow-400/10',
        DISMISSED: 'text-gray-400 bg-gray-400/10',
        EXPIRED: 'text-orange-400 bg-orange-400/10'
    }
    return colors[status] || 'text-gray-400 bg-gray-400/10'
}

export const getAlertTypeColor = (type: AlertType): string => {
    const colors: Record<AlertType, string> = {
        STOP_LOSS: 'text-red-400 bg-red-400/10 border-red-400/30',
        TAKE_PROFIT: 'text-green-400 bg-green-400/10 border-green-400/30',
        PRICE_TARGET: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    }
    return colors[type] || 'text-gray-400 bg-gray-400/10'
}

export const getAlertTypeIcon = (type: AlertType): string => {
    const icons: Record<AlertType, string> = {
        STOP_LOSS: 'TrendingDown',
        TAKE_PROFIT: 'TrendingUp',
        PRICE_TARGET: 'Target'
    }
    return icons[type] || 'Bell'
}