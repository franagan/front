'use client'

import * as React from "react"
import { useState, createContext, useContext } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Context para manejar el estado de los tabs
interface TabsContextType {
    activeTab: string
    setActiveTab: (tabId: string) => void
    orientation?: "horizontal" | "vertical"
    variant?: "default" | "pills" | "underline" | "financial"
}

const TabsContext = createContext<TabsContextType | null>(null)

const useTabsContext = () => {
    const context = useContext(TabsContext)
    if (!context) {
        throw new Error("Tab components must be used within a Tabs provider")
    }
    return context
}

// Types para las props
export interface TabItem {
    id: string
    label: string
    icon?: React.ReactNode
    badge?: string | number
    disabled?: boolean
    notification?: boolean
    content?: React.ReactNode
}

export interface TabsProps {
    defaultTab?: string
    activeTab?: string
    onTabChange?: (tabId: string) => void
    orientation?: "horizontal" | "vertical"
    variant?: "default" | "pills" | "underline" | "financial"
    className?: string
    children: React.ReactNode
}

export interface TabsListProps {
    className?: string
    children: React.ReactNode
}

export interface TabsTriggerProps {
    value: string
    disabled?: boolean
    className?: string
    children: React.ReactNode
}

export interface TabsContentProps {
    value: string
    className?: string
    children: React.ReactNode
}

// Componente principal Tabs
export function Tabs({
    defaultTab,
    activeTab: controlledActiveTab,
    onTabChange,
    orientation = "horizontal",
    variant = "default",
    className,
    children
}: TabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || "")
    
    const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab
    
    const setActiveTab = (tabId: string) => {
        if (controlledActiveTab === undefined) {
            setInternalActiveTab(tabId)
        }
        onTabChange?.(tabId)
    }

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, orientation, variant }}>
            <div 
                className={cn(
                    "tabs-container",
                    orientation === "vertical" && "flex gap-6",
                    className
                )}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
}

// Lista de triggers (cabeceras de tabs)
export function TabsList({ className, children }: TabsListProps) {
    const { orientation, variant } = useTabsContext()
    
    return (
        <div 
            className={cn(
                "tabs-list",
                // Base styles
                "flex",
                
                // Orientation
                orientation === "horizontal" && "flex-row border-b border-gray-200",
                orientation === "vertical" && "flex-col space-y-1 min-w-[200px]",
                
                // Variants
                variant === "pills" && "p-1 bg-gray-100 rounded-lg",
                variant === "financial" && "bg-white border-b-2 border-gray-100",
                
                className
            )}
        >
            {children}
        </div>
    )
}

// Trigger individual (cabecera de tab)
export function TabsTrigger({ value, disabled = false, className, children }: TabsTriggerProps) {
    const { activeTab, setActiveTab, orientation, variant } = useTabsContext()
    const isActive = activeTab === value
    
    const handleClick = () => {
        if (!disabled) {
            setActiveTab(value)
        }
    }
    
    return (
        <button
            className={cn(
                "tabs-trigger transition-all duration-200 font-medium text-sm",
                
                // Base styles
                "flex items-center justify-center gap-2 px-4 py-2",
                
                // Orientation
                orientation === "horizontal" && "whitespace-nowrap",
                orientation === "vertical" && "w-full justify-start text-left",
                
                // States
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "cursor-pointer",
                
                // Variants - Default
                variant === "default" && [
                    "border-b-2 border-transparent",
                    isActive && "border-blue-600 text-blue-600",
                    !isActive && !disabled && "text-gray-600 hover:text-gray-900 hover:border-gray-300"
                ],
                
                // Variants - Pills
                variant === "pills" && [
                    "rounded-md",
                    isActive && "bg-white text-gray-900 shadow-sm",
                    !isActive && !disabled && "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                ],
                
                // Variants - Underline
                variant === "underline" && [
                    "border-b-2 border-transparent relative",
                    isActive && "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600",
                    !isActive && !disabled && "text-gray-600 hover:text-gray-900"
                ],
                
                // Variants - Financial
                variant === "financial" && [
                    "border-b-3 border-transparent font-semibold",
                    isActive && "border-green-500 text-green-700 bg-green-50",
                    !isActive && !disabled && "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                ],
                
                className
            )}
            onClick={handleClick}
            disabled={disabled}
            type="button"
        >
            {children}
        </button>
    )
}

// Contenido del tab
export function TabsContent({ value, className, children }: TabsContentProps) {
    const { activeTab } = useTabsContext()
    
    if (activeTab !== value) {
        return null
    }
    
    return (
        <div className={cn("tabs-content mt-6", className)}>
            {children}
        </div>
    )
}

// Hook personalizado para tabs simples
export function useSimpleTabs(items: TabItem[], defaultTab?: string) {
    const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id || "")
    
    const activeContent = items.find(item => item.id === activeTab)?.content
    
    return {
        activeTab,
        setActiveTab,
        activeContent,
        items
    }
}

// Componente de alto nivel para casos simples
export function SimpleTabs({
    items,
    defaultTab,
    variant = "default",
    orientation = "horizontal",
    onTabChange,
    className
}: {
    items: TabItem[]
    defaultTab?: string
    variant?: "default" | "pills" | "underline" | "financial"
    orientation?: "horizontal" | "vertical"
    onTabChange?: (tabId: string) => void
    className?: string
}) {
    const { activeTab, setActiveTab, activeContent } = useSimpleTabs(items, defaultTab)
    
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
        onTabChange?.(tabId)
    }
    
    return (
        <Tabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            variant={variant}
            orientation={orientation}
            className={className}
        >
            <TabsList>
                {items.map((item) => (
                    <TabsTrigger
                        key={item.id}
                        value={item.id}
                        disabled={item.disabled}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                            {item.badge && (
                                <Badge 
                                    variant="secondary" 
                                    className="ml-1 h-5 min-w-[20px] text-xs"
                                >
                                    {item.badge}
                                </Badge>
                            )}
                            {item.notification && (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                        </div>
                    </TabsTrigger>
                ))}
            </TabsList>
            
            {items.map((item) => (
                <TabsContent key={item.id} value={item.id}>
                    {item.content || activeContent}
                </TabsContent>
            ))}
        </Tabs>
    )
}

// Componente especializado para timeframes financieros
export function TimeframeTabs({
    activeTimeframe,
    onTimeframeChange,
    className
}: {
    activeTimeframe?: string
    onTimeframeChange?: (timeframe: string) => void
    className?: string
}) {
    const timeframes = [
        { id: "1D", label: "1D" },
        { id: "1W", label: "1S" },
        { id: "1M", label: "1M" },
        { id: "3M", label: "3M" },
        { id: "6M", label: "6M" },
        { id: "1Y", label: "1A" },
        { id: "ALL", label: "Todo" }
    ]
    
    return (
        <Tabs
            activeTab={activeTimeframe}
            onTabChange={onTimeframeChange}
            variant="pills"
            className={className}
        >
            <TabsList className="inline-flex">
                {timeframes.map((timeframe) => (
                    <TabsTrigger
                        key={timeframe.id}
                        value={timeframe.id}
                        className="px-3 py-1 text-xs"
                    >
                        {timeframe.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}

// Componente para tabs de métricas financieras
export function MetricTabs({
    activeMetric,
    onMetricChange,
    metrics,
    className
}: {
    activeMetric?: string
    onMetricChange?: (metric: string) => void
    metrics: Array<{
        id: string
        label: string
        value: string | number
        change?: number
        positive?: boolean
    }>
    className?: string
}) {
    return (
        <Tabs
            activeTab={activeMetric}
            onTabChange={onMetricChange}
            variant="financial"
            className={className}
        >
            <TabsList>
                {metrics.map((metric) => (
                    <TabsTrigger
                        key={metric.id}
                        value={metric.id}
                        className="flex-col items-center p-3"
                    >
                        <span className="text-xs text-gray-500">{metric.label}</span>
                        <span className="text-lg font-bold">{metric.value}</span>
                        {metric.change !== undefined && (
                            <span className={cn(
                                "text-xs",
                                metric.positive ? "text-green-600" : "text-red-600"
                            )}>
                                {metric.positive ? "+" : ""}{metric.change}%
                            </span>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}

// Export de todos los componentes
export {
    useTabsContext,
    TabsContext
}