'use client'

import * as React from "react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Types para los datos financieros
export interface ChartDataPoint {
    name: string
    value: number
    [key: string]: any
}

export interface FinancialChartProps {
    data: ChartDataPoint[]
    title?: string
    subtitle?: string
    height?: number
    className?: string
    showGrid?: boolean
    showLegend?: boolean
    colors?: string[]
}

// Colores por defecto para finanzas (verde/rojo + neutrales)
const DEFAULT_COLORS = [
    "#10b981", // Verde (ganancias)
    "#ef4444", // Rojo (pérdidas)
    "#3b82f6", // Azul
    "#f59e0b", // Amarillo/Oro
    "#8b5cf6", // Púrpura
    "#06b6d4", // Cyan
    "#84cc16", // Lima
    "#f97316"  // Naranja
]

// Formatter para mostrar valores como moneda
const formatCurrency = (value: number, currency: string = "EUR"): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value)
}

// Formatter para mostrar porcentajes
const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
}

// Formatter personalizado para tooltip
const CustomTooltip = ({ 
    active, 
    payload, 
    label, 
    formatType = "currency" 
}: {
    active?: boolean
    payload?: any[]
    label?: string
    formatType?: "currency" | "percentage" | "number"
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        <span className="font-medium">{entry.dataKey}: </span>
                        {formatType === "currency" && formatCurrency(entry.value)}
                        {formatType === "percentage" && formatPercentage(entry.value)}
                        {formatType === "number" && entry.value.toLocaleString('es-ES')}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

// Line Chart para evolución temporal
export function LineFinancialChart({
    data,
    title,
    subtitle,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    colors = DEFAULT_COLORS
}: FinancialChartProps & {
    dataKeys?: string[]
    formatType?: "currency" | "percentage" | "number"
}) {
    const dataKeys = React.useMemo(() => {
        if (data.length === 0) return []
        return Object.keys(data[0]).filter(key => key !== "name" && typeof data[0][key] === "number")
    }, [data])

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip formatType="currency" />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Bar Chart para comparaciones
export function BarFinancialChart({
    data,
    title,
    subtitle,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    colors = DEFAULT_COLORS
}: FinancialChartProps & {
    dataKeys?: string[]
    formatType?: "currency" | "percentage" | "number"
}) {
    const dataKeys = React.useMemo(() => {
        if (data.length === 0) return []
        return Object.keys(data[0]).filter(key => key !== "name" && typeof data[0][key] === "number")
    }, [data])

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip formatType="currency" />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={colors[index % colors.length]}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Pie Chart para distribuciones
export function PieFinancialChart({
    data,
    title,
    subtitle,
    height = 300,
    className,
    showLegend = true,
    colors = DEFAULT_COLORS
}: FinancialChartProps) {
    const RADIAN = Math.PI / 180
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="600"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value: number) => [formatCurrency(value), 'Valor']}
                        />
                        {showLegend && <Legend />}
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Area Chart para crecimiento acumulado
export function AreaFinancialChart({
    data,
    title,
    subtitle,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    colors = DEFAULT_COLORS
}: FinancialChartProps) {
    const dataKeys = React.useMemo(() => {
        if (data.length === 0) return []
        return Object.keys(data[0]).filter(key => key !== "name" && typeof data[0][key] === "number")
    }, [data])

    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <AreaChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip formatType="currency" />} />
                        {showLegend && <Legend />}
                        {dataKeys.map((key, index) => (
                            <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stackId="1"
                                stroke={colors[index % colors.length]}
                                fill={colors[index % colors.length]}
                                fillOpacity={0.6}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Composed Chart para métricas combinadas
export function ComposedFinancialChart({
    data,
    title,
    subtitle,
    height = 300,
    className,
    showGrid = true,
    showLegend = true,
    colors = DEFAULT_COLORS,
    lineKeys = [],
    barKeys = []
}: FinancialChartProps & {
    lineKeys?: string[]
    barKeys?: string[]
}) {
    return (
        <Card className={className}>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </CardHeader>
            )}
            <CardContent>
                <ResponsiveContainer width="100%" height={height}>
                    <ComposedChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip content={<CustomTooltip formatType="currency" />} />
                        {showLegend && <Legend />}
                        
                        {barKeys.map((key, index) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                fill={colors[index % colors.length]}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                        
                        {lineKeys.map((key, index) => (
                            <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={colors[(barKeys.length + index) % colors.length]}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

// Export componentes individuales y helpers
export {
    formatCurrency,
    formatPercentage,
    CustomTooltip,
    DEFAULT_COLORS
}

// Componente Chart principal que decide qué tipo usar
interface ChartProps extends FinancialChartProps {
    type: "line" | "bar" | "pie" | "area" | "composed"
    lineKeys?: string[]
    barKeys?: string[]
}

export function Chart({ type, ...props }: ChartProps) {
    switch (type) {
        case "line":
            return <LineFinancialChart {...props} />
        case "bar":
            return <BarFinancialChart {...props} />
        case "pie":
            return <PieFinancialChart {...props} />
        case "area":
            return <AreaFinancialChart {...props} />
        case "composed":
            return <ComposedFinancialChart {...props} />
        default:
            return <LineFinancialChart {...props} />
    }
}

export default Chart