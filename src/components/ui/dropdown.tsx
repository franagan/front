'use client'

import * as React from "react"
import { ChevronDown, Check, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface DropdownOption {
    value: string
    label: string
    icon?: React.ReactNode
    disabled?: boolean
    description?: string
}

interface DropdownProps {
    options: DropdownOption[]
    value?: string | string[]
    onValueChange: (value: string | string[]) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    multiple?: boolean
    searchable?: boolean
    clearable?: boolean
    size?: "sm" | "md" | "lg"
    error?: string
}

const Dropdown = ({
    options,
    value,
    onValueChange,
    placeholder = "Seleccionar...",
    className,
    disabled = false,
    multiple = false,
    searchable = false,
    clearable = false,
    size = "md",
    error
}: DropdownProps) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    // Filtrar opciones según búsqueda
    const filteredOptions = React.useMemo(() => {
        if (!searchable || !searchTerm) return options
        return options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm, searchable])

    // Obtener opciones seleccionadas
    const selectedOptions = React.useMemo(() => {
        if (!value) return []
        const values = Array.isArray(value) ? value : [value]
        return options.filter(option => values.includes(option.value))
    }, [value, options])

    // Cerrar dropdown al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm("")
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Focus en búsqueda cuando se abre
    React.useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isOpen, searchable])

    // Manejar selección
    const handleSelect = (selectedOption: DropdownOption) => {
        if (selectedOption.disabled) return

        if (multiple) {
            const currentValues = Array.isArray(value) ? value : []
            const newValues = currentValues.includes(selectedOption.value)
                ? currentValues.filter(v => v !== selectedOption.value)
                : [...currentValues, selectedOption.value]
            onValueChange(newValues)
        } else {
            onValueChange(selectedOption.value)
            setIsOpen(false)
            setSearchTerm("")
        }
    }

    // Limpiar selección
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        onValueChange(multiple ? [] : "")
    }

    // Remover elemento específico (solo múltiple)
    const removeItem = (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (multiple && Array.isArray(value)) {
            const newValues = value.filter(v => v !== valueToRemove)
            onValueChange(newValues)
        }
    }

    // Tamaños
    const sizeClasses = {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-12 text-base"
    }

    // Texto a mostrar
    const displayText = React.useMemo(() => {
        if (!selectedOptions.length) return placeholder

        if (multiple) {
            return `${selectedOptions.length} seleccionado${selectedOptions.length !== 1 ? 's' : ''}`
        }

        return selectedOptions[0]?.label || placeholder
    }, [selectedOptions, placeholder, multiple])

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>

            {/* Trigger button */}
            <Button
                variant="outline"
                className={cn(
                    "w-full justify-between font-normal",
                    sizeClasses[size],
                    error && "border-red-500 focus-visible:ring-red-500",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">

                    {/* Mostrar chips en múltiple */}
                    {multiple && selectedOptions.length > 0 ? (
                        <div className="flex items-center gap-1 flex-wrap">
                            {selectedOptions.slice(0, 2).map(option => (
                                <span
                                    key={option.value}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs rounded-md"
                                >
                                    {option.icon && <span className="h-3 w-3">{option.icon}</span>}
                                    <span className="truncate max-w-20">{option.label}</span>
                                    <X
                                        className="h-3 w-3 hover:bg-gray-200 rounded cursor-pointer"
                                        onClick={(e) => removeItem(option.value, e)}
                                    />
                                </span>
                            ))}
                            {selectedOptions.length > 2 && (
                                <span className="text-xs text-gray-500">
                                    +{selectedOptions.length - 2} más
                                </span>
                            )}
                        </div>
                    ) : (
                        /* Texto normal */
                        <span className={cn(
                            "truncate",
                            !selectedOptions.length && "text-muted-foreground"
                        )}>
                            {!multiple && selectedOptions[0]?.icon && (
                                <span className="inline-flex h-4 w-4 mr-2">
                                    {selectedOptions[0].icon}
                                </span>
                            )}
                            {displayText}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    {clearable && selectedOptions.length > 0 && (
                        <X
                            className="h-4 w-4 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                    )} />
                </div>
            </Button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-hidden">

                    {/* Búsqueda */}
                    {searchable && (
                        <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    ref={searchInputRef}
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 h-8"
                                />
                            </div>
                        </div>
                    )}

                    {/* Lista de opciones */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredOptions.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 text-sm">
                                {searchTerm ? "No se encontraron resultados" : "No hay opciones disponibles"}
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = multiple
                                    ? Array.isArray(value) && value.includes(option.value)
                                    : value === option.value

                                return (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors",
                                            option.disabled && "opacity-50 cursor-not-allowed hover:bg-white",
                                            isSelected && "bg-blue-50 text-blue-700"
                                        )}
                                        onClick={() => handleSelect(option)}
                                    >

                                        {/* Checkbox para múltiple */}
                                        {multiple && (
                                            <div className={cn(
                                                "h-4 w-4 border border-gray-300 rounded flex items-center justify-center",
                                                isSelected && "bg-blue-600 border-blue-600"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 text-white" />}
                                            </div>
                                        )}

                                        {/* Icono */}
                                        {option.icon && (
                                            <span className="h-4 w-4 flex-shrink-0">
                                                {option.icon}
                                            </span>
                                        )}

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="truncate font-medium">
                                                    {option.label}
                                                </span>
                                                {!multiple && isSelected && (
                                                    <Check className="h-4 w-4 text-blue-600" />
                                                )}
                                            </div>
                                            {option.description && (
                                                <p className="text-xs text-gray-500 truncate">
                                                    {option.description}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

export { Dropdown }