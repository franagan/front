'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, TrendingUp, Info } from "lucide-react"
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

export default function CompoundInterestPage() {
    const router = useRouter()
    
    // States
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
        <div className="min-h-screen bg-background">
            <header className="bg-background/50 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.push('/mainboard/tools')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        Calculadora de Interés Compuesto
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-card border-border border-l-4 border-l-green-500 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Parámetros</CardTitle>
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
                                    <Label>Rentabilidad Anual Esperada (%)</Label>
                                    <Input 
                                        type="number" 
                                        value={annualRate} 
                                        onChange={(e) => setAnnualRate(Number(e.target.value))} 
                                        className="font-bold text-lg text-blue-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30 border-dashed border-2 p-4">
                            <div className="flex gap-3">
                                <Info className="h-5 w-5 text-blue-400 shrink-0" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    El interés compuesto es la octava maravilla del mundo. Quien lo entiende, lo gana; quien no, lo paga. - Albert Einstein
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Results & Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-card p-4 rounded-xl border border-border">
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Balance Final</p>
                                <p className="text-2xl font-black text-foreground">€{Math.round(finalBalance).toLocaleString('es-ES')}</p>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-border">
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Tus Aportaciones</p>
                                <p className="text-2xl font-black text-green-600">€{Math.round(totalContributions).toLocaleString('es-ES')}</p>
                            </div>
                            <div className="bg-card p-4 rounded-xl border border-border">
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Intereses Totales</p>
                                <p className="text-2xl font-black text-blue-500">€{Math.round(totalInterest).toLocaleString('es-ES')}</p>
                            </div>
                        </div>

                        <Card className="bg-card border-border overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl">Crecimiento de tu Inversión</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-6">
                                <div className="h-[400px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis 
                                                dataKey="year" 
                                                stroke="#888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                                label={{ value: 'Años', position: 'insideBottom', offset: -5 }}
                                            />
                                            <YAxis 
                                                stroke="#888" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false}
                                                tickFormatter={(value) => `€${(value / 1000)}k`}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                                                formatter={(value: any) => [`€${value.toLocaleString('es-ES')}`, '']}
                                            />
                                            <Legend />
                                            <Area 
                                                type="monotone" 
                                                dataKey="contributions" 
                                                name="Tus Aportaciones"
                                                stroke="#22c55e" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorContrib)" 
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="balance" 
                                                name="Total Acumulado"
                                                stroke="#3b82f6" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorInterest)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
