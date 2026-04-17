'use client'

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { PiggyBank, AlertTriangle, CheckCircle, PieChart } from "lucide-react"

export default function BudgetCalculator() {
    const [data, setData] = useState({
        income: 3500,
        housing: 1200,
        food: 400,
        transport: 300,
        entertainment: 200,
        other: 0
    })

    const totalExpenses = data.housing + data.food + data.transport + data.entertainment + data.other
    const remainingSavings = data.income - totalExpenses
    const savingsRate = data.income > 0 ? (remainingSavings / data.income) * 100 : 0

    const budgetItems = [
        { name: 'Vivienda', value: data.housing, color: 'bg-red-500' },
        { name: 'Comida', value: data.food, color: 'bg-orange-500' },
        { name: 'Transporte', value: data.transport, color: 'bg-yellow-500' },
        { name: 'Ocio', value: data.entertainment, color: 'bg-emerald-500' },
        { name: 'Otros', value: data.other, color: 'bg-blue-500' },
        { name: 'Ahorro', value: Math.max(0, remainingSavings), color: 'bg-purple-500' }
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-5 space-y-6">
                <Card className="bg-card border-border border-l-4 border-l-purple-500 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-purple-500" />
                            Tus Flujos Mensuales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="pb-4 border-b border-border">
                            <Label className="text-foreground font-bold">Ingresos Totales (€)</Label>
                            <Input
                                type="number"
                                value={data.income}
                                onChange={(e) => setData(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                                className="text-xl font-black text-green-500 mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Vivienda</Label>
                                <Input type="number" value={data.housing} onChange={(e) => setData(prev => ({ ...prev, housing: parseInt(e.target.value) || 0 }))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Comida</Label>
                                <Input type="number" value={data.food} onChange={(prev: any) => setData((p: any) => ({ ...p, food: parseInt(prev.target.value) || 0 }))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Transporte</Label>
                                <Input type="number" value={data.transport} onChange={(prev: any) => setData((p: any) => ({ ...p, transport: parseInt(prev.target.value) || 0 }))} />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Ocio</Label>
                                <Input type="number" value={data.entertainment} onChange={(prev: any) => setData((p: any) => ({ ...p, entertainment: parseInt(prev.target.value) || 0 }))} />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Label className="text-xs">Otros Gastos</Label>
                            <Input type="number" value={data.other} onChange={(prev: any) => setData((p: any) => ({ ...p, other: parseInt(prev.target.value) || 0 }))} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">Capacidad de Ahorro</p>
                        <p className={`text-4xl font-black ${remainingSavings >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            €{Math.round(remainingSavings).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">mensuales</p>
                    </div>
                    <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-xl flex flex-col justify-center items-center text-center">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">Tasa de Ahorro</p>
                        <p className="text-4xl font-black text-purple-500">
                            {savingsRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">del total ingresos</p>
                    </div>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                            Distribución de Gastos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {budgetItems.map((item) => (
                                <div key={item.name} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                            {item.name}
                                        </span>
                                        <span>€{item.value.toLocaleString()} ({data.income > 0 ? ((item.value / data.income) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`${item.color} h-full transition-all duration-500`}
                                            style={{ width: `${data.income > 0 ? (item.value / data.income) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            {savingsRate < 20 ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                                    <p className="text-xs text-yellow-200">
                                        Tu tasa de ahorro es baja. Para alcanzar el FIRE, intenta reducir gastos innecesarios o aumentar ingresos hasta llegar al 30-50%.
                                    </p>
                                </div>
                            ) : savingsRate >= 40 ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex gap-3">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <p className="text-xs text-emerald-200">
                                        ¡Excelente! Tu tasa de ahorro es digna de un experto en FIRE. Estás acelerando tu camino a la jubilación.
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
