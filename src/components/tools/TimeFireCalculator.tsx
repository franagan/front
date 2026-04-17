'use client'

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, Clock, TrendingUp, Info } from "lucide-react"

export default function TimeFireCalculator() {
    const [data, setData] = useState({
        currentAge: 30,
        currentSavings: 15000,
        monthlyIncome: 3500,
        monthlyExpenses: 2000,
        expectedReturn: 7
    })

    const monthlyDifference = data.monthlyIncome - data.monthlyExpenses
    const fireTarget = data.monthlyExpenses * 12 * 25

    const calculateYears = (target: number) => {
        if (data.currentSavings >= target) return 0
        if (monthlyDifference <= 0) return 99
        
        let current = data.currentSavings
        let months = 0
        const monthlyRate = data.expectedReturn / 100 / 12
        while (current < target && months < 1200) {
            current = current * (1 + monthlyRate) + monthlyDifference
            months++
        }
        return Math.round((months / 12) * 10) / 10
    }

    const levels = [
        { name: 'Lean FIRE', icon: <Zap className="h-5 w-5 text-green-500" />, amount: fireTarget * 0.7, color: 'border-green-500/30' },
        { name: 'Coast FIRE', icon: <Clock className="h-5 w-5 text-blue-500" />, amount: fireTarget / Math.pow(1 + data.expectedReturn / 100, 20), color: 'border-blue-500/30' },
        { name: 'Regular FIRE', icon: <Target className="h-5 w-5 text-orange-500" />, amount: fireTarget, color: 'border-orange-500/30' },
        { name: 'Fat FIRE', icon: <TrendingUp className="h-5 w-5 text-purple-500" />, amount: fireTarget * 1.5, color: 'border-purple-500/30' }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-card border-border shadow-xl">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Edad</Label>
                            <Input type="number" value={data.currentAge} onChange={(e) => setData(p => ({...p, currentAge: parseInt(e.target.value)}))} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ahorros (€)</Label>
                            <Input type="number" value={data.currentSavings} onChange={(e) => setData(p => ({...p, currentSavings: parseInt(e.target.value)}))} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ingresos Mensuales</Label>
                            <Input type="number" value={data.monthlyIncome} onChange={(e) => setData(p => ({...p, monthlyIncome: parseInt(e.target.value)}))} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gastos Mensuales</Label>
                            <Input type="number" value={data.monthlyExpenses} onChange={(e) => setData(p => ({...p, monthlyExpenses: parseInt(e.target.value)}))} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rentabilidad %</Label>
                            <Input type="number" value={data.expectedReturn} onChange={(e) => setData(p => ({...p, expectedReturn: parseInt(e.target.value)}))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {levels.map(level => {
                    const years = calculateYears(level.amount)
                    return (
                        <Card key={level.name} className={`bg-card transition-all duration-300 border-2 ${level.color} hover:shadow-2xl hover:-translate-y-2`}>
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="mb-4 bg-muted p-4 rounded-2xl">
                                    {level.icon}
                                </div>
                                <h3 className="text-xl font-black mb-1 italic">{level.name}</h3>
                                <p className="text-xs text-muted-foreground mb-6">Objetivo: €{Math.round(level.amount).toLocaleString()}</p>
                                
                                <div className="mt-auto">
                                    <div className="text-4xl font-black text-foreground mb-1">
                                        {years === 0 ? "DONE!" : `${years}`}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {years === 0 ? "Objetivo alcanzado" : "Años restantes"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="bg-blue-500/5 border border-blue-500/20 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="bg-blue-500 p-4 rounded-2xl shadow-2xl shadow-blue-500/20">
                            <Info className="h-8 w-8 text-black" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-black mb-2">Análisis de Estrategia</h4>
                            <p className="text-muted-foreground leading-relaxed">
                                Con tu ritmo actual de ahorro de <span className="text-foreground font-bold">€{monthlyDifference.toLocaleString()}/mes</span>, 
                                estarás en disposición de jubilarte con tu estilo de vida actual a los <span className="text-blue-500 font-bold font-mono">{Math.round(data.currentAge + calculateYears(fireTarget))} años</span>.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
