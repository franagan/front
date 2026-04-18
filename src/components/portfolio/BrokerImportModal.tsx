'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'

interface BrokerImportModalProps {
    isOpen: boolean
    onClose: () => void
    portfolioId?: string
    onSuccess?: () => void
}

export default function BrokerImportModal({ isOpen, onClose, portfolioId, onSuccess }: BrokerImportModalProps) {
    const { user } = useAuthStore()
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [importedCount, setImportedCount] = useState(0)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleImport = async () => {
        if (!file || !portfolioId) return

        try {
            setLoading(true)
            setError(null)

            const formData = new FormData()
            formData.append('file', file)
            if (user?.id) {
                formData.append('userId', user.id)
            }

            const response = await axios.post(
                `http://localhost:8080/api/portfolio/${portfolioId}/import`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            setImportedCount(response.data.length)
            setSuccess(true)
            if (onSuccess) onSuccess()
            
        } catch (err: any) {
            console.error('Error importing broker data:', err)
            setError(err.response?.data?.message || 'Error al procesar el archivo. Asegúrate de que el formato coincida con el broker seleccionado.')
        } finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setFile(null)
        setError(null)
        setSuccess(false)
        setLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); reset(); } }}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border rounded-[2rem] overflow-hidden p-0 gap-0">
                <DialogHeader className="p-8 pb-4 bg-muted/30">
                    <DialogTitle className="text-2xl font-black italic tracking-tight">
                        IMPORTAR <span className="text-orange-500">OPERACIONES</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs font-black uppercase tracking-widest opacity-70">
                        Sincronización masiva desde tu broker
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 pt-6 space-y-6">
                    {success ? (
                        <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black">¡Importación Exitosa!</h3>
                            <p className="text-muted-foreground text-sm">
                                Se han procesado e importado <span className="text-foreground font-bold">{importedCount}</span> transacciones correctamente.
                            </p>
                            <Button onClick={() => { onClose(); reset(); }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl">
                                ENTENDIDO
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex gap-4">
                                <Info className="h-5 w-5 text-orange-500 shrink-0 mt-1" />
                                <div className="text-xs leading-relaxed">
                                    <p className="font-black uppercase mb-1">Brokers Soportados</p>
                                    <p className="text-muted-foreground">Sistema de detección automática para <span className="text-foreground font-bold italic">DEGIRO</span> y <span className="text-foreground font-bold italic">Interactive Brokers</span>. Sube tu archivo CSV exportado directamente del broker.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Archivo CSV de transacciones</Label>
                                    <div 
                                        className={cn(
                                            "border-2 border-dashed border-border rounded-2xl p-8 text-center transition-all cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5",
                                            file ? "border-emerald-500/50 bg-emerald-500/5" : ""
                                        )}
                                        onClick={() => document.getElementById('broker-csv')?.click()}
                                    >
                                        <input 
                                            id="broker-csv" 
                                            type="file" 
                                            accept=".csv" 
                                            className="hidden" 
                                            onChange={handleFileChange} 
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            {file ? (
                                                <>
                                                    <FileText className="h-10 w-10 text-emerald-500" />
                                                    <p className="text-sm font-bold truncate max-w-[250px]">{file.name}</p>
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground">Pulse para cambiar archivo</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-10 w-10 text-muted-foreground/50" />
                                                    <p className="text-sm font-bold text-muted-foreground">Selecciona el archivo CSV</p>
                                                    <p className="text-[10px] uppercase font-black text-muted-foreground opacity-50">Arrastra o pulsa aquí</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs flex gap-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <Button 
                                onClick={handleImport} 
                                disabled={!file || loading}
                                className="w-full bg-orange-500 h-14 hover:bg-orange-600 text-white font-black rounded-xl shadow-xl shadow-orange-500/20"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        PROCESANDO ARCHIVO...
                                    </>
                                ) : (
                                    "INICIAR IMPORTACIÓN"
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
