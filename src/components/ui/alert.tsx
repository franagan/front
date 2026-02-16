'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
    AlertCircle,
    CheckCircle,
    Info,
    AlertTriangle,
    X,
    TrendingUp,
    TrendingDown,
    ExternalLink,
    Target,
    Briefcase,
    Activity,
    Zap,
    Calendar
} from "lucide-react"

// Variantes del Alert
const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground border-border",
                destructive: "border-red-500/50 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 [&>svg]:text-red-600",
                success: "border-green-500/50 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50 [&>svg]:text-green-600",
                warning: "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50 [&>svg]:text-yellow-600",
                info: "border-blue-500/50 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 [&>svg]:text-blue-600",
                // Variantes específicas para finanzas
                bullish: "border-green-500/50 text-green-800 bg-green-50 [&>svg]:text-green-600",
                bearish: "border-red-500/50 text-red-800 bg-red-50 [&>svg]:text-red-600",
                neutral: "border-gray-500/50 text-gray-700 bg-gray-50 [&>svg]:text-gray-600",
                premium: "border-amber-500/50 text-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 [&>svg]:text-amber-600"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

// Props del Alert base
export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    dismissible?: boolean
    onDismiss?: () => void
    icon?: React.ReactNode
    action?: React.ReactNode
}

// Componente Alert base
export function Alert({
    className,
    variant,
    dismissible = false,
    onDismiss,
    icon,
    action,
    children,
    ...props
}: AlertProps) {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
        setIsVisible(false)
        onDismiss?.()
    }

    if (!isVisible) return null

    // Iconos por defecto según la variante
    const getDefaultIcon = () => {
        switch (variant) {
            case "destructive":
            case "bearish":
                return <AlertCircle className="h-4 w-4" />
            case "success":
            case "bullish":
                return <CheckCircle className="h-4 w-4" />
            case "warning":
                return <AlertTriangle className="h-4 w-4" />
            case "info":
            case "neutral":
                return <Info className="h-4 w-4" />
            case "premium":
                return <Zap className="h-4 w-4" />
            default:
                return <Info className="h-4 w-4" />
        }
    }

    return (
        <div className={cn(alertVariants({ variant }), className)} {...props}>
            {icon || getDefaultIcon()}
            <div className="flex-1">
                {children}
            </div>

            {/* Área de acciones */}
            <div className="flex items-center gap-2 ml-auto">
                {action}
                {dismissible && (
                    <button
                        onClick={handleDismiss}
                        className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded-sm hover:bg-black/10"
                        aria-label="Cerrar alerta"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

// Componentes de contenido del Alert
export function AlertTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h5
            className={cn("mb-1 font-medium leading-none tracking-tight", className)}
            {...props}
        />
    )
}

export function AlertDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <div
            className={cn("text-sm [&_p]:leading-relaxed", className)}
            {...props}
        />
    )
}

// Componentes especializados para finanzas

// Alert de mercado
export function MarketAlert({
    type,
    symbol,
    change,
    message,
    timestamp,
    action,
    dismissible = true,
    onDismiss,
    className
}: {
    type: "bullish" | "bearish" | "neutral"
    symbol?: string
    change?: number
    message: string
    timestamp?: Date
    action?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
}) {
    const isPositive = change && change > 0
    const isNegative = change && change < 0

    return (
        <Alert
            variant={type}
            dismissible={dismissible}
            onDismiss={onDismiss}
            className={className}
            icon={
                type === "bullish" ? <TrendingUp className="h-4 w-4" /> :
                    type === "bearish" ? <TrendingDown className="h-4 w-4" /> :
                        <Activity className="h-4 w-4" />
            }
            action={action}
        >
            <AlertTitle className="flex items-center gap-2">
                {symbol && (
                    <span className="font-bold">{symbol}</span>
                )}
                {change !== undefined && (
                    <span className={cn(
                        "text-sm font-medium",
                        isPositive && "text-green-600",
                        isNegative && "text-red-600"
                    )}>
                        {isPositive ? "+" : ""}{change.toFixed(2)}%
                    </span>
                )}
            </AlertTitle>
            <AlertDescription>
                {message}
                {timestamp && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {timestamp.toLocaleString()}
                    </div>
                )}
            </AlertDescription>
        </Alert>
    )
}

// Alert de cartera
export function PortfolioAlert({
    type,
    title,
    message,
    value,
    target,
    action,
    dismissible = true,
    onDismiss,
    className
}: {
    type: "success" | "warning" | "info" | "destructive"
    title: string
    message: string
    value?: number
    target?: number
    action?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
}) {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <Target className="h-4 w-4" />
            case "warning":
                return <AlertTriangle className="h-4 w-4" />
            case "destructive":
                return <AlertCircle className="h-4 w-4" />
            default:
                return <Briefcase className="h-4 w-4" />
        }
    }

    return (
        <Alert
            variant={type}
            dismissible={dismissible}
            onDismiss={onDismiss}
            className={className}
            icon={getIcon()}
            action={action}
        >
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {message}
                {value !== undefined && target !== undefined && (
                    <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                            <span>Actual: €{value.toLocaleString()}</span>
                            <span>Objetivo: €{target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                                className={cn(
                                    "h-2 rounded-full transition-all",
                                    type === "success" && "bg-green-500",
                                    type === "warning" && "bg-yellow-500",
                                    type === "info" && "bg-blue-500",
                                    type === "destructive" && "bg-red-500"
                                )}
                                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </AlertDescription>
        </Alert>
    )
}

// Banner promocional
export function PromoBanner({
    title,
    description,
    ctaText,
    ctaAction,
    dismissible = true,
    onDismiss,
    className
}: {
    title: string
    description: string
    ctaText?: string
    ctaAction?: () => void
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
}) {
    return (
        <Alert
            variant="premium"
            dismissible={dismissible}
            onDismiss={onDismiss}
            className={className}
            icon={<Zap className="h-4 w-4" />}
            action={
                ctaText && ctaAction && (
                    <button
                        onClick={ctaAction}
                        className="bg-amber-600 text-white text-sm px-3 py-1 rounded-md hover:bg-amber-700 transition-colors flex items-center gap-1"
                    >
                        {ctaText}
                        <ExternalLink className="h-3 w-3" />
                    </button>
                )
            }
        >
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}

// Alert de evento próximo
export function UpcomingEventAlert({
    event,
    date,
    description,
    importance = "info",
    action,
    dismissible = true,
    onDismiss,
    className
}: {
    event: string
    date: Date
    description: string
    importance?: "info" | "warning" | "success"
    action?: React.ReactNode
    dismissible?: boolean
    onDismiss?: () => void
    className?: string
}) {
    const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    return (
        <Alert
            variant={importance}
            dismissible={dismissible}
            onDismiss={onDismiss}
            className={className}
            icon={<Calendar className="h-4 w-4" />}
            action={action}
        >
            <AlertTitle className="flex items-center gap-2">
                {event}
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {daysUntil > 0 ? `${daysUntil} días` : "Hoy"}
                </span>
            </AlertTitle>
            <AlertDescription>
                {description}
                <div className="text-xs text-muted-foreground mt-1">
                    📅 {date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </AlertDescription>
        </Alert>
    )
}

// Hook para gestionar alertas
export function useAlerts() {
    const [alerts, setAlerts] = React.useState<Array<{
        id: string
        type: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props: any
    }>>([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addAlert = React.useCallback((type: string, props: any) => {
        const id = Math.random().toString(36).substr(2, 9)
        setAlerts(prev => [...prev, { id, type, props }])
        return id
    }, [])

    const removeAlert = React.useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
    }, [])

    const clearAlerts = React.useCallback(() => {
        setAlerts([])
    }, [])

    return {
        alerts,
        addAlert,
        removeAlert,
        clearAlerts
    }
}

// Exportar todo
export {
    alertVariants
}