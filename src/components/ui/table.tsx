'use client'

import * as React from "react"
import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    ChevronUp,
    ChevronDown,
    Search,
    TrendingUp,
    TrendingDown,
    Minus,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Download
} from "lucide-react"

// Types para la tabla
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableColumn<T = any> {
    key: string
    header: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessor: keyof T | ((row: T) => any)
    sortable?: boolean
    filterable?: boolean
    width?: string | number
    align?: "left" | "center" | "right"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any, row: T) => React.ReactNode
    type?: "text" | "number" | "currency" | "percentage" | "date" | "badge" | "actions"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableAction<T = any> {
    label: string
    icon?: React.ReactNode
    onClick: (row: T) => void
    variant?: "default" | "secondary" | "destructive"
    show?: (row: T) => boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FinancialTableProps<T = any> {
    data: T[]
    columns: TableColumn<T>[]
    title?: string
    subtitle?: string
    searchable?: boolean
    filterable?: boolean
    paginated?: boolean
    pageSize?: number
    actions?: TableAction<T>[]
    onRowClick?: (row: T) => void
    className?: string
    emptyMessage?: string
    loading?: boolean
}

// Utilidades de formateo
const formatCurrency = (value: number, currency: string = "EUR"): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value)
}

const formatPercentage = (value: number): string => {
    const formatted = value.toFixed(2)
    return `${value >= 0 ? '+' : ''}${formatted}%`
}

const formatDate = (value: string | Date): string => {
    const date = typeof value === 'string' ? new Date(value) : value
    return date.toLocaleDateString('es-ES')
}

// Componente para renderizar valores con color
const ColoredValue: React.FC<{ value: number; type: "currency" | "percentage" }> = ({ value, type }) => {
    const isPositive = value > 0
    const isNegative = value < 0

    const colorClass = isPositive
        ? "text-green-600"
        : isNegative
            ? "text-red-600"
            : "text-gray-600"

    const icon = isPositive
        ? <TrendingUp className="h-3 w-3" />
        : isNegative
            ? <TrendingDown className="h-3 w-3" />
            : <Minus className="h-3 w-3" />

    return (
        <div className={`flex items-center space-x-1 ${colorClass}`}>
            {icon}
            <span className="font-medium">
                {type === "currency" ? formatCurrency(value) : formatPercentage(value)}
            </span>
        </div>
    )
}

// Hook para ordenación
const useSorting = <T,>(data: T[], columns: TableColumn<T>[]) => {
    const [sortConfig, setSortConfig] = useState<{
        key: string | null
        direction: 'asc' | 'desc'
    }>({ key: null, direction: 'asc' })

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data

        const column = columns.find(col => col.key === sortConfig.key)
        if (!column) return data

        return [...data].sort((a, b) => {
            let aValue = typeof column.accessor === 'function'
                ? column.accessor(a)
                : a[column.accessor]
            let bValue = typeof column.accessor === 'function'
                ? column.accessor(b)
                : b[column.accessor]

            // Convertir a números si es posible
            if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
                aValue = Number(aValue)
                bValue = Number(bValue)
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1
            }
            return 0
        })
    }, [data, sortConfig, columns])

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    return { sortedData, sortConfig, handleSort }
}

// Hook para filtrado y búsqueda
const useFiltering = <T,>(data: T[], columns: TableColumn<T>[]) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<Record<string, string>>({})

    const filteredData = useMemo(() => {
        let result = data

        // Aplicar búsqueda global
        if (searchTerm) {
            result = result.filter(row => {
                return columns.some(column => {
                    if (!column.filterable) return false

                    const value = typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor]

                    return String(value).toLowerCase().includes(searchTerm.toLowerCase())
                })
            })
        }

        // Aplicar filtros específicos
        Object.entries(filters).forEach(([key, filterValue]) => {
            if (filterValue) {
                result = result.filter(row => {
                    const column = columns.find(col => col.key === key)
                    if (!column) return true

                    const value = typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : row[column.accessor]

                    return String(value).toLowerCase().includes(filterValue.toLowerCase())
                })
            }
        })

        return result
    }, [data, searchTerm, filters, columns])

    return { filteredData, searchTerm, setSearchTerm, filters, setFilters }
}

// Hook para paginación
const usePagination = <T,>(data: T[], pageSize: number = 10) => {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(data.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = data.slice(startIndex, startIndex + pageSize)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    }

    return {
        paginatedData,
        currentPage,
        totalPages,
        goToPage,
        totalItems: data.length
    }
}

// Componente principal de tabla
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FinancialTable<T extends Record<string, any>>({
    data,
    columns,
    title,
    subtitle,
    searchable = true,
    // filterable = false,
    paginated = true,
    pageSize = 10,
    actions,
    onRowClick,
    className,
    emptyMessage = "No hay datos disponibles",
    loading = false
}: FinancialTableProps<T>) {
    const { sortedData, sortConfig, handleSort } = useSorting(data, columns)
    const { filteredData, searchTerm, setSearchTerm } = useFiltering(sortedData, columns)
    const { paginatedData, currentPage, totalPages, goToPage, totalItems } = usePagination(
        filteredData,
        paginated ? pageSize : filteredData.length
    )

    const finalData = paginated ? paginatedData : filteredData

    // Renderizar celda según el tipo
    const renderCell = (column: TableColumn<T>, row: T) => {
        const value = typeof column.accessor === 'function'
            ? column.accessor(row)
            : row[column.accessor]

        if (column.render) {
            return column.render(value, row)
        }

        switch (column.type) {
            case "currency":
                return typeof value === 'number' ? (
                    <ColoredValue value={value} type="currency" />
                ) : value

            case "percentage":
                return typeof value === 'number' ? (
                    <ColoredValue value={value} type="percentage" />
                ) : value

            case "date":
                return formatDate(value)

            case "badge":
                return <Badge variant="secondary">{value}</Badge>

            case "actions":
                return (
                    <div className="flex items-center space-x-1">
                        {actions?.map((action, index) => {
                            if (action.show && !action.show(row)) return null
                            return (
                                <Button
                                    key={index}
                                    variant={action.variant || "ghost"}
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        action.onClick(row)
                                    }}
                                    className="h-8 w-8 p-0"
                                >
                                    {action.icon}
                                </Button>
                            )
                        })}
                    </div>
                )

            default:
                return value
        }
    }

    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Cargando datos...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={className}>
            {/* Header */}
            {(title || subtitle || searchable) && (
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            {title && <CardTitle>{title}</CardTitle>}
                            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                        </div>

                        {searchable && (
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 w-64"
                                    />
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {totalItems > 0 && (
                        <div className="text-sm text-gray-500">
                            Mostrando {finalData.length} de {totalItems} resultados
                        </div>
                    )}
                </CardHeader>
            )}

            <CardContent>
                {finalData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {emptyMessage}
                    </div>
                ) : (
                    <>
                        {/* Tabla */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        {columns.map((column) => (
                                            <th
                                                key={column.key}
                                                className={cn(
                                                    "px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider",
                                                    column.align === "center" && "text-center",
                                                    column.align === "right" && "text-right",
                                                    column.sortable && "cursor-pointer hover:text-gray-700"
                                                )}
                                                style={{ width: column.width }}
                                                onClick={() => column.sortable && handleSort(column.key)}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>{column.header}</span>
                                                    {column.sortable && (
                                                        <div className="flex flex-col">
                                                            {sortConfig.key === column.key ? (
                                                                sortConfig.direction === 'asc' ? (
                                                                    <ChevronUp className="h-3 w-3" />
                                                                ) : (
                                                                    <ChevronDown className="h-3 w-3" />
                                                                )
                                                            ) : (
                                                                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {finalData.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={cn(
                                                "hover:bg-gray-50 transition-colors",
                                                onRowClick && "cursor-pointer"
                                            )}
                                            onClick={() => onRowClick?.(row)}
                                        >
                                            {columns.map((column) => (
                                                <td
                                                    key={column.key}
                                                    className={cn(
                                                        "px-4 py-3 whitespace-nowrap text-sm",
                                                        column.align === "center" && "text-center",
                                                        column.align === "right" && "text-right"
                                                    )}
                                                >
                                                    {renderCell(column, row)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {paginated && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-600">
                                    Página {currentPage} de {totalPages}
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Números de página */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(page)}
                                                className="w-8"
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

// Tabla simple sin wrapper Card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SimpleTable<T extends Record<string, any>>({
    data,
    columns,
    className,
    onRowClick
}: {
    data: T[]
    columns: TableColumn<T>[]
    className?: string
    onRowClick?: (row: T) => void
}) {
    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    "px-4 py-3 text-left text-sm font-medium text-gray-500",
                                    column.align === "center" && "text-center",
                                    column.align === "right" && "text-right"
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={cn(
                                "border-b hover:bg-gray-50",
                                onRowClick && "cursor-pointer"
                            )}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    className={cn(
                                        "px-4 py-3 text-sm",
                                        column.align === "center" && "text-center",
                                        column.align === "right" && "text-right"
                                    )}
                                >
                                    {typeof column.accessor === 'function'
                                        ? column.accessor(row)
                                        : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// Export de tipos y utilidades
export {
    formatCurrency,
    formatPercentage,
    formatDate,
    ColoredValue
}

export default FinancialTable