'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { 
    Plus, TrendingUp, TrendingDown, Wallet, CreditCard, Landmark, 
    History, PieChart as PieChartIcon,
    ChevronRight, ChevronDown, Loader2, Building2, Coins, Home, PiggyBank, Trash2, Edit2
} from 'lucide-react'
import { cn } from "@/lib/utils"
import netWorthService, { NetWorthSummary, NetWorthCategory } from '@/services/networth.service'
import { useAuthStore } from '../../../../stores/useAuthStore'
import { useRouter } from '@/i18n/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"

export default function NetWorthPage() {
    const { user } = useAuthStore()
    const router = useRouter()
    
    const [summary, setSummary] = useState<NetWorthSummary | null>(null)
    const [categories, setCategories] = useState<NetWorthCategory[]>([])
    const [loading, setLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false)
    const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false)
    
    // UI state - Default collapsed (false) as requested
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})

    // Entry Form state
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [submitting, setSubmitting] = useState(false)

    // New/Edit Account state
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [newAccountName, setNewAccountName] = useState('')
    const [newAccountGroup, setNewAccountGroup] = useState('')
    const [newAccountType, setNewAccountType] = useState<'ASSET' | 'LIABILITY'>('ASSET')

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
            return
        }
        fetchData()
    }, [user])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [sumRes, catRes] = await Promise.all([
                netWorthService.getSummary(),
                netWorthService.getCategories()
            ])
            if (sumRes.success) setSummary(sumRes.data)
            if (catRes.success) {
                setCategories(catRes.data)
                // Initialize expanded groups record if empty, but set to false
                if (Object.keys(expandedGroups).length === 0) {
                    const initial: Record<string, boolean> = {}
                    catRes.data.forEach(cat => {
                        const group = cat.groupName && cat.groupName.trim() !== "" ? cat.groupName.trim() : cat.name
                        initial[group] = false 
                    })
                    setExpandedGroups(initial)
                }
            }
        } catch (error) {
            console.error("Error fetching net worth data", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveEntry = async () => {
        if (!selectedCategoryId || !amount) return
        setSubmitting(true)
        try {
            const res = await netWorthService.saveEntry(
                selectedCategoryId, 
                entryDate, 
                parseFloat(amount)
            )
            if (res.success) {
                setIsAddModalOpen(false)
                setAmount('')
                fetchData()
            }
        } catch (error) {
            console.error("Error saving entry", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleCreateOrUpdateAccount = async () => {
        if (!newAccountName) return
        setSubmitting(true)
        try {
            if (editingCategoryId) {
                const res = await netWorthService.updateCategory(editingCategoryId, {
                    name: newAccountName,
                    groupName: newAccountGroup.trim(),
                    type: newAccountType,
                    color: newAccountType === 'ASSET' ? '#10b981' : '#ef4444',
                    icon: getIconNameForGroup(newAccountGroup || newAccountName)
                })
                if (res.success) {
                    setIsEditAccountModalOpen(false)
                    setEditingCategoryId(null)
                    setNewAccountName('')
                    setNewAccountGroup('')
                    fetchData()
                }
            } else {
                const res = await netWorthService.createCategory({
                    name: newAccountName,
                    groupName: newAccountGroup.trim(),
                    type: newAccountType,
                    color: newAccountType === 'ASSET' ? '#10b981' : '#ef4444',
                    icon: getIconNameForGroup(newAccountGroup || newAccountName)
                })
                if (res.success) {
                    setIsNewAccountModalOpen(false)
                    setNewAccountName('')
                    setNewAccountGroup('')
                    fetchData()
                }
            }
        } catch (error) {
            console.error("Error saving account", error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteAccount = async (id: string) => {
        if (!confirm("¿Eliminar esta cuenta y todos sus registros históricos?")) return
        try {
            const res = await netWorthService.deleteCategory(id)
            if (res.success) {
                fetchData()
            }
        } catch (error) {
            console.error("Error deleting category", error)
        }
    }

    const openEditModal = (cat: NetWorthCategory) => {
        setEditingCategoryId(cat.id)
        setNewAccountName(cat.name)
        setNewAccountGroup(cat.groupName || '')
        setNewAccountType(cat.type)
        setIsEditAccountModalOpen(true)
    }

    const chartData = useMemo(() => {
        if (!summary?.history) return []
        return [...summary.history].sort((a, b) => a.date.localeCompare(b.date))
    }, [summary])

    const groupedCategories = useMemo(() => {
        const groups: Record<string, NetWorthCategory[]> = {}
        categories.forEach(cat => {
            const group = cat.groupName && cat.groupName.trim() !== "" ? cat.groupName.trim() : cat.name
            if (!groups[group]) groups[group] = []
            groups[group].push(cat)
        })
        return groups
    }, [categories])

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val)
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase">Mi <span className="text-orange-500">Patrimonio</span></h1>
                    <p className="text-muted-foreground font-medium">Balance detallado de tus cuentas, inversiones y deudas.</p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isNewAccountModalOpen} onOpenChange={setIsNewAccountModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-2xl border-2 border-zinc-800 h-12 px-6 font-black hover:bg-zinc-800 transition-all hover:scale-105">
                                <Plus className="w-5 h-5 mr-2" /> NUEVA CUENTA
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] border-none bg-zinc-900 text-white p-8 shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic">AÑADIR <span className="text-orange-500">ENTIDAD</span></DialogTitle>
                            </DialogHeader>
                            <AccountForm 
                                name={newAccountName}
                                setName={setNewAccountName}
                                group={newAccountGroup}
                                setGroup={setNewAccountGroup}
                                type={newAccountType}
                                setType={setNewAccountType}
                                onSubmit={handleCreateOrUpdateAccount}
                                submitting={submitting}
                                isEdit={false}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black px-6 h-12 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all">
                                <Plus className="w-5 h-5 mr-2" /> ACTUALIZAR SALDO
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] border-none bg-zinc-900 text-white p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic">REGISTRAR <span className="text-orange-500">POSICIÓN</span></DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-500">Seleccionar Cuenta</label>
                                    <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 rounded-xl h-12">
                                            <SelectValue placeholder="Elige donde meter el dato" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white rounded-xl max-h-60">
                                            {Object.entries(groupedCategories).length > 0 ? (
                                                Object.entries(groupedCategories).map(([group, cats]) => (
                                                    <SelectGroup key={group}>
                                                        <SelectLabel className="text-zinc-500 text-[10px] uppercase tracking-widest mt-2 px-2">{group}</SelectLabel>
                                                        {cats.map(cat => (
                                                            <SelectItem key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-xs text-zinc-500">No hay cuentas creadas</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-500">Saldo Actual (€)</label>
                                        <Input 
                                            type="number" 
                                            placeholder="0.00" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 rounded-xl h-12 text-lg font-black"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-zinc-500">Fecha del Dato</label>
                                        <Input 
                                            type="date" 
                                            value={entryDate}
                                            onChange={(e) => setEntryDate(e.target.value)}
                                            className="bg-zinc-800 border-zinc-700 rounded-xl h-12"
                                        />
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleSaveEntry} 
                                    className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-lg shadow-lg shadow-orange-500/20"
                                    disabled={submitting}
                                >
                                    GUARDAR SALDO
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-2 bg-zinc-900 border-none shadow-xl rounded-[2rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <PiggyBank className="w-24 h-24" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-2">Patrimonio Neto Total</p>
                    <h2 className="text-5xl font-black mb-4 text-white italic tracking-tighter">{formatCurrency(summary?.netWorth || 0)}</h2>
                    <div className={cn(
                        "flex items-center gap-2 text-sm font-bold",
                        (summary?.monthlyChange || 0) >= 0 ? "text-emerald-500" : "text-red-500"
                    )}>
                        {(summary?.monthlyChange || 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatCurrency(Math.abs(summary?.monthlyChange || 0))} ({summary?.monthlyChangePercent?.toFixed(2)}%) vs mes anterior
                    </div>
                </Card>

                <Card className="bg-card border-none shadow-xl rounded-[2rem] p-8 border-t-4 border-t-emerald-500/50 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Activos</p>
                    <h3 className="text-3xl font-black text-emerald-500 italic tracking-tighter">{formatCurrency(summary?.totalAssets || 0)}</h3>
                </Card>

                <Card className="bg-card border-none shadow-xl rounded-[2rem] p-8 border-t-4 border-t-red-500/50 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Pasivos</p>
                    <h3 className="text-3xl font-black text-red-500 italic tracking-tighter">{formatCurrency(summary?.totalLiabilities || 0)}</h3>
                </Card>
            </div>

            {/* Chart + Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black italic uppercase">Evolución <span className="text-orange-500">Patrimonial</span></CardTitle>
                            <p className="text-xs text-muted-foreground font-medium mt-1">Histórico de tu balance neto</p>
                        </div>
                        <History className="w-5 h-5 text-muted-foreground opacity-50" />
                    </CardHeader>
                    <CardContent className="p-8 pt-10">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                        dataKey="date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                                        tickFormatter={(val) => `€${(val/1000).toFixed(0)}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="netWorth" 
                                        stroke="#f97316" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorNet)" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-card border-none shadow-xl rounded-[2rem] p-8">
                        <CardHeader className="p-0 mb-6 font-bold flex flex-row items-center gap-2">
                             <PieChartIcon className="w-4 h-4 text-orange-500" />
                             <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Reparto por Categoría</span>
                        </CardHeader>
                        <div className="space-y-4">
                            {Object.entries(summary?.assetsDistribution || {}).map(([name, val]) => (
                                <div key={name} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="truncate max-w-[120px] uppercase text-zinc-400">{name}</span>
                                        <span className="text-base text-white">{formatCurrency(val)}</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                                            style={{ width: `${(val / (summary?.totalAssets || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                            {Object.entries(summary?.liabilitiesDistribution || {}).map(([name, val]) => (
                                <div key={name} className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="truncate max-w-[120px] uppercase text-zinc-400">{name}</span>
                                        <span className="text-base text-white">{formatCurrency(val)}</span>
                                    </div>
                                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500 rounded-full transition-all duration-700" 
                                            style={{ width: `${(val / (summary?.totalLiabilities || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Detailed Table per Group */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Desglose de <span className="text-orange-500">Patrimonio</span></h2>
                
                {Object.entries(groupedCategories).length > 0 ? (
                    Object.entries(groupedCategories).map(([group, cats]) => {
                        const isExpanded = expandedGroups[group];
                        const groupTotal = cats.reduce((acc, cat) => acc + (summary?.categoryBalances?.[cat.id] || 0), 0);
                        
                        return (
                            <Card key={group} className="bg-card border-none shadow-xl rounded-[2.5rem] overflow-hidden transition-all duration-300">
                                <div 
                                    onClick={() => toggleGroup(group)}
                                    className="bg-zinc-900 px-8 py-6 flex justify-between items-center border-b border-white/5 cursor-pointer hover:bg-zinc-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2 rounded-xl bg-orange-500/10 text-orange-500 transition-transform duration-300",
                                            isExpanded ? "rotate-0" : "-rotate-90"
                                        )}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">{group}</span>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{cats.length} {cats.length === 1 ? 'cuenta' : 'cuentas'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "text-xl font-black italic tracking-tighter",
                                            cats[0]?.type === 'ASSET' ? "text-emerald-500" : "text-red-500"
                                        )}>{formatCurrency(groupTotal)}</span>
                                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Saldo Global</p>
                                    </div>
                                </div>
                                
                                {isExpanded && (
                                    <div className="p-0 animate-in slide-in-from-top-4 duration-500">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <tbody className="divide-y divide-white/5">
                                                    {cats.map(cat => (
                                                        <tr key={cat.id} className="hover:bg-muted/5 transition-colors group">
                                                            <td className="p-6 md:pl-12 flex items-center gap-4">
                                                                <div className="p-3 rounded-xl bg-background border-2 border-border group-hover:border-orange-500/50 transition-colors">
                                                                    {getIconForGroup(group, cat.type)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-md italic tracking-tight">{cat.name}</p>
                                                                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                                                                        {cat.type === 'ASSET' ? 'Activo Individual' : 'Deuda Individual'}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="p-6 text-right">
                                                                <p className="font-black text-lg italic bg-zinc-800/50 inline-block px-4 py-1 rounded-xl border border-white/5">
                                                                    {formatCurrency(summary?.categoryBalances?.[cat.id] || 0)}
                                                                </p>
                                                            </td>
                                                            <td className="p-6 text-right w-32">
                                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedCategoryId(cat.id);
                                                                            setIsAddModalOpen(true);
                                                                        }} 
                                                                        className="rounded-xl h-9 w-9 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white"
                                                                    >
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            openEditModal(cat);
                                                                        }} 
                                                                        className="rounded-xl h-9 w-9 text-zinc-400 hover:bg-blue-500/10 hover:text-blue-500"
                                                                    >
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteAccount(cat.id);
                                                                        }} 
                                                                        className="rounded-xl h-9 w-9 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <div className="h-64 rounded-[3rem] border-4 border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-500">
                        <Landmark className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-black italic text-lg">No has añadido ninguna cuenta aún</p>
                        <p className="text-sm">Pulsa en "Nueva Cuenta" para empezar</p>
                    </div>
                )}
            </div>

            {/* Edit Account Modal */}
            <Dialog open={isEditAccountModalOpen} onOpenChange={setIsEditAccountModalOpen}>
                <DialogContent className="rounded-[2rem] border-none bg-zinc-900 text-white p-8 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black italic text-orange-500">EDITAR CUENTA</DialogTitle>
                    </DialogHeader>
                    <AccountForm 
                        name={newAccountName}
                        setName={setNewAccountName}
                        group={newAccountGroup}
                        setGroup={setNewAccountGroup}
                        type={newAccountType}
                        setType={setNewAccountType}
                        onSubmit={handleCreateOrUpdateAccount}
                        submitting={submitting}
                        isEdit={true}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

function AccountForm({ name, setName, group, setGroup, type, setType, onSubmit, submitting, isEdit }: any) {
    return (
        <div className="space-y-6 pt-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Nombre (Entidad o Recurso)</label>
                <Input 
                    placeholder="Ej: BBVA, DeGiro, Hipoteca Piso..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 rounded-xl h-12 focus:ring-orange-500"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Sección Principal (Opcional)</label>
                    <Select value={group} onValueChange={setGroup}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 rounded-xl h-12">
                            <SelectValue placeholder="Sin agrupar (Desglosado)" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white rounded-xl">
                            <SelectItem value="Cuentas Bancarias">Cuentas Bancarias</SelectItem>
                            <SelectItem value="Brokers / Inversiones">Brokers / Inversiones</SelectItem>
                            <SelectItem value="Criptomonedas">Criptomonedas</SelectItem>
                            <SelectItem value="Inmuebles">Inmuebles</SelectItem>
                            <SelectItem value="Deudas / Préstamos">Deudas / Préstamos</SelectItem>
                            <SelectItem value="Otros">Otros</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-[9px] text-zinc-500 px-1">Si lo dejas vacío, la cuenta aparecerá como una sección propia.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 px-1">Tipo de Balance</label>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 rounded-xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white rounded-xl">
                            <SelectItem value="ASSET">ACTIVO (+)</SelectItem>
                            <SelectItem value="LIABILITY">PASIVO (-)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button 
                onClick={onSubmit} 
                className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-black font-black text-lg transition-transform active:scale-95 shadow-lg shadow-orange-500/20 mt-4"
                disabled={submitting}
            >
                {isEdit ? 'GUARDAR CAMBIOS' : 'CREAR CUENTA'}
            </Button>
        </div>
    )
}

function getIconNameForGroup(group: string) {
    if (group.toLowerCase().includes('bancaria')) return 'landmark'
    if (group.toLowerCase().includes('broker') || group.toLowerCase().includes('inversion')) return 'bar-chart'
    if (group.toLowerCase().includes('cripto')) return 'bitcoin'
    if (group.toLowerCase().includes('inmueble')) return 'home'
    if (group.toLowerCase().includes('deuda') || group.toLowerCase().includes('prestamo')) return 'credit-card'
    return 'wallet'
}

function getIconForGroup(group: string, type: 'ASSET' | 'LIABILITY') {
    if (group.toLowerCase().includes('bancaria')) return <Landmark className="w-5 h-5 text-emerald-500" />
    if (group.toLowerCase().includes('broker') || group.toLowerCase().includes('inversion')) return <TrendingUp className="w-5 h-5 text-blue-500" />
    if (group.toLowerCase().includes('cripto')) return <Coins className="w-5 h-5 text-orange-500" />
    if (group.toLowerCase().includes('inmueble')) return <Home className="w-5 h-5 text-pink-500" />
    if (type === 'LIABILITY') return <CreditCard className="w-5 h-5 text-red-500" />
    return <Wallet className="w-5 h-5 text-zinc-500" />
}
