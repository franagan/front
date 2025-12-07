'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Skeleton base
const skeletonVariants = cva(
    "animate-pulse rounded-md bg-gradient-to-r",
    {
        variants: {
            variant: {
                default: "from-gray-200 via-gray-300 to-gray-200",
                light: "from-gray-100 via-gray-200 to-gray-100",
                dark: "from-gray-300 via-gray-400 to-gray-300",
                // Variantes específicas para finanzas
                financial: "from-blue-100 via-blue-200 to-blue-100",
                success: "from-green-100 via-green-200 to-green-100",
                warning: "from-yellow-100 via-yellow-200 to-yellow-100"
            },
            speed: {
                slow: "animate-pulse",
                normal: "animate-pulse",
                fast: "animate-pulse"
            }
        },
        defaultVariants: {
            variant: "default",
            speed: "normal"
        }
    }
)

// Props del Skeleton base
export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof skeletonVariants> {
    width?: string | number
    height?: string | number
}

// Componente Skeleton base
export function Skeleton({
    className,
    variant,
    speed,
    width,
    height,
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(skeletonVariants({ variant, speed }), className)}
            style={{
                width,
                height,
                ...style
            }}
            {...props}
        />
    )
}

// Skeleton para texto
export function SkeletonText({
    lines = 1,
    className,
    variant = "default"
}: {
    lines?: number
    className?: string
    variant?: "default" | "light" | "dark" | "financial"
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant={variant}
                    height="1rem"
                    width={index === lines - 1 && lines > 1 ? "75%" : "100%"}
                />
            ))}
        </div>
    )
}

// Skeleton para cards financieras
export function SkeletonCard({
    showHeader = true,
    showContent = true,
    contentLines = 3,
    className,
    variant = "financial"
}: {
    showHeader?: boolean
    showContent?: boolean
    contentLines?: number
    className?: string
    variant?: "default" | "light" | "financial" | "success" | "warning"
}) {
    return (
        <div className={cn("p-6 border border-gray-200 rounded-lg bg-white", className)}>
            {showHeader && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Skeleton variant={variant} width="2rem" height="2rem" className="rounded-full" />
                        <div className="space-y-2">
                            <Skeleton variant={variant} width="8rem" height="1rem" />
                            <Skeleton variant={variant} width="6rem" height="0.75rem" />
                        </div>
                    </div>
                    <Skeleton variant={variant} width="4rem" height="1.5rem" className="rounded-full" />
                </div>
            )}
            
            {showContent && (
                <div className="space-y-3">
                    {Array.from({ length: contentLines }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant={variant}
                            height="1rem"
                            width={index === contentLines - 1 ? "60%" : "100%"}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// Skeleton para tablas financieras
export function SkeletonTable({
    rows = 5,
    columns = 4,
    showHeader = true,
    className,
    variant = "financial"
}: {
    rows?: number
    columns?: number
    showHeader?: boolean
    className?: string
    variant?: "default" | "light" | "financial"
}) {
    return (
        <div className={cn("w-full", className)}>
            {showHeader && (
                <div className="grid gap-4 p-4 border-b border-gray-200" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                    {Array.from({ length: columns }).map((_, index) => (
                        <Skeleton
                            key={index}
                            variant={variant}
                            height="1rem"
                            width="80%"
                        />
                    ))}
                </div>
            )}
            
            <div className="space-y-2">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="grid gap-4 p-4 border-b border-gray-100"
                        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
                    >
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton
                                key={colIndex}
                                variant={variant}
                                height="1rem"
                                width={colIndex === 0 ? "70%" : colIndex === columns - 1 ? "50%" : "90%"}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

// Skeleton para gráficos
export function SkeletonChart({
    type = "line",
    width = "100%",
    height = "300px",
    className,
    variant = "financial"
}: {
    type?: "line" | "bar" | "pie" | "area"
    width?: string | number
    height?: string | number
    className?: string
    variant?: "default" | "financial" | "success"
}) {
    if (type === "pie") {
        return (
            <div className={cn("flex items-center justify-center bg-gray-50 rounded-lg", className)} style={{ width, height }}>
                <Skeleton
                    variant={variant}
                    width="200px"
                    height="200px"
                    className="rounded-full"
                />
            </div>
        )
    }
    
    return (
        <div className={cn("bg-gray-50 rounded-lg p-6", className)} style={{ width, height }}>
            <div className="h-full flex items-end justify-between space-x-2">
                {Array.from({ length: type === "line" ? 8 : 6 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        variant={variant}
                        width={type === "bar" ? "2rem" : "0.5rem"}
                        height={`${Math.random() * 60 + 20}%`}
                        className={type === "line" ? "rounded-full" : "rounded-t"}
                    />
                ))}
            </div>
        </div>
    )
}

// Skeleton para métricas financieras
export function SkeletonMetrics({
    count = 4,
    className,
    variant = "financial"
}: {
    count?: number
    className?: string
    variant?: "default" | "financial" | "success" | "warning"
}) {
    return (
        <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${Math.min(count, 4)}, 1fr)` }}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                        <Skeleton
                            variant={variant}
                            width="2.5rem"
                            height="2.5rem"
                            className="rounded-lg"
                        />
                        <div className="ml-4 space-y-2 flex-1">
                            <Skeleton variant={variant} width="60%" height="0.875rem" />
                            <Skeleton variant={variant} width="40%" height="1.5rem" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Skeleton para portfolio/cartera
export function SkeletonPortfolio({
    showHeader = true,
    showChart = true,
    showTable = true,
    className,
    variant = "financial"
}: {
    showHeader?: boolean
    showChart?: boolean
    showTable?: boolean
    className?: string
    variant?: "default" | "financial" | "success"
}) {
    return (
        <div className={cn("space-y-6", className)}>
            {showHeader && <SkeletonMetrics count={4} variant={variant} />}
            
            {showChart && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonChart type="line" variant={variant} />
                    <SkeletonChart type="pie" variant={variant} />
                </div>
            )}
            
            {showTable && (
                <div className="bg-white border border-gray-200 rounded-lg">
                    <SkeletonTable rows={6} columns={5} variant={variant === "success" ? "default" : variant} />
                </div>
            )}
        </div>
    )
}

// Skeleton para noticias financieras
export function SkeletonNews({
    count = 5,
    className,
    variant = "default"
}: {
    count?: number
    className?: string
    variant?: "default" | "light" | "financial"
}) {
    return (
        <div className={cn("space-y-4", className)}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="p-6 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-4">
                        <Skeleton
                            variant={variant}
                            width="4rem"
                            height="4rem"
                            className="rounded-lg"
                        />
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center space-x-2">
                                <Skeleton variant={variant} width="4rem" height="1.25rem" className="rounded-full" />
                                <Skeleton variant={variant} width="6rem" height="0.875rem" />
                            </div>
                            <Skeleton variant={variant} width="90%" height="1.125rem" />
                            <Skeleton variant={variant} width="75%" height="0.875rem" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Skeleton para dashboard completo
export function SkeletonDashboard({
    showNavigation = true,
    showSidebar = false,
    className
}: {
    showNavigation?: boolean
    showSidebar?: boolean
    className?: string
}) {
    return (
        <div className={cn("min-h-screen bg-gray-50", className)}>
            {showNavigation && (
                <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Skeleton width="2rem" height="2rem" className="rounded-lg" />
                            <Skeleton width="8rem" height="1.5rem" />
                        </div>
                        <div className="flex items-center space-x-3">
                            <Skeleton width="2rem" height="2rem" className="rounded-full" />
                            <Skeleton width="6rem" height="1.5rem" className="rounded-full" />
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex">
                {showSidebar && (
                    <div className="w-64 bg-white border-r border-gray-200 p-4">
                        <div className="space-y-3">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <Skeleton width="1.5rem" height="1.5rem" className="rounded" />
                                    <Skeleton width="60%" height="1rem" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="flex-1 p-8">
                    <SkeletonPortfolio />
                </div>
            </div>
        </div>
    )
}

// Hook para gestionar skeletons con datos
export function useSkeleton(loading: boolean = true, delay: number = 0) {
    const [showSkeleton, setShowSkeleton] = React.useState(loading)
    
    React.useEffect(() => {
        if (loading) {
            setShowSkeleton(true)
        } else {
            const timer = setTimeout(() => {
                setShowSkeleton(false)
            }, delay)
            return () => clearTimeout(timer)
        }
    }, [loading, delay])
    
    return showSkeleton
}

// Wrapper que muestra skeleton o contenido
export function SkeletonWrapper({
    loading,
    skeleton,
    children,
    delay = 0
}: {
    loading: boolean
    skeleton: React.ReactNode
    children: React.ReactNode
    delay?: number
}) {
    const showSkeleton = useSkeleton(loading, delay)
    
    return showSkeleton ? <>{skeleton}</> : <>{children}</>
}

// Exportar variantes
export { skeletonVariants }