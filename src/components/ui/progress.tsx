'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
    Target,
    TrendingUp,
    DollarSign,
    Clock,
    Loader2,
    CheckCircle,
    AlertCircle,
    BarChart3,
    Activity,
    Zap,
    Shield,
    ArrowUp,
    ArrowDown,
    Minus,
    Calendar,
    PiggyBank
} from "lucide-react"

// Variantes del Progress
const progressVariants = cva(
    "relative overflow-hidden rounded-full",
    {
        variants: {
            variant: {
                default: "bg-gray-200",
                success: "bg-green-100",
                warning: "bg-yellow-100",
                destructive: "bg-red-100",
                info: "bg-blue-100",
                // Variantes específicas para finanzas
                fire: "bg-gradient-to-r from-orange-100 to-red-100",
                investment: "bg-gradient-to-r from-blue-100 to-green-100",
                savings: "bg-gradient-to-r from-green-100 to-emerald-100"
            },
            size: {
                sm: "h-2",
                default: "h-3", 
                lg: "h-4",
                xl: "h-6"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

const progressBarVariants = cva(
    "h-full transition-all duration-500 ease-in-out",
    {
        variants: {
            variant: {
                default: "bg-gray-600",
                success: "bg-green-600",
                warning: "bg-yellow-600", 
                destructive: "bg-red-600",
                info: "bg-blue-600",
                fire: "bg-gradient-to-r from-orange-500 to-red-500",
                investment: "bg-gradient-to-r from-blue-500 to-green-500",
                savings: "bg-gradient-to-r from-green-500 to-emerald-500"
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

// Props del Progress base
export interface ProgressProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof progressVariants> {
    value?: number
    max?: number
    showValue?: boolean
    label?: string
    animate?: boolean
}

// Componente Progress base
export function Progress({
    className,
    variant,
    size,
    value = 0,
    max = 100,
    showValue = false,
    label,
    animate = true,
    ...props
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
        <div className="space-y-2">
            {(label || showValue) && (
                <div className="flex justify-between text-sm">
                    {label && <span className="font-medium text-gray-700">{label}</span>}
                    {showValue && (
                        <span className="text-gray-600">
                            {percentage.toFixed(1)}%
                        </span>
                    )}
                </div>
            )}
            <div className={cn(progressVariants({ variant, size }), className)} {...props}>
                <div
                    className={cn(
                        progressBarVariants({ variant }),
                        animate && "transition-all duration-500 ease-in-out"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

// Progress circular
export function CircularProgress({
    value = 0,
    max = 100,
    size = 120,
    strokeWidth = 8,
    variant = "default",
    showValue = true,
    label,
    className
}: {
    value?: number
    max?: number
    size?: number
    strokeWidth?: number
    variant?: "default" | "success" | "warning" | "destructive" | "info" | "fire" | "investment"
    showValue?: boolean
    label?: string
    className?: string
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    
    const getColor = () => {
        switch (variant) {
            case "success": return "#10b981"
            case "warning": return "#f59e0b"
            case "destructive": return "#ef4444"
            case "info": return "#3b82f6"
            case "fire": return "#f97316"
            case "investment": return "#10b981"
            default: return "#6b7280"
        }
    }
    
    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-in-out"
                />
            </svg>
            {(showValue || label) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {showValue && (
                        <span className="text-lg font-bold" style={{ color: getColor() }}>
                            {percentage.toFixed(0)}%
                        </span>
                    )}
                    {label && (
                        <span className="text-xs text-gray-600 text-center">{label}</span>
                    )}
                </div>
            )}
        </div>
    )
}

// Progress para objetivos FIRE
export function FireProgress({
    current,
    target,
    title = "Objetivo FIRE",
    timeFrame,
    monthlyContribution,
    className
}: {
    current: number
    target: number
    title?: string
    timeFrame?: string
    monthlyContribution?: number
    className?: string
}) {
    const percentage = (current / target) * 100
    const remaining = target - current
    const monthsToGoal = monthlyContribution ? Math.ceil(remaining / monthlyContribution) : null
    
    return (
        <div className={cn("space-y-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200", className)}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    {title}
                </h3>
                <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                        {percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">completado</div>
                </div>
            </div>
            
            <Progress 
                variant="fire" 
                value={current} 
                max={target} 
                size="lg"
                animate
            />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="font-medium text-gray-900">Actual</div>
                    <div className="text-orange-600 font-bold">
                        €{current.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="font-medium text-gray-900">Objetivo</div>
                    <div className="text-gray-600">
                        €{target.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="font-medium text-gray-900">Restante</div>
                    <div className="text-red-600">
                        €{remaining.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div className="font-medium text-gray-900">
                        {monthsToGoal ? "Tiempo estimado" : "Marco temporal"}
                    </div>
                    <div className="text-blue-600">
                        {monthsToGoal ? `${Math.floor(monthsToGoal / 12)}a ${monthsToGoal % 12}m` : timeFrame}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Progress steps para procesos
export function StepProgress({
    steps,
    currentStep = 0,
    variant = "default",
    className
}: {
    steps: string[]
    currentStep?: number
    variant?: "default" | "success" | "investment"
    className?: string
}) {
    const getStepColor = (index: number) => {
        if (index < currentStep) return variant === "investment" ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
        if (index === currentStep) return variant === "investment" ? "text-green-600 bg-green-200" : "text-blue-600 bg-blue-200"
        return "text-gray-400 bg-gray-100"
    }
    
    const getLineColor = (index: number) => {
        return index < currentStep ? 
            (variant === "investment" ? "bg-green-500" : "bg-blue-500") : 
            "bg-gray-200"
    }
    
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                getStepColor(index)
                            )}>
                                {index < currentStep ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <div className="text-xs text-gray-600 mt-2 text-center max-w-20">
                                {step}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 h-1 mx-4 rounded-full transition-all duration-300",
                                getLineColor(index)
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="text-center text-sm text-gray-600">
                Paso {currentStep + 1} de {steps.length}: {steps[currentStep]}
            </div>
        </div>
    )
}

// Loading Spinner
export function LoadingSpinner({
    size = "default",
    variant = "default",
    text,
    className
}: {
    size?: "sm" | "default" | "lg"
    variant?: "default" | "success" | "warning" | "destructive" | "investment"
    text?: string
    className?: string
}) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-6 w-6", 
        lg: "h-8 w-8"
    }
    
    const colorClasses = {
        default: "text-gray-600",
        success: "text-green-600",
        warning: "text-yellow-600",
        destructive: "text-red-600",
        investment: "text-blue-600"
    }
    
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Loader2 className={cn(
                "animate-spin",
                sizeClasses[size],
                colorClasses[variant]
            )} />
            {text && (
                <span className={cn("text-sm", colorClasses[variant])}>
                    {text}
                </span>
            )}
        </div>
    )
}

// Progress para cargas de datos financieros
export function FinancialDataProgress({
    status,
    progress = 0,
    currentTask,
    className
}: {
    status: "loading" | "success" | "error"
    progress?: number
    currentTask?: string
    className?: string
}) {
    const getStatusConfig = () => {
        switch (status) {
            case "loading":
                return {
                    icon: <Loader2 className="h-5 w-5 animate-spin text-blue-600" />,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200"
                }
            case "success":
                return {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200"
                }
            case "error":
                return {
                    icon: <AlertCircle className="h-5 w-5 text-red-600" />,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200"
                }
        }
    }
    
    const config = getStatusConfig()
    
    return (
        <div className={cn(
            "p-4 rounded-lg border",
            config.bgColor,
            config.borderColor,
            className
        )}>
            <div className="flex items-center gap-3 mb-3">
                {config.icon}
                <div>
                    <div className={cn("font-medium", config.color)}>
                        {status === "loading" && "Cargando datos del mercado..."}
                        {status === "success" && "Datos actualizados correctamente"}
                        {status === "error" && "Error al cargar datos"}
                    </div>
                    {currentTask && (
                        <div className="text-sm text-gray-600">{currentTask}</div>
                    )}
                </div>
            </div>
            
            {status === "loading" && (
                <Progress 
                    variant="info"
                    value={progress}
                    showValue
                    size="sm"
                />
            )}
        </div>
    )
}

// Progress con múltiples métricas
export function MultiMetricProgress({
    metrics,
    title,
    className
}: {
    metrics: Array<{
        label: string
        value: number
        max: number
        variant?: "default" | "success" | "warning" | "destructive" | "fire" | "investment"
        icon?: React.ReactNode
        trend?: "up" | "down" | "neutral"
    }>
    title?: string
    className?: string
}) {
    const getTrendIcon = (trend?: "up" | "down" | "neutral") => {
        switch (trend) {
            case "up": return <ArrowUp className="h-3 w-3 text-green-600" />
            case "down": return <ArrowDown className="h-3 w-3 text-red-600" />
            case "neutral": return <Minus className="h-3 w-3 text-gray-600" />
            default: return null
        }
    }
    
    return (
        <div className={cn("space-y-4 p-6 bg-white rounded-lg border border-gray-200", className)}>
            {title && (
                <h3 className="font-semibold text-gray-900">{title}</h3>
            )}
            <div className="space-y-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                {metric.icon}
                                <span className="font-medium text-gray-700">{metric.label}</span>
                                {getTrendIcon(metric.trend)}
                            </div>
                            <span className="text-gray-600">
                                {((metric.value / metric.max) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <Progress
                            variant={metric.variant || "default"}
                            value={metric.value}
                            max={metric.max}
                            size="sm"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Hook para gestionar estados de carga
export function useLoading() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const [currentTask, setCurrentTask] = React.useState<string>()

    const startLoading = React.useCallback((task?: string) => {
        setIsLoading(true)
        setProgress(0)
        setCurrentTask(task)
    }, [])

    const updateProgress = React.useCallback((value: number, task?: string) => {
        setProgress(value)
        if (task) setCurrentTask(task)
    }, [])

    const finishLoading = React.useCallback(() => {
        setProgress(100)
        setTimeout(() => {
            setIsLoading(false)
            setProgress(0)
            setCurrentTask(undefined)
        }, 500)
    }, [])

    return {
        isLoading,
        progress,
        currentTask,
        startLoading,
        updateProgress,
        finishLoading
    }
}

// Exportar variantes
export { progressVariants, progressBarVariants }