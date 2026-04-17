'use client'
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Calculator,
    Target,
    Flame,
    Zap,
    TrendingUp,
    PieChart
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
import { useAuthStore } from "@/stores/useAuthStore"

export default function FireCalculatorPage() {
    const router = useRouter()
    const { user } = useAuthStore()

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
        if (!user) {
            router.push('/auth/login')
            return
        }
        calculateFIRE()
    }, [user, currentAge, retirementAge, currentSavings, monthlyIncome, monthlyExpenses, expectedReturn, withdrawalRate])

    const calculateFIRE = () => {
        const monthlySavings = monthlyIncome - monthlyExpenses
        const annualExpenses = monthlyExpenses * 12
        const fireNumber = annualExpenses * (100 / withdrawalRate)
        const yearsToRetirement = retirementAge - currentAge
        const monthsToRetirement = yearsToRetirement * 12

        const monthlyRate = expectedReturn / 100 / 12
        let accumulated = currentSavings
        const data = []

        // Simulation for chart
        // We simulate until they reach FIRE or 50 years max
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

    if (!user) return null

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="bg-background/50 border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => router.push('/mainboard/tools')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </Button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Flame className="h-6 w-6 text-orange-500" />
                        Calculadora FIRE
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 pt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                                        <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="text-green-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gastos Mens.</Label>
                                        <Input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} className="text-red-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pb-2">
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
                                <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-orange-500 p-2 rounded-lg">
                                        <Target className="h-6 w-6 text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-orange-600 font-black uppercase">Tu Número FIRE</p>
                                        <p className="text-2xl font-black">€{results.fireNumber.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
                                    </div>
                                </div>
                                <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <Calculator className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground font-black uppercase">Tasa de Ahorro</p>
                                        <p className="text-2xl font-black text-foreground">{results.savingsRate}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Charts & Scenarios */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Projection Chart */}
                        <Card className="bg-card border-border overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Proyección hacia la Libertad</span>
                                    {results && (
                                        <span className="text-sm bg-green-500/20 text-green-500 px-3 py-1 rounded-full animate-pulse">
                                            Alcanzado a los {results.fireAge} años
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis
                                                dataKey="age"
                                                stroke="#888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                label={{ value: 'Edad', position: 'insideBottom', offset: -5 }}
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
                                                labelFormatter={(label) => `Edad: ${label}`}
                                            />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="accumulated"
                                                name="Capital Acumulado"
                                                stroke="#f97316"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorAcc)"
                                            />
                                            <Area
                                                type="step"
                                                dataKey="target"
                                                name="Objetivo FIRE"
                                                stroke="#888"
                                                strokeDasharray="5 5"
                                                strokeWidth={2}
                                                fill="transparent"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Scenarios Grid */}
                        {results && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { name: 'LEAN FIRE', val: results.leanFire, desc: 'Coste mínimo', color: 'text-blue-400' },
                                    { name: 'REGULAR FIRE', val: results.regularFire, desc: 'Estilo actual', color: 'text-orange-500' },
                                    { name: 'FAT FIRE', val: results.fatFire, desc: 'Vida de lujo', color: 'text-yellow-500' },
                                    { name: 'COAST FIRE', val: results.coastFire, desc: 'No más ahorro', color: 'text-green-500' }
                                ].map(s => (
                                    <div key={s.name} className="bg-card/50 p-4 rounded-xl border border-border group hover:border-foreground/50 transition-colors">
                                        <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">{s.name}</p>
                                        <p className={`text-xl font-black ${s.color}`}>€{Math.round(s.val).toLocaleString('es-ES')}</p>
                                        <p className="text-[10px] text-muted-foreground italic mt-1">{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
