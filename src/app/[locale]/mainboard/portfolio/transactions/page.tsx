'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
    ArrowLeft, 
    History, 
    Download, 
    TrendingUp, 
    TrendingDown, 
    CircleDollarSign,
    Loader2,
    Calendar,
    ArrowRightLeft
} from "lucide-react"
import transactionService, { Transaction } from "@/services/transaction.service"
import { useTranslations } from 'next-intl'
import { useAuthStore } from '@/stores/useAuthStore'

export default function TransactionsPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const tCommon = useTranslations('common')
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }

        const fetchTransactions = async () => {
            try {
                setLoading(true)
                const response = await transactionService.getTransactions(0, 50)
                // In Spring Page response, data is usually in content field
                setTransactions(response.data.content || [])
            } catch (err) {
                console.error('Error fetching transactions:', err)
                setError('No se pudo cargar el historial de transacciones')
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [user, router])

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'BUY': return <TrendingUp className="h-4 w-4 text-green-400" />
            case 'SELL': return <TrendingDown className="h-4 w-4 text-red-400" />
            case 'DIVIDEND': return <CircleDollarSign className="h-4 w-4 text-yellow-400" />
            default: return <ArrowRightLeft className="h-4 w-4 text-blue-400" />
        }
    }

    const getTransactionTypeLabel = (type: string) => {
        switch (type) {
            case 'BUY': return 'Compra'
            case 'SELL': return 'Venta'
            case 'DIVIDEND': return 'Dividendo'
            case 'STOCK_SPLIT': return 'Split'
            case 'TRANSFER_IN': return 'Transferencia In'
            case 'TRANSFER_OUT': return 'Transferencia Out'
            case 'ADJUSTMENT': return 'Ajuste'
            default: return type
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-background/50 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/mainboard/portfolio')}
                                className="border-border"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al Portfolio
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    <History className="h-6 w-6 text-yellow-500" />
                                    Historial de Transacciones
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Registro completo de tus movimientos para FIFO y declaración de la renta
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar para Renta
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Movimientos Recientes</span>
                            <Badge variant="outline" className="font-normal">
                                {transactions.length} registros
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error ? (
                            <div className="text-center py-12 text-red-400">{error}</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>No se han encontrado transacciones registradas.</p>
                                <p className="text-sm">Tus compras de acciones aparecerán aquí automáticamente.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase border-b border-border">
                                        <tr>
                                            <th className="px-4 py-4">Fecha</th>
                                            <th className="px-4 py-4">Especie</th>
                                            <th className="px-4 py-4">Tipo</th>
                                            <th className="px-4 py-4 text-right">Cantidad</th>
                                            <th className="px-4 py-4 text-right">Precio</th>
                                            <th className="px-4 py-4 text-right">Monto Neto</th>
                                            <th className="px-4 py-4 text-right">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-accent/30 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        {new Date(tx.executedAt).toLocaleDateString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="font-medium">{tx.stockSymbol}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                        {tx.stockName}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getTransactionIcon(tx.type)}
                                                        {getTransactionTypeLabel(tx.type)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right font-mono">
                                                    {tx.quantity}
                                                </td>
                                                <td className="px-4 py-4 text-right font-mono">
                                                    €{tx.unitPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-4 text-right font-bold">
                                                    €{tx.netAmount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={
                                                            tx.status === 'EXECUTED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            tx.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }
                                                    >
                                                        {tx.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
