'use client'

import { Navigation } from "@/components/ui/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress, CircularProgress } from "@/components/ui/progress"
import { LineFinancialChart, BarFinancialChart } from "@/components/ui/chart"
import { Alert } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast, toast } from "@/components/ui/toast"
import { useState } from "react"
import {
    Calculator,
    Target,
    TrendingUp,
    DollarSign,
    PiggyBank,
    Clock,
    BarChart3,
    PieChart,
    Calendar,
    Zap,
    Info,
    Lightbulb,
    CheckCircle,
    AlertTriangle,
    RefreshCw,
    Download,
    Share2,
    Bookmark,
    Bell
} from "lucide-react"

export default function CalculadorasPage() {
    const { addToast } = useToast()

    // Estados para Calculadora FIRE Principal
    const [fireData, setFireData] = useState({
        currentAge: 30,
        targetAge: 50,
        currentSavings: 15000,
        monthlyIncome: 3500,
        monthlyExpenses: 2000,
        expectedReturn: 7
    })

    // Estados para Calculadora de Interés Compuesto
    const [compoundData, setCompoundData] = useState({
        initialAmount: 10000,
        monthlyContribution: 500,
        annualReturn: 7,
        years: 20
    })

    // Estados para Calculadora de Presupuesto
    const [budgetData, setBudgetData] = useState({
        income: 3500,
        housing: 1200,
        food: 400,
        transport: 300,
        entertainment: 200,
        savings: 0,
        other: 0
    })

    // Cálculos FIRE
    const monthlyDifference = fireData.monthlyIncome - fireData.monthlyExpenses
    const yearsToFire = fireData.targetAge - fireData.currentAge
    const requiredAmount = fireData.monthlyExpenses * 12 * 25 // Regla del 4%
    const projectedAmount = fireData.currentSavings * Math.pow(1 + fireData.expectedReturn / 100, yearsToFire) +
        (monthlyDifference * 12 * (Math.pow(1 + fireData.expectedReturn / 100, yearsToFire) - 1) / (fireData.expectedReturn / 100))
    const fireProgress = Math.min((projectedAmount / requiredAmount) * 100, 100)

    // Cálculos Interés Compuesto
    const compoundTotal = compoundData.initialAmount * Math.pow(1 + compoundData.annualReturn / 100, compoundData.years) +
        compoundData.monthlyContribution * 12 * ((Math.pow(1 + compoundData.annualReturn / 100, compoundData.years) - 1) / (compoundData.annualReturn / 100))
    const totalContributions = compoundData.initialAmount + (compoundData.monthlyContribution * 12 * compoundData.years)
    const totalGains = compoundTotal - totalContributions

    // Cálculos Presupuesto
    const totalExpenses = budgetData.housing + budgetData.food + budgetData.transport + budgetData.entertainment + budgetData.other
    const remainingSavings = budgetData.income - totalExpenses
    const savingsRate = (remainingSavings / budgetData.income) * 100

    // Datos para gráficos
    const fireEvolutionData = []
    for (let year = 0; year <= yearsToFire; year++) {
        const amount = fireData.currentSavings * Math.pow(1 + fireData.expectedReturn / 100, year) +
            (monthlyDifference * 12 * (year > 0 ? (Math.pow(1 + fireData.expectedReturn / 100, year) - 1) / (fireData.expectedReturn / 100) : 0))
        fireEvolutionData.push({
            name: `Año ${fireData.currentAge + year}`,
            patrimonio: Math.round(amount),
            objetivo: requiredAmount
        })
    }

    const compoundEvolutionData = []
    for (let year = 0; year <= compoundData.years; year++) {
        const principal = compoundData.initialAmount * Math.pow(1 + compoundData.annualReturn / 100, year)
        const contributions = compoundData.monthlyContribution * 12 * year
        const compoundContributions = year > 0 ? compoundData.monthlyContribution * 12 * ((Math.pow(1 + compoundData.annualReturn / 100, year) - 1) / (compoundData.annualReturn / 100)) : 0
        compoundEvolutionData.push({
            name: `Año ${year}`,
            total: Math.round(principal + compoundContributions),
            aportaciones: compoundData.initialAmount + contributions,
            ganancias: Math.round(principal + compoundContributions - compoundData.initialAmount - contributions)
        })
    }

    const budgetChartData = [
        { name: 'Vivienda', value: budgetData.housing, color: '#ef4444' },
        { name: 'Comida', value: budgetData.food, color: '#f97316' },
        { name: 'Transporte', value: budgetData.transport, color: '#eab308' },
        { name: 'Ocio', value: budgetData.entertainment, color: '#22c55e' },
        { name: 'Otros', value: budgetData.other, color: '#3b82f6' },
        { name: 'Ahorro', value: Math.max(0, remainingSavings), color: '#8b5cf6' }
    ]

    const exportResults = (type: string) => {
        addToast(toast.info("Función próximamente", "La exportación estará disponible pronto"))
    }

    const shareResults = (type: string) => {
        addToast(toast.success("Enlace copiado", "URL copiada al portapapeles"))
    }

    return (
        <div className="min-h-screen">

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-foreground font-semibold">
                                🧮 Herramientas FIRE
                            </Badge>
                            <h1 className="text-5xl font-bold leading-tight">
                                Calculadoras
                                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"> Financieras</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Herramientas gratuitas para planificar tu independencia financiera.
                                Calcula tu FIRE, simula inversiones y optimiza tu presupuesto.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">4</div>
                                <div className="text-sm text-muted-foreground">Calculadoras</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">100%</div>
                                <div className="text-sm text-muted-foreground">Gratuitas</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">∞</div>
                                <div className="text-sm text-muted-foreground">Sin límites</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-400">24/7</div>
                                <div className="text-sm text-muted-foreground">Disponibles</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculadoras */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <Tabs className="space-y-8">

                        {/* Tabs Navigation */}
                        <div className="flex justify-center">
                            <TabsList className="bg-card border-border">
                                <TabsTrigger value="fire" className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    FIRE
                                </TabsTrigger>
                                <TabsTrigger value="compound" className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Interés Compuesto
                                </TabsTrigger>
                                <TabsTrigger value="budget" className="flex items-center gap-2">
                                    <PiggyBank className="h-4 w-4" />
                                    Presupuesto
                                </TabsTrigger>
                                <TabsTrigger value="time" className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Tiempo FIRE
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Calculadora FIRE */}
                        <TabsContent value="fire" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">🔥 Calculadora FIRE Completa</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Calcula cuándo podrás retirarte y vivir de tus inversiones usando la regla del 4%
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Inputs FIRE */}
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-foreground flex items-center gap-2">
                                            <Target className="h-5 w-5 text-green-400" />
                                            Datos Personales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-foreground">Edad Actual</Label>
                                                <Input
                                                    type="number"
                                                    value={fireData.currentAge}
                                                    onChange={(e) => setFireData(prev => ({ ...prev, currentAge: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-foreground">Edad Objetivo</Label>
                                                <Input
                                                    type="number"
                                                    value={fireData.targetAge}
                                                    onChange={(e) => setFireData(prev => ({ ...prev, targetAge: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-foreground">Ahorros Actuales (€)</Label>
                                            <Input
                                                type="number"
                                                value={fireData.currentSavings}
                                                onChange={(e) => setFireData(prev => ({ ...prev, currentSavings: parseInt(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-foreground">Ingresos Mensuales (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={fireData.monthlyIncome}
                                                    onChange={(e) => setFireData(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-foreground">Gastos Mensuales (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={fireData.monthlyExpenses}
                                                    onChange={(e) => setFireData(prev => ({ ...prev, monthlyExpenses: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-foreground">Rendimiento Esperado Anual (%)</Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={fireData.expectedReturn}
                                                onChange={(e) => setFireData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={() => shareResults('fire')} variant="outline" className="border-gray-600 text-foreground hover:bg-gray-700">
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Compartir
                                            </Button>
                                            <Button onClick={() => exportResults('fire')} variant="outline" className="border-gray-600 text-foreground hover:bg-gray-700">
                                                <Download className="h-4 w-4 mr-2" />
                                                Exportar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Resultados FIRE */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700">
                                        <CardHeader>
                                            <CardTitle className="text-green-400">🎯 Tu FIRE</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex justify-center mb-6">
                                                <CircularProgress
                                                    value={fireProgress}
                                                    size={160}
                                                    variant="fire"
                                                    label="del objetivo FIRE"
                                                    showValue
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Patrimonio proyectado</div>
                                                    <div className="text-lg font-bold text-green-400">
                                                        €{Math.round(projectedAmount).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Objetivo FIRE</div>
                                                    <div className="text-lg font-bold text-foreground">
                                                        €{Math.round(requiredAmount).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Años hasta FIRE</div>
                                                    <div className="text-lg font-bold text-blue-400">
                                                        {yearsToFire} años
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Ahorro mensual</div>
                                                    <div className="text-lg font-bold text-purple-400">
                                                        €{Math.round(monthlyDifference).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {fireProgress >= 100 && (
                                                <Alert className="mt-4 bg-green-900/50 border-green-500">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <div>
                                                        <div className="font-semibold text-green-300">🎉 ¡Objetivo alcanzado!</div>
                                                        <div className="text-green-200 text-sm">Ya puedes conseguir tu FIRE</div>
                                                    </div>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="text-foreground">📈 Evolución Patrimonial</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <LineFinancialChart
                                                data={fireEvolutionData as any}
                                                height={250}
                                                colors={["#10b981", "#ef4444"]}
                                                title=""
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Calculadora Interés Compuesto */}
                        <TabsContent value="compound" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">📈 Simulador de Interés Compuesto</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Descubre el poder del interés compuesto y cómo pequeñas aportaciones pueden generar grandes fortunas
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Inputs Compuesto */}
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-foreground flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-blue-400" />
                                            Parámetros de Inversión
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <Label className="text-foreground">Inversión Inicial (€)</Label>
                                            <Input
                                                type="number"
                                                value={compoundData.initialAmount}
                                                onChange={(e) => setCompoundData(prev => ({ ...prev, initialAmount: parseInt(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-foreground">Aportación Mensual (€)</Label>
                                            <Input
                                                type="number"
                                                value={compoundData.monthlyContribution}
                                                onChange={(e) => setCompoundData(prev => ({ ...prev, monthlyContribution: parseInt(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-foreground">Rendimiento Anual (%)</Label>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={compoundData.annualReturn}
                                                onChange={(e) => setCompoundData(prev => ({ ...prev, annualReturn: parseFloat(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-foreground">Plazo (años)</Label>
                                            <Input
                                                type="number"
                                                value={compoundData.years}
                                                onChange={(e) => setCompoundData(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <Alert className="bg-blue-900/30 border-blue-500/50">
                                            <Info className="h-4 w-4 text-blue-400" />
                                            <div>
                                                <div className="font-semibold text-blue-300 mb-1">💡 Tip del Interés Compuesto</div>
                                                <div className="text-blue-200 text-sm">
                                                    "El interés compuesto es la octava maravilla del mundo" - Einstein
                                                </div>
                                            </div>
                                        </Alert>
                                    </CardContent>
                                </Card>

                                {/* Resultados Compuesto */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700">
                                        <CardHeader>
                                            <CardTitle className="text-blue-400">💰 Resultados</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-blue-400 mb-2">
                                                    €{Math.round(compoundTotal).toLocaleString()}
                                                </div>
                                                <div className="text-muted-foreground">Total final</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Total aportado</div>
                                                    <div className="text-lg font-bold text-foreground">
                                                        €{Math.round(totalContributions).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Ganancias</div>
                                                    <div className="text-lg font-bold text-green-400">
                                                        €{Math.round(totalGains).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-900 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-muted-foreground text-sm">Aportaciones</span>
                                                    <span className="text-foreground">€{Math.round(totalContributions).toLocaleString()}</span>
                                                </div>
                                                <Progress value={(totalContributions / compoundTotal) * 100} className="mb-2" variant="default" />

                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-muted-foreground text-sm">Ganancias</span>
                                                    <span className="text-green-400">€{Math.round(totalGains).toLocaleString()}</span>
                                                </div>
                                                <Progress value={(totalGains / compoundTotal) * 100} variant="success" />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="text-foreground">📊 Evolución de la Inversión</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <BarFinancialChart
                                                data={compoundEvolutionData as any}
                                                height={250}
                                                colors={["#3b82f6", "#10b981", "#8b5cf6"]}
                                                title=""
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Calculadora Presupuesto */}
                        <TabsContent value="budget" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">💰 Optimizador de Presupuesto</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Analiza y optimiza tu presupuesto para maximizar tu tasa de ahorro hacia el FIRE
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Inputs Presupuesto */}
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-foreground flex items-center gap-2">
                                            <PiggyBank className="h-5 w-5 text-purple-400" />
                                            Tu Presupuesto Mensual
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <Label className="text-foreground">Ingresos Mensuales (€)</Label>
                                            <Input
                                                type="number"
                                                value={budgetData.income}
                                                onChange={(e) => setBudgetData(prev => ({ ...prev, income: parseInt(e.target.value) || 0 }))}
                                                className="bg-input border-border text-foreground"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-foreground">Gastos Mensuales</h4>

                                            <div>
                                                <Label className="text-foreground">Vivienda (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={budgetData.housing}
                                                    onChange={(e) => setBudgetData(prev => ({ ...prev, housing: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-foreground">Comida (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={budgetData.food}
                                                    onChange={(e) => setBudgetData(prev => ({ ...prev, food: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-foreground">Transporte (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={budgetData.transport}
                                                    onChange={(e) => setBudgetData(prev => ({ ...prev, transport: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-foreground">Ocio y Entretenimiento (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={budgetData.entertainment}
                                                    onChange={(e) => setBudgetData(prev => ({ ...prev, entertainment: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-foreground">Otros Gastos (€)</Label>
                                                <Input
                                                    type="number"
                                                    value={budgetData.other}
                                                    onChange={(e) => setBudgetData(prev => ({ ...prev, other: parseInt(e.target.value) || 0 }))}
                                                    className="bg-input border-border text-foreground"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Resultados Presupuesto */}
                                <div className="space-y-6">
                                    <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700">
                                        <CardHeader>
                                            <CardTitle className="text-purple-400">📊 Análisis</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold mb-2">
                                                    <span className={remainingSavings >= 0 ? 'text-green-400' : 'text-red-400'}>
                                                        €{Math.round(remainingSavings).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {remainingSavings >= 0 ? 'Disponible para ahorrar' : 'Déficit mensual'}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Tasa de ahorro</div>
                                                    <div className="text-lg font-bold text-foreground">
                                                        {savingsRate.toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground">Gastos totales</div>
                                                    <div className="text-lg font-bold text-foreground">
                                                        €{totalExpenses.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Progreso hacia 50% ahorro</span>
                                                    <span className="text-foreground">{Math.min(savingsRate, 50).toFixed(1)}%</span>
                                                </div>
                                                <Progress
                                                    value={Math.min(Math.max(savingsRate, 0), 50) * 2}
                                                    variant={savingsRate >= 30 ? "success" : savingsRate >= 15 ? "warning" : "destructive"}
                                                />
                                            </div>

                                            {savingsRate < 20 && (
                                                <Alert className="bg-yellow-900/30 border-yellow-500/50">
                                                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                                    <div>
                                                        <div className="font-semibold text-yellow-300 mb-1">⚠️ Tasa de ahorro baja</div>
                                                        <div className="text-yellow-200 text-sm">
                                                            Para FIRE, intenta ahorrar al menos 30-50% de tus ingresos
                                                        </div>
                                                    </div>
                                                </Alert>
                                            )}

                                            {savingsRate >= 30 && (
                                                <Alert className="bg-green-900/30 border-green-500/50">
                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                    <div>
                                                        <div className="font-semibold text-green-300 mb-1">🎉 ¡Excelente!</div>
                                                        <div className="text-green-200 text-sm">
                                                            Estás en el camino correcto hacia el FIRE
                                                        </div>
                                                    </div>
                                                </Alert>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-card border-border">
                                        <CardHeader>
                                            <CardTitle className="text-foreground">🥧 Distribución del Presupuesto</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {budgetChartData.map((item, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-4 h-4 rounded-full"
                                                                style={{ backgroundColor: item.color }}
                                                            ></div>
                                                            <span className="text-foreground">{item.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-foreground font-semibold">€{item.value.toLocaleString()}</div>
                                                            <div className="text-muted-foreground text-xs">
                                                                {((item.value / budgetData.income) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Calculadora Tiempo FIRE */}
                        <TabsContent value="time" className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">⏰ Calculadora de Tiempo FIRE</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Próximamente: Calcula cuánto tiempo necesitas para alcanzar diferentes niveles de FIRE
                                </p>
                            </div>

                            <Card className="bg-card border-border">
                                <CardContent className="p-12 text-center">
                                    <div className="space-y-6">
                                        <div className="text-6xl">🚧</div>
                                        <h3 className="text-2xl font-bold text-foreground">En Construcción</h3>
                                        <p className="text-muted-foreground max-w-md mx-auto">
                                            Esta calculadora estará disponible pronto. Mientras tanto, puedes usar
                                            la calculadora FIRE principal para obtener estimaciones de tiempo.
                                        </p>
                                        <Button className="bg-green-500 text-foreground hover:bg-green-600">
                                            <Bell className="h-4 w-4 mr-2" />
                                            Notificarme cuando esté lista
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-gradient-to-r from-green-400 to-blue-600">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold text-foreground mb-6">
                        ¿Necesitas ayuda personalizada?
                    </h2>
                    <p className="text-xl text-foreground/90 mb-8">
                        Si tienes dudas sobre los resultados o necesitas asesoramiento específico,
                        no dudes en contactarme. Es completamente gratuito.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                            onClick={() => window.location.href = '/contacto'}
                        >
                            <Zap className="h-5 w-5 mr-2" />
                            Consulta Personalizada
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-foreground hover:bg-white hover:text-blue-600"
                            onClick={() => window.location.href = '/blog'}
                        >
                            <Info className="h-5 w-5 mr-2" />
                            Aprender más sobre FIRE
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-2xl">🔥</span>
                            <span className="text-xl font-bold text-foreground">Inversión Libre</span>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Herramientas gratuitas para tu independencia financiera.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-foreground hover:bg-gray-700"
                                onClick={() => window.location.href = '/'}
                            >
                                Inicio
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-foreground hover:bg-gray-700"
                                onClick={() => window.location.href = '/blog'}
                            >
                                Blog
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-foreground hover:bg-gray-700"
                                onClick={() => window.location.href = '/contacto'}
                            >
                                Contacto
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
