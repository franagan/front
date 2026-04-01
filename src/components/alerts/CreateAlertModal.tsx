'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    TrendingUp,
    TrendingDown,
    Target,
    Loader2,
    Search,
    CheckCircle
} from 'lucide-react'
import alertService from '@/services/alert.service'
import stockService from '@/services/stock.service'
import {
    AlertType,
    CreateAlertRequest,
    getAlertTypeLabel,
    getAlertTypeDescription
} from '@/types/alert.types'
import { FinnhubSearchResult } from '@/types/stock.types'

interface CreateAlertModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editAlert?: {
        id: string
        symbol: string
        alertType: AlertType
        targetPrice: number
        notes?: string
    }
}

export default function CreateAlertModal({
    isOpen,
    onClose,
    onSuccess,
    editAlert
}: CreateAlertModalProps) {
    const { user } = useAuthStore()

    // Form state
    const [symbol, setSymbol] = useState(editAlert?.symbol || '')
    const [symbolName, setSymbolName] = useState('')
    const [alertType, setAlertType] = useState<AlertType>(editAlert?.alertType || 'PRICE_TARGET')
    const [targetPrice, setTargetPrice] = useState(editAlert?.targetPrice?.toString() || '')
    const [notes, setNotes] = useState(editAlert?.notes || '')
    const [recurring, setRecurring] = useState(false)
    const [emailNotification, setEmailNotification] = useState(true)
    const [pushNotification, setPushNotification] = useState(true)

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [currentPrice, setCurrentPrice] = useState<number | null>(null)

    // Stock search state
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<FinnhubSearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const [selectedStock, setSelectedStock] = useState<FinnhubSearchResult | null>(null)

    // Load current price when symbol changes
    useEffect(() => {
        if (selectedStock) {
            loadCurrentPrice(selectedStock.symbol)
        }
    }, [selectedStock])

    // Load initial data for edit mode
    useEffect(() => {
        if (editAlert) {
            setSymbol(editAlert.symbol)
            setAlertType(editAlert.alertType)
            setTargetPrice(editAlert.targetPrice.toString())
            setNotes(editAlert.notes || '')
        }
    }, [editAlert])

    const loadCurrentPrice = async (stockSymbol: string) => {
        try {
            const response = await stockService.getQuote(stockSymbol)
            if (response.success && response.data) {
                setCurrentPrice(response.data.currentPrice)
            }
        } catch (err) {
            console.error('Error loading current price:', err)
        }
    }

    // Search stocks
    const handleSearch = async (query: string) => {
        setSearchQuery(query)

        if (query.length < 2) {
            setSearchResults([])
            return
        }

        setSearching(true)
        try {
            const response = await stockService.searchSymbols(query)
            if (response.success && response.data) {
                setSearchResults(response.data.slice(0, 10))
            }
        } catch (err) {
            console.error('Error searching stocks:', err)
        } finally {
            setSearching(false)
        }
    }

    // Select stock
    const handleSelectStock = (stock: FinnhubSearchResult) => {
        setSelectedStock(stock)
        setSymbol(stock.symbol)
        setSymbolName(stock.description)
        setSearchResults([])
        setSearchQuery('')
    }

    // Validate form
    const validateForm = (): boolean => {
        if (!symbol) {
            setError('Debes seleccionar un activo')
            return false
        }

        if (!targetPrice || parseFloat(targetPrice) <= 0) {
            setError('El precio objetivo debe ser mayor que 0')
            return false
        }

        // Validar logica de precios
        const price = parseFloat(targetPrice)
        if (currentPrice) {
            if (alertType === 'STOP_LOSS' && price >= currentPrice) {
                setError(`Para Stop Loss, el precio debe ser menor al precio actual ($${currentPrice.toFixed(2)})`)
                return false
            }
            if (alertType === 'TAKE_PROFIT' && price <= currentPrice) {
                setError(`Para Take Profit, el precio debe ser mayor al precio actual ($${currentPrice.toFixed(2)})`)
                return false
            }
        }

        return true
    }

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            setError('Debes iniciar sesion')
            return
        }

        if (!validateForm()) return

        setLoading(true)
        setError(null)

        try {
            const request: CreateAlertRequest = {
                symbol: symbol.toUpperCase(),
                symbolName,
                alertType,
                targetPrice: parseFloat(targetPrice),
                notes: notes || undefined,
                recurring,
                emailNotification,
                pushNotification
            }

            const response = await alertService.createAlert(request)

            if (response.success) {
                setSuccess(true)
                setTimeout(() => {
                    onSuccess()
                    onClose()
                    resetForm()
                }, 1500)
            } else {
                setError(response.message || 'Error al crear la alerta')
            }

        } catch (err) {
            console.error('Error creating alert:', err)
            const errorPayload = err as { response?: { data?: { message?: string } } }
            setError(errorPayload.response?.data?.message || 'Error al crear la alerta')
        } finally {
            setLoading(false)
        }
    }

    // Reset form
    const resetForm = () => {
        setSymbol('')
        setSymbolName('')
        setAlertType('PRICE_TARGET')
        setTargetPrice('')
        setNotes('')
        setRecurring(false)
        setEmailNotification(true)
        setPushNotification(true)
        setCurrentPrice(null)
        setSelectedStock(null)
        setSearchQuery('')
        setSearchResults([])
        setError(null)
        setSuccess(false)
    }

    // Get alert type icon
    const getAlertTypeIcon = (type: AlertType) => {
        switch (type) {
            case 'STOP_LOSS':
                return <TrendingDown className="h-5 w-5" />
            case 'TAKE_PROFIT':
                return <TrendingUp className="h-5 w-5" />
            case 'PRICE_TARGET':
                return <Target className="h-5 w-5" />
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                resetForm()
                onClose()
            }}
            title={editAlert ? 'Editar Alerta' : 'Nueva Alerta de Precio'}
            description="Recibe notificaciones cuando el precio alcance tu objetivo"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success message */}
                {success && (
                    <div className="flex items-center gap-2 p-4 bg-green-400/10 border border-green-400/30 rounded-lg text-green-400">
                        <CheckCircle className="h-5 w-5" />
                        <span>Alerta creada exitosamente</span>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-400/10 border border-red-400/30 rounded-lg text-red-400">
                        <span>{error}</span>
                    </div>
                )}

                {/* Stock Search */}
                <div className="space-y-2">
                    <Label htmlFor="symbol">Activo</Label>
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="symbol"
                                placeholder="Buscar activo (ej: AAPL, MSFT, GOOGL)"
                                value={selectedStock ? `${selectedStock.symbol} - ${selectedStock.description}` : searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                                disabled={!!editAlert}
                            />
                        </div>

                        {/* Search results dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                {searchResults.map((stock) => (
                                    <button
                                        key={stock.symbol}
                                        type="button"
                                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors"
                                        onClick={() => handleSelectStock(stock)}
                                    >
                                        <div className="font-semibold">{stock.symbol}</div>
                                        <div className="text-sm text-muted-foreground">{stock.description}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {searching && (
                            <div className="absolute top-full left-0 right-0 mt-1 p-4 bg-card border border-border rounded-lg shadow-lg z-10">
                                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Current Price Display */}
                    {currentPrice && (
                        <p className="text-sm text-muted-foreground">
                            Precio actual: <span className="font-semibold text-yellow-400">${currentPrice.toFixed(2)}</span>
                        </p>
                    )}
                </div>

                {/* Alert Type */}
                <div className="space-y-2">
                    <Label htmlFor="alertType">Tipo de Alerta</Label>
                    <Select
                        value={alertType}
                        onValueChange={(value) => setAlertType(value as AlertType)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="STOP_LOSS">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="h-4 w-4 text-red-400" />
                                    <div>
                                        <div className="font-medium">Stop Loss</div>
                                        <div className="text-xs text-muted-foreground">Alerta cuando el precio cae</div>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="TAKE_PROFIT">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-400" />
                                    <div>
                                        <div className="font-medium">Take Profit</div>
                                        <div className="text-xs text-muted-foreground">Alerta cuando el precio sube</div>
                                    </div>
                                </div>
                            </SelectItem>
                            <SelectItem value="PRICE_TARGET">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-yellow-400" />
                                    <div>
                                        <div className="font-medium">Objetivo de Precio</div>
                                        <div className="text-xs text-muted-foreground">Alerta al alcanzar un precio</div>
                                    </div>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">{getAlertTypeDescription(alertType)}</p>
                </div>

                {/* Target Price */}
                <div className="space-y-2">
                    <Label htmlFor="targetPrice">Precio Objetivo (USD)</Label>
                    <Input
                        id="targetPrice"
                        type="number"
                        step="0.0001"
                        placeholder="0.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="text-lg font-semibold"
                    />
                    {currentPrice && targetPrice && (
                        <div className="text-sm">
                            {(() => {
                                const target = parseFloat(targetPrice)
                                const diff = target - currentPrice
                                const pct = ((diff / currentPrice) * 100).toFixed(2)
                                const isUp = diff > 0
                                return (
                                    <span className={isUp ? 'text-green-400' : 'text-red-400'}>
                                        {isUp ? '+' : ''}{pct}% desde el precio actual
                                        {isUp ? ' (subida)' : ' (bajada)'}
                                    </span>
                                )
                            })()}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notas (opcional)</Label>
                    <Input
                        id="notes"
                        placeholder="Notas personales sobre esta alerta"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={500}
                    />
                </div>

                {/* Options */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="recurring">Alerta recurrente</Label>
                            <p className="text-xs text-muted-foreground">Reactivar despues de dispararse</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setRecurring(!recurring)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                recurring ? 'bg-yellow-600' : 'bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    recurring ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="email">Notificacion por email</Label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setEmailNotification(!emailNotification)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                emailNotification ? 'bg-yellow-600' : 'bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    emailNotification ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="push">Notificacion push</Label>
                        </div>
                        <button
                            type="button"
                            onClick={() => setPushNotification(!pushNotification)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                pushNotification ? 'bg-yellow-600' : 'bg-gray-600'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    pushNotification ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            resetForm()
                            onClose()
                        }}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                        disabled={loading || !symbol || !targetPrice}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creando...
                            </>
                        ) : (
                            <>
                                {getAlertTypeIcon(alertType)}
                                <span className="ml-2">{editAlert ? 'Guardar' : 'Crear Alerta'}</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}