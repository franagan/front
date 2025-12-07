'use client'

import { useState, useEffect } from 'react'
import { Navigation } from "@/components/ui/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress, CircularProgress } from "@/components/ui/progress"
import { LineFinancialChart } from "@/components/ui/chart"
import { useToast, toast } from "@/components/ui/toast"
import {
    Target,
    TrendingUp,
    DollarSign,
    Globe,
    Users,
    Youtube,
    Calculator,
    BookOpen,
    Zap,
    Shield,
    Clock,
    ArrowRight,
    CheckCircle,
    Star,
    Award,
    Compass,
    PiggyBank,
    Plane,
    ChevronRight,
    BarChart3,
    Map,
    Coffee,
    Wallet
} from "lucide-react"
import { useTranslations } from 'next-intl';

export default function LandingPage() {
    const t = useTranslations('home');
    const { addToast } = useToast()

    // Estados para la calculadora FIRE
    const [fireData, setFireData] = useState({
        currentAge: 30,
        targetAge: 50,
        currentSavings: 15000,
        monthlyIncome: 3000,
        monthlyExpenses: 2000,
        expectedReturn: 7
    })

    // Cálculos FIRE
    const monthlyDifference = fireData.monthlyIncome - fireData.monthlyExpenses
    const yearsToFire = fireData.targetAge - fireData.currentAge
    const requiredAmount = fireData.monthlyExpenses * 12 * 25 // Regla del 4%
    const projectedAmount = fireData.currentSavings * Math.pow(1 + fireData.expectedReturn / 100, yearsToFire) +
        (monthlyDifference * 12 * (Math.pow(1 + fireData.expectedReturn / 100, yearsToFire) - 1) / (fireData.expectedReturn / 100))
    const fireProgress = Math.min((projectedAmount / requiredAmount) * 100, 100)

    // Datos para el gráfico de evolución
    const chartData = []
    for (let year = 0; year <= yearsToFire; year++) {
        const amount = fireData.currentSavings * Math.pow(1 + fireData.expectedReturn / 100, year) +
            (monthlyDifference * 12 * (year > 0 ? (Math.pow(1 + fireData.expectedReturn / 100, year) - 1) / (fireData.expectedReturn / 100) : 0))
        chartData.push({
            name: `Año ${fireData.currentAge + year}`,
            patrimonio: Math.round(amount),
            objetivo: requiredAmount
        })
    }

    return (
        <div className="min-h-screen">

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_#fbbf24_0%,_transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_#f59e0b_0%,_transparent_50%)]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Hero Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                                    🔥 Método FIRE + Nomadismo Digital
                                </Badge>
                                <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
                                    {t('hero.title')}
                                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> {t('hero.titleHighlight')}</span>
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {t('hero.subtitle')}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">500K+</div>
                                    <div className="text-sm text-muted-foreground">{t('stats.users')}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">25</div>
                                    <div className="text-sm text-muted-foreground">Países visitados</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">15%</div>
                                    <div className="text-sm text-muted-foreground">Rendimiento anual</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold hover:from-yellow-500 hover:to-yellow-700 flex items-center gap-2"
                                    onClick={() => {
                                        document.getElementById('fire-calculator')?.scrollIntoView({ behavior: 'smooth' })
                                        addToast(toast.info("¡Genial!", "Calcula tu FIRE ahora"))
                                    }}
                                >
                                    <Calculator className="h-5 w-5" />
                                    {t('hero.cta')}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black flex items-center gap-2"
                                    onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                >
                                    <Youtube className="h-5 w-5" />
                                    {t('hero.ctaSecondary')}
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    Gratis para siempre
                                </div>
                                <div className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-blue-400" />
                                    Métodos probados
                                </div>
                                <div className="flex items-center gap-1">
                                    <Globe className="h-4 w-4 text-purple-400" />
                                    Comunidad global
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative">
                            <div className="relative bg-gradient-to-br from-card to-muted rounded-2xl p-8 border border-border">
                                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-sm">
                                    Vista Previa
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">Tu Progreso FIRE</h3>
                                        <Badge className="bg-green-900 text-green-300">En camino</Badge>
                                    </div>

                                    <div className="flex justify-center">
                                        <CircularProgress
                                            value={75}
                                            size={160}
                                            variant="fire"
                                            label="del objetivo"
                                            showValue
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-yellow-400">€350K</div>
                                            <div className="text-muted-foreground">Patrimonio actual</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-foreground">€500K</div>
                                            <div className="text-muted-foreground">Objetivo FIRE</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-400">8 años</div>
                                            <div className="text-muted-foreground">Tiempo restante</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-400">€2.100/mes</div>
                                            <div className="text-muted-foreground">Ahorro necesario</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculadora FIRE Principal */}
            <section id="fire-calculator" className="py-20 bg-muted dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            🔥 {t('features.calculator.title')}
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            {t('features.calculator.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Panel de Entrada */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground flex items-center gap-2">
                                    <Target className="h-5 w-5 text-yellow-400" />
                                    Configura tu Situación
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
                                        <Label className="text-muted-foreground">Edad Objetivo FIRE</Label>
                                        <Input
                                            type="number"
                                            value={fireData.targetAge}
                                            onChange={(e) => setFireData(prev => ({ ...prev, targetAge: parseInt(e.target.value) || 0 }))}
                                            className="bg-input border-border text-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Ahorros Actuales (€)</Label>
                                    <Input
                                        type="number"
                                        value={fireData.currentSavings}
                                        onChange={(e) => setFireData(prev => ({ ...prev, currentSavings: parseInt(e.target.value) || 0 }))}
                                        className="bg-input border-border text-foreground"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Ingresos Mensuales (€)</Label>
                                        <Input
                                            type="number"
                                            value={fireData.monthlyIncome}
                                            onChange={(e) => setFireData(prev => ({ ...prev, monthlyIncome: parseInt(e.target.value) || 0 }))}
                                            className="bg-input border-border text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Gastos Mensuales (€)</Label>
                                        <Input
                                            type="number"
                                            value={fireData.monthlyExpenses}
                                            onChange={(e) => setFireData(prev => ({ ...prev, monthlyExpenses: parseInt(e.target.value) || 0 }))}
                                            className="bg-input border-border text-foreground"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-muted-foreground">Rendimiento Esperado Anual (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={fireData.expectedReturn}
                                        onChange={(e) => setFireData(prev => ({ ...prev, expectedReturn: parseFloat(e.target.value) || 0 }))}
                                        className="bg-input border-border text-foreground"
                                    />
                                </div>

                                <div className="p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg border border-yellow-400/20">
                                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                                        <PiggyBank className="h-4 w-4" />
                                        <span className="font-semibold">Ahorro Mensual</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        €{monthlyDifference.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {monthlyDifference > 0 ? 'Perfecto para FIRE!' : 'Necesitas reducir gastos o aumentar ingresos'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Panel de Resultados */}
                        <div className="space-y-6">

                            {/* Progreso FIRE */}
                            <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-yellow-400/20">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        🔥 Tu Progreso FIRE
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-center mb-6">
                                        <CircularProgress
                                            value={fireProgress}
                                            size={180}
                                            variant="fire"
                                            label="del objetivo FIRE"
                                            showValue
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <div className="text-sm text-muted-foreground">Patrimonio Proyectado</div>
                                            <div className="text-xl font-bold text-yellow-400">
                                                €{Math.round(projectedAmount).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Objetivo FIRE</div>
                                            <div className="text-xl font-bold text-foreground">
                                                €{Math.round(requiredAmount).toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Años hasta FIRE</div>
                                            <div className="text-xl font-bold text-green-400">
                                                {yearsToFire} años
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Ingresos Pasivos</div>
                                            <div className="text-xl font-bold text-blue-400">
                                                €{Math.round(fireData.monthlyExpenses).toLocaleString()}/mes
                                            </div>
                                        </div>
                                    </div>

                                    {fireProgress >= 100 && (
                                        <div className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-center">
                                            <div className="text-green-400 font-semibold">🎉 ¡Felicidades!</div>
                                            <div className="text-sm text-green-300">Ya puedes conseguir tu FIRE</div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Gráfico de Evolución */}
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-blue-400" />
                                        Evolución Patrimonio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <LineFinancialChart
                                        data={chartData as any}
                                        height={250}
                                        colors={["#fbbf24", "#ef4444"]}
                                        title=""
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Características Principales */}
            <section className="py-20 bg-background dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            {t('features.title')}
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            La plataforma más completa para conseguir tu independencia financiera
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Calculator className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">{t('features.calculator.title')}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('features.calculator.description')}
                                </p>
                                <Button variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                                    Explorar
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">{t('features.blog.title')}</h3>
                                <p className="text-muted-foreground mb-6">
                                    {t('features.blog.description')}
                                </p>
                                <Button variant="outline" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                                    Aprender
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Plane className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">Nomadismo Digital</h3>
                                <p className="text-muted-foreground mb-6">
                                    Descubre cómo vivir y trabajar desde cualquier lugar del mundo.
                                </p>
                                <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black">
                                    Viajar
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">Comunidad</h3>
                                <p className="text-muted-foreground mb-6">
                                    Únete a miles de personas en su camino hacia la libertad financiera.
                                </p>
                                <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black">
                                    Conectar
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-red-400 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Youtube className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">Canal YouTube</h3>
                                <p className="text-muted-foreground mb-6">
                                    Contenido semanal sobre FIRE, inversiones y nomadismo digital.
                                </p>
                                <Button
                                    variant="outline"
                                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                                    onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                >
                                    Suscribirse
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:border-yellow-400/50 transition-colors">
                            <CardContent className="p-8 text-center">
                                <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="h-8 w-8 text-black" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-4">Métodos Probados</h3>
                                <p className="text-muted-foreground mb-6">
                                    Estrategias que funcionan en el mundo real, basadas en experiencia.
                                </p>
                                <Button variant="outline" className="border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black">
                                    Conocer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonios/Casos de Éxito */}
            <section className="py-20 bg-muted dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            {t('testimonials.title')}
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Personas reales que han conseguido su FIRE siguiendo el método
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <Card className="bg-card border-border">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <span className="text-black font-bold">M</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">María, 34 años</div>
                                        <div className="text-sm text-muted-foreground">Desarrolladora → Nómada</div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-6 italic">
                                    "Conseguí mi FIRE en 8 años ahorrando el 60% de mis ingresos.
                                    Ahora trabajo desde Bali 4 horas al día."
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span className="text-yellow-400">FIRE: €420K</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Map className="h-4 w-4 text-blue-400" />
                                        <span className="text-blue-400">15 países</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-green-400 to-green-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <span className="text-black font-bold">J</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Javier, 29 años</div>
                                        <div className="text-sm text-gray-400">Consultor → Emprendedor</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6 italic">
                                    "El método FIRE me permitió dejar mi trabajo y montar mi propia startup.
                                    ¡La libertad no tiene precio!"
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span className="text-yellow-400">FIRE: €380K</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Zap className="h-4 w-4 text-green-400" />
                                        <span className="text-green-400">Startup €1M</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                                        <span className="text-black font-bold">L</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">Laura & Pablo</div>
                                        <div className="text-sm text-gray-400">Pareja → Familia FIRE</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-6 italic">
                                    "Con dos niños conseguimos nuestro FIRE familiar. Ahora viajamos
                                    por Europa en autocaravana."
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span className="text-yellow-400">FIRE: €650K</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-purple-400" />
                                        <span className="text-purple-400">Familia de 4</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold text-black mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-black/80 mb-8">
                        {t('cta.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-black text-yellow-400 hover:bg-gray-900 font-semibold"
                            onClick={() => document.getElementById('fire-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Calculator className="h-5 w-5 mr-2" />
                            {t('cta.button')}
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="border-black text-yellow-400 hover:bg-black hover:text-red-400"
                            onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                        >
                            <Youtube className="h-5 w-5 mr-2" />
                            Seguir en YouTube
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-black/60 text-sm">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Sin registro requerido
                        </div>
                        <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            100% Gratis
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Resultados en 2 minutos
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🔥</span>
                                <span className="text-xl font-bold text-foreground">Inversión Libre</span>
                            </div>
                            <p className="text-muted-foreground">
                                Tu camino hacia la independencia financiera y el nomadismo digital.
                            </p>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                >
                                    <Youtube className="h-4 w-4 mr-2" />
                                    YouTube
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-foreground mb-4">Herramientas</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Calculadora FIRE</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Calculadora Interés Compuesto</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Planificador de Gastos</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Tracker de Progreso</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Educación</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Guía FIRE para Principiantes</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Estrategias de Inversión</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Nomadismo Digital</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Casos de Éxito</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Soporte</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="/contacto" className="hover:text-yellow-400 transition-colors">Contacto</a></li>
                                <li><a href="/contacto" className="hover:text-yellow-400 transition-colors">FAQ</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Comunidad</a></li>
                                <li><a href="#" className="hover:text-yellow-400 transition-colors">Política de Privacidad</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
                        <p>&copy; 2024 Inversión Libre. Todos los derechos reservados. Hecho con ❤️ para la comunidad FIRE.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}