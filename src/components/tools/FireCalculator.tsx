'use client'

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Target,
    Zap,
    Calculator
} from "lucide-react"
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts'

export default function FireCalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [retirementAge, setRetirementAge] = useState(50)
    const [currentSavings, setCurrentSavings] = useState(50000)
    const [monthlyIncome, setMonthlyIncome] = useState(3500)
    const [monthlyExpenses, setMonthlyExpenses] = useState(2100)
    const [expectedReturn, setExpectedReturn] = useState(7)
    const [withdrawalRate, setWithdrawalRate] = useState(4)
    const [results, setResults] = useState<any>(null)
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        calculateFIRE()
    }, [currentAge, retirementAge, currentSavings, monthlyIncome, monthlyExpenses, expectedReturn, withdrawalRate])

    const calculateFIRE = () => {
        const monthlySavings = monthlyIncome - monthlyExpenses
        const annualExpenses = monthlyExpenses * 12
        const fireNumber = annualExpenses * (100 / withdrawalRate)
        const yearsToRetirement = retirementAge - currentAge

        const monthlyRate = expectedReturn / 100 / 12
        let accumulated = currentSavings
        const data = []

        let months = 0
        while (accumulated < fireNumber * 1.5 && months < 600) {
            if (months % 12 === 0) {
                data.push({
                    age: currentAge + (months / 12),
                    accumulated: Math.round(accumulated),
                    target: Math.round(fireNumber)
                })
            }
            accumulated = accumulated * (1 + monthlyRate) + monthlySavings
            months++
        }

        const yearsToFire = months / 12
        const fireAge = currentAge + yearsToFire
        const savingsRate = (monthlySavings / monthlyIncome) * 100

        setChartData(data)
        setResults({
            fireNumber,
            yearsToFire: yearsToFire.toFixed(1),
            fireAge: fireAge.toFixed(0),
            monthlySavings,
            savingsRate: savingsRate.toFixed(1),
            leanFire: fireNumber * 0.7,
            coastFire: fireNumber / Math.pow(1 + expectedReturn / 100, Math.max(0, yearsToFire)),
            regularFire: fireNumber,
            fatFire: fireNumber * 1.5
        })
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Left: Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-card border-border border-l-4 border-l-orange-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Tu Situación Actual
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Edad Actual</Label>
                                <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Edad Retiro</Label>
                                <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ahorros Actuales (€)</Label>
                            <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                            <div className="space-y-2">
                                <Label>Ingresos Mens.</Label>
                                <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="text-green-500 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label>Gastos Mens.</Label>
                                <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="text-red-500 font-bold" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Rentabilidad (%)</Label>
                                <Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Tasa Retiro (%)</Label>
                                <Input type="number" value={withdrawalRate} onChange={(e) => setWithdrawalRate(Number(e.target.value))} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {results && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-2xl p-6 flex items-center gap-5 shadow-lg shadow-orange-500/5 transition-transform hover:scale-[1.02]">
                            <div className="bg-orange-500 p-3 rounded-xl shadow-xl shadow-orange-500/20">
                                <Target className="h-8 w-8 text-black" />
                            </div>
                            <div>
                                <p className="text-[11px] text-orange-600 font-black uppercase tracking-[0.2em]">Tu Número FIRE</p>
                                <p className="text-3xl font-black text-foreground">€{results.fireNumber.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Charts & Scenarios */}
            <div className="lg:col-span-8 space-y-8">
                <Card className="bg-card border-border overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border">
                        <CardTitle className="flex justify-between items-center text-xl">
                            <span>Proyección de Patrimonio</span>
                            {results && (
                                <span className="text-sm bg-green-500/20 text-green-600 px-3 py-1 rounded-full font-bold">
                                    FIRE a los {results.fireAge} años
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[350px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.6}/>
                                            <stop offset="50%" stopColor="#f97316" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="age" 
                                        stroke="#888" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        label={{ value: 'Edad (años)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#666', fontWeight: 'bold' }}
                                    />
                                    <YAxis 
                                        stroke="#888" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(value) => `€${Math.round(value / 1000)}k`}
                                        fontWeight="bold"
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid #f97316', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#f97316', fontWeight: 'black' }}
                                        formatter={(value: any) => [`€${value.toLocaleString('es-ES')}`, 'PATRIMONIO']}
                                        labelFormatter={(label) => `EDAD: ${label} AÑOS`}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="accumulated" 
                                        name="PROYECCIÓN TOTAL"
                                        stroke="#f97316" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorAcc)" 
                                        animationDuration={2000}
                                    />
                                    <Area 
                                        type="step" 
                                        dataKey="target" 
                                        name="LÍNEA FIRE"
                                        stroke="#666" 
                                        strokeDasharray="8 8"
                                        strokeWidth={2}
                                        fill="transparent"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {results && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'LEAN FIRE', val: results.leanFire, desc: 'Indispensable', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
                            { name: 'REGULAR FIRE', val: results.regularFire, desc: 'Nivel actual', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            { name: 'FAT FIRE', val: results.fatFire, desc: 'Nivel lujo', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                            { name: 'COAST FIRE', val: results.coastFire, desc: 'Ya no ahorres', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
                        ].map(s => (
                            <div key={s.name} className={`bg-card p-5 rounded-3xl border border-border flex flex-col items-center text-center transition-all hover:border-${s.color.split('-')[1]}-500/50 hover:-translate-y-1`}>
                                <p className={`text-[10px] ${s.color} font-black tracking-[0.2em] uppercase whitespace-nowrap`}>{s.name}</p>
                                <p className={`text-xl font-black mt-2 tracking-tighter`}>€{Math.round(s.val).toLocaleString('es-ES')}</p>
                                <div className={`mt-2 px-3 py-1 ${s.bg} rounded-full`}>
                                    <span className={`text-[9px] font-black uppercase ${s.color}`}>{s.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
