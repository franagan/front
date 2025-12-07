'use client'

import * as React from "react"
import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CalendarDays,
    Clock,
    DollarSign,
    TrendingUp,
    Building2,
    X
} from "lucide-react"

// Tipos para el calendario
export interface CalendarDate {
    year: number
    month: number
    day: number
}

export interface DateRange {
    start: Date | null
    end: Date | null
}

export interface FinancialEvent {
    id: string
    date: Date
    title: string
    type: "dividend" | "earnings" | "ex-date" | "meeting" | "holiday"
    symbol?: string
    amount?: number
    description?: string
    color?: string
}

export interface CalendarProps {
    selected?: Date | Date[]
    onSelect?: (date: Date | Date[] | null) => void
    mode?: "single" | "multiple" | "range"
    disabled?: (date: Date) => boolean
    events?: FinancialEvent[]
    showEvents?: boolean
    showWeekNumbers?: boolean
    locale?: string
    className?: string
}

// Utilidades de fecha
const formatDate = (date: Date, locale: string = 'es-ES'): string => {
    return date.toLocaleDateString(locale)
}

const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    })
}

const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString()
}

const isSameMonth = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() && 
           date1.getMonth() === date2.getMonth()
}

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay()
}

const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date)
    newDate.setMonth(newDate.getMonth() + months)
    return newDate
}

// Rangos predefinidos comunes en finanzas
export const getFinancialRanges = (): Array<{label: string, value: DateRange}> => {
    const today = new Date()
    const ranges = [
        {
            label: "Última semana",
            value: {
                start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
                end: today
            }
        },
        {
            label: "Último mes",
            value: {
                start: new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()),
                end: today
            }
        },
        {
            label: "Últimos 3 meses",
            value: {
                start: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()),
                end: today
            }
        },
        {
            label: "Últimos 6 meses",
            value: {
                start: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()),
                end: today
            }
        },
        {
            label: "Último año",
            value: {
                start: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()),
                end: today
            }
        },
        {
            label: "Año actual",
            value: {
                start: new Date(today.getFullYear(), 0, 1),
                end: today
            }
        }
    ]
    return ranges
}

// Componente Calendar principal
export function Calendar({
    selected,
    onSelect,
    mode = "single",
    disabled,
    events = [],
    showEvents = false,
    showWeekNumbers = false,
    className
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // Generar días del calendario
    const calendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)
        const days: Array<{
            date: Date
            isCurrentMonth: boolean
            events: FinancialEvent[]
        }> = []
        
        // Días del mes anterior
        const prevMonth = month === 0 ? 11 : month - 1
        const prevYear = month === 0 ? year - 1 : year
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
        
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = new Date(prevYear, prevMonth, daysInPrevMonth - i)
            days.push({
                date,
                isCurrentMonth: false,
                events: events.filter(e => isSameDay(e.date, date))
            })
        }
        
        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            days.push({
                date,
                isCurrentMonth: true,
                events: events.filter(e => isSameDay(e.date, date))
            })
        }
        
        // Días del siguiente mes
        const remainingDays = 42 - days.length
        const nextMonth = month === 11 ? 0 : month + 1
        const nextYear = month === 11 ? year + 1 : year
        
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(nextYear, nextMonth, day)
            days.push({
                date,
                isCurrentMonth: false,
                events: events.filter(e => isSameDay(e.date, date))
            })
        }
        
        return days
    }, [year, month, events])
    
    const isDateSelected = (date: Date): boolean => {
        if (!selected) return false
        
        if (mode === "single") {
            return selected instanceof Date && isSameDay(date, selected)
        }
        
        if (mode === "multiple" && Array.isArray(selected)) {
            return selected.some(d => isSameDay(date, d))
        }
        
        if (mode === "range" && Array.isArray(selected) && selected.length === 2) {
            const [start, end] = selected
            return date >= start && date <= end
        }
        
        return false
    }
    
    const isDateDisabled = (date: Date): boolean => {
        return disabled ? disabled(date) : false
    }
    
    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return
        
        if (mode === "single") {
            onSelect?.(date)
        } else if (mode === "multiple") {
            const currentSelected = Array.isArray(selected) ? selected : []
            const isAlreadySelected = currentSelected.some(d => isSameDay(date, d))
            
            if (isAlreadySelected) {
                onSelect?.(currentSelected.filter(d => !isSameDay(date, d)))
            } else {
                onSelect?.([...currentSelected, date])
            }
        } else if (mode === "range") {
            const currentSelected = Array.isArray(selected) ? selected : []
            
            if (currentSelected.length === 0 || currentSelected.length === 2) {
                onSelect?.([date])
            } else if (currentSelected.length === 1) {
                const [start] = currentSelected
                if (date < start) {
                    onSelect?.([date, start])
                } else {
                    onSelect?.([start, date])
                }
            }
        }
    }
    
    const handlePrevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1))
    }
    
    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }
    
    return (
        <div className={cn("calendar", className)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <h3 className="text-lg font-semibold">
                    {monthNames[month]} {year}
                </h3>
                
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            
            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {showWeekNumbers && <div className="text-xs text-gray-500 text-center p-2">#</div>}
                {dayNames.map((day) => (
                    <div key={day} className="text-xs font-medium text-gray-500 text-center p-2">
                        {day}
                    </div>
                ))}
            </div>
            
            {/* Días del calendario */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayData, index) => {
                    const { date, isCurrentMonth, events: dayEvents } = dayData
                    const isSelected = isDateSelected(date)
                    const disabled = isDateDisabled(date)
                    const today = isToday(date)
                    const hasEvents = showEvents && dayEvents.length > 0
                    
                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative p-2 text-sm text-center cursor-pointer transition-colors",
                                "hover:bg-gray-100 rounded-md",
                                !isCurrentMonth && "text-gray-400",
                                isSelected && "bg-blue-600 text-white hover:bg-blue-700",
                                today && !isSelected && "bg-blue-100 text-blue-700 font-semibold",
                                disabled && "opacity-50 cursor-not-allowed",
                                hasEvents && "font-medium"
                            )}
                            onClick={() => handleDateClick(date)}
                        >
                            <span>{date.getDate()}</span>
                            
                            {/* Indicadores de eventos */}
                            {hasEvents && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                                        <div
                                            key={eventIndex}
                                            className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                event.type === "dividend" && "bg-green-500",
                                                event.type === "earnings" && "bg-blue-500",
                                                event.type === "ex-date" && "bg-yellow-500",
                                                event.type === "meeting" && "bg-purple-500",
                                                event.type === "holiday" && "bg-red-500"
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
            
            {/* Eventos del día seleccionado */}
            {showEvents && selected && mode === "single" && (
                <div className="mt-4 space-y-2">
                    {events
                        .filter(e => selected instanceof Date && isSameDay(e.date, selected))
                        .map((event) => (
                            <div key={event.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-sm">
                                {event.type === "dividend" && <DollarSign className="h-3 w-3 text-green-600" />}
                                {event.type === "earnings" && <TrendingUp className="h-3 w-3 text-blue-600" />}
                                {event.type === "ex-date" && <CalendarDays className="h-3 w-3 text-yellow-600" />}
                                {event.type === "meeting" && <Building2 className="h-3 w-3 text-purple-600" />}
                                
                                <div className="flex-1">
                                    <div className="font-medium">{event.title}</div>
                                    {event.description && (
                                        <div className="text-gray-600 text-xs">{event.description}</div>
                                    )}
                                </div>
                                
                                {event.amount && (
                                    <Badge variant="secondary">
                                        €{event.amount.toFixed(2)}
                                    </Badge>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}

// DatePicker con input
export function DatePicker({
    selected,
    onSelect,
    placeholder = "Seleccionar fecha...",
    disabled,
    className
}: {
    selected?: Date
    onSelect?: (date: Date | null) => void
    placeholder?: string
    disabled?: boolean
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <div className={cn("relative", className)}>
            <div className="flex">
                <Input
                    value={selected ? formatDateShort(selected) : ""}
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                    className="cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <CalendarIcon className="h-4 w-4" />
                </Button>
            </div>
            
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <Calendar
                        selected={selected}
                        onSelect={(date) => {
                            onSelect?.(date as Date)
                            setIsOpen(false)
                        }}
                        mode="single"
                    />
                </div>
            )}
        </div>
    )
}

// DateRangePicker
export function DateRangePicker({
    selected,
    onSelect,
    showPresets = true,
    placeholder = "Seleccionar rango...",
    disabled,
    className
}: {
    selected?: DateRange
    onSelect?: (range: DateRange) => void
    showPresets?: boolean
    placeholder?: string
    disabled?: boolean
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const presets = getFinancialRanges()
    
    const formatRange = (range: DateRange): string => {
        if (!range.start || !range.end) return ""
        return `${formatDateShort(range.start)} - ${formatDateShort(range.end)}`
    }
    
    return (
        <div className={cn("relative", className)}>
            <div className="flex">
                <Input
                    value={selected ? formatRange(selected) : ""}
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                    className="cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={disabled}
                >
                    <CalendarDays className="h-4 w-4" />
                </Button>
                {selected?.start && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-1"
                        onClick={() => onSelect?.({ start: null, end: null })}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex">
                        {/* Presets */}
                        {showPresets && (
                            <div className="w-48 p-4 border-r border-gray-200">
                                <h4 className="font-medium mb-3">Rangos rápidos</h4>
                                <div className="space-y-1">
                                    {presets.map((preset, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-sm"
                                            onClick={() => {
                                                onSelect?.(preset.value)
                                                setIsOpen(false)
                                            }}
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Calendar */}
                        <div className="p-4">
                            <Calendar
                                selected={selected?.start && selected?.end ? [selected.start, selected.end] : undefined}
                                onSelect={(dates) => {
                                    if (Array.isArray(dates) && dates.length === 2) {
                                        onSelect?.({ start: dates[0], end: dates[1] })
                                        setIsOpen(false)
                                    }
                                }}
                                mode="range"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// FinancialCalendar con eventos
export function FinancialCalendar({
    events,
    onEventClick,
    onDateSelect,
    className
}: {
    events: FinancialEvent[]
    onEventClick?: (event: FinancialEvent) => void
    onDateSelect?: (date: Date) => void
    className?: string
}) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Calendario Financiero
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Calendar
                    selected={selectedDate || undefined}
                    onSelect={(date) => {
                        setSelectedDate(date as Date)
                        onDateSelect?.(date as Date)
                    }}
                    mode="single"
                    events={events}
                    showEvents={true}
                />
                
                {/* Leyenda de eventos */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Dividendos</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Resultados</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>Ex-dividendo</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Reuniones</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Export de utilidades
export {
    formatDate,
    formatDateShort,
    isToday,
    isSameDay,
    isSameMonth,
    addMonths
}