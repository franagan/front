'use client'

import { useAuthStore } from "../../../../stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Calculator,
    Target
} from "lucide-react"
import { useTranslations } from 'next-intl'

export default function FireCalculatorPage() {
    const router = useRouter()
    const { user } = useAuthStore()
    const t = useTranslations('fireCalculator')
    const tCommon = useTranslations('common')

    const [currentAge, setCurrentAge] = useState(30)
    const [retirementAge, setRetirementAge] = useState(50)
    const [currentSavings, setCurrentSavings] = useState(50000)
    const [monthlyIncome, setMonthlyIncome] = useState(3500)
    const [monthlyExpenses, setMonthlyExpenses] = useState(2100)
    const [expectedReturn, setExpectedReturn] = useState(7)
    // const [inflationRate, setInflationRate] = useState(2)
    const [withdrawalRate, setWithdrawalRate] = useState(4)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any>(null)

    useEffect(() => {
        if (!user) {
            router.push('/auth/login')
        }
    }, [user, router])

    if (!user) {
        return null
    }

    const calculateFIRE = () => {
        const monthlySavings = monthlyIncome - monthlyExpenses
        const annualExpenses = monthlyExpenses * 12
        const fireNumber = annualExpenses * (100 / withdrawalRate)
        const yearsToRetirement = retirementAge - currentAge
        const monthsToRetirement = yearsToRetirement * 12

        // Cálculo del valor futuro con interés compuesto
        const monthlyRate = expectedReturn / 100 / 12
        let futureValue = currentSavings

        for (let i = 0; i < monthsToRetirement; i++) {
            futureValue = futureValue * (1 + monthlyRate) + monthlySavings
        }

        // Calcular años necesarios para alcanzar FIRE
        let months = 0
        let accumulated = currentSavings
        while (accumulated < fireNumber && months < 600) { // max 50 años
            accumulated = accumulated * (1 + monthlyRate) + monthlySavings
            months++
        }

        const yearsToFire = months / 12
        const fireAge = currentAge + yearsToFire
        const savingsRate = (monthlySavings / monthlyIncome) * 100

        setResults({
            fireNumber,
            yearsToFire: yearsToFire.toFixed(1),
            fireAge: fireAge.toFixed(0),
            monthlySavings,
            savingsRate: savingsRate.toFixed(1),
            futureValue,
            leanFire: fireNumber * 0.7,
            regularFire: fireNumber,
            fatFire: fireNumber * 1.5
        })
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-background/50 dark:bg-neutral-950/80 dark:text-white border-b border-border sticky top-0 z-50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/mainboard')}
                            className="border-border text-foreground hover:bg-accent"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {tCommon('back')}
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{t('title')}</h1>
                            <p className="text-sm text-muted-foreground dark:text-gray-300">{t('subtitle')}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <section>
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-6 w-6 text-yellow-400" />
                                    {t('calculate')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Current Age */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('currentAge')}</label>
                                    <input
                                        type="number"
                                        value={currentAge}
                                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>

                                {/* Retirement Age */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('retirementAge')}</label>
                                    <input
                                        type="number"
                                        value={retirementAge}
                                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    />
                                </div>

                                {/* Current Savings */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('currentSavings')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <input
                                            type="number"
                                            value={currentSavings}
                                            onChange={(e) => setCurrentSavings(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                </div>

                                {/* Monthly Income */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('monthlyIncome')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <input
                                            type="number"
                                            value={monthlyIncome}
                                            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                </div>

                                {/* Monthly Expenses */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('monthlyExpenses')}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <input
                                            type="number"
                                            value={monthlyExpenses}
                                            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    </div>
                                </div>

                                {/* Expected Return */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('expectedReturn')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={expectedReturn}
                                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                    </div>
                                </div>

                                {/* Withdrawal Rate */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">{t('withdrawalRate')}</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={withdrawalRate}
                                            onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                    </div>
                                </div>

                                <Button onClick={calculateFIRE} className="w-full bg-yellow-600 hover:bg-yellow-700">
                                    <Calculator className="h-4 w-4 mr-2" />
                                    {t('calculate')}
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Results */}
                    <section>
                        {results ? (
                            <div className="space-y-6">
                                {/* Main Results */}
                                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 text-black">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="h-6 w-6" />
                                            {t('results')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm opacity-80">{t('fireNumber')}</p>
                                            <p className="text-4xl font-bold">€{results.fireNumber.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm opacity-80">{t('yearsToFire')}</p>
                                                <p className="text-2xl font-bold">{results.yearsToFire}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm opacity-80">{t('fireAge')}</p>
                                                <p className="text-2xl font-bold">{results.fireAge}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Additional Metrics */}
                                <Card className="bg-card border-border">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">{t('monthlySavings')}</span>
                                            <span className="font-semibold text-lg">€{results.monthlySavings.toLocaleString('es-ES')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">{t('savingsRate')}</span>
                                            <span className="font-semibold text-lg">{results.savingsRate}%</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* FIRE Scenarios */}
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle>{t('scenarios')}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">{t('leanFire')}</span>
                                            <span className="font-semibold">€{results.leanFire.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-border">
                                            <span className="text-muted-foreground">{t('regularFire')}</span>
                                            <span className="font-semibold">€{results.regularFire.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">{t('fatFire')}</span>
                                            <span className="font-semibold">€{results.fatFire.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <Card className="bg-card border-border">
                                <CardContent className="p-12 text-center">
                                    <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">{t('calculate')}</h3>
                                    <p className="text-muted-foreground">
                                        Completa el formulario y haz clic en calcular
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}
