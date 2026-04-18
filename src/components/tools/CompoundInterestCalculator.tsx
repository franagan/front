'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp } from "lucide-react"
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

export default function CompoundInterestCalculator() {
    const [initialAmount, setInitialAmount] = useState(1000)
    const [monthlyContribution, setMonthlyContribution] = useState(200)
    const [years, setYears] = useState(20)
    const [annualRate, setAnnualRate] = useState(7)
    const [chartData, setChartData] = useState<any[]>([])
    const [finalBalance, setFinalBalance] = useState(0)
    const [totalContributions, setTotalContributions] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)

    useEffect(() => {
        calculate()
    }, [initialAmount, monthlyContribution, years, annualRate])

    const calculate = () => {
        const data = []
        let balance = initialAmount
        let contributions = initialAmount
        const monthlyRate = annualRate / 100 / 12

        data.push({
            year: 0,
            balance: Math.round(balance),
            contributions: Math.round(contributions),
            interest: 0
        })

        for (let i = 1; i <= years; i++) {
            for (let j = 0; j < 12; j++) {
                const interest = balance * monthlyRate
                balance += interest + monthlyContribution
                contributions += monthlyContribution
            }
            data.push({
                year: i,
                balance: Math.round(balance),
                contributions: Math.round(contributions),
                interest: Math.round(balance - contributions)
            })
        }

        setChartData(data)
        setFinalBalance(balance)
        setTotalContributions(contributions)
        setTotalInterest(balance - contributions)
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Inputs */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-card border-border border-l-4 border-l-green-500 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            Parámetros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Inversión Inicial (€)</Label>
                            <Input 
                                type="number" 
                                value={initialAmount} 
                                onChange={(e) => setInitialAmount(Number(e.target.value))} 
                                className="font-bold text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Aportación Mensual (€)</Label>
                            <Input 
                                type="number" 
                                value={monthlyContribution} 
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))} 
                                className="font-bold text-lg text-green-600"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Plazo (Años)</Label>
                                <Input 
                                    type="number" 
                                    value={years} 
                                    onChange={(e) => setYears(Number(e.target.value))} 
                                    className="font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rentabilidad (%)</Label>
                                <Input 
                                    type="number" 
                                    value={annualRate} 
                                    onChange={(e) => setAnnualRate(Number(e.target.value))} 
                                    className="font-bold text-lg text-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-card/50 border-2 border-border rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex justify-between items-center pb-5 border-b border-border">
                        <div className="flex flex-col">
                            <span className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">Balance Final</span>
                            <span className="text-3xl font-black text-emerald-500 mt-1">€{Math.round(finalBalance).toLocaleString('es-ES')}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Tus Aportes</span>
                            <span className="text-xl font-bold text-emerald-600/80">€{Math.round(totalContributions).toLocaleString('es-ES')}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Intereses</span>
                            <span className="text-xl font-bold text-blue-500">€{Math.round(totalInterest).toLocaleString('es-ES')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-8">
                <Card className="bg-card border-border overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border">
                        <CardTitle className="text-xl">Crecimiento Proyectado</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[400px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis 
                                        dataKey="year" 
                                        stroke="#888" 
                                        fontSize={10} 
                                        tickLine={false} 
                                        axisLine={false}
                                        label={{ value: 'Plazo (Años)', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#666', fontWeight: 'bold' }}
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
                                        contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid #10b981', borderRadius: '16px', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ fontWeight: 'black' }}
                                        formatter={(value: any) => [`€${value.toLocaleString('es-ES')}`]}
                                        labelFormatter={(label) => `AÑO ${label}`}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="contributions" 
                                        name="TUS APORTACIONES"
                                        stroke="#10b981" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorContrib)" 
                                        animationDuration={1500}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="balance" 
                                        name="TOTAL ACUMULADO"
                                        stroke="#3b82f6" 
                                        strokeWidth={4}
                                        fillOpacity={1} 
                                        fill="url(#colorInterest)" 
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
