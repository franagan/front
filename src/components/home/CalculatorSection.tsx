'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircularProgress } from "@/components/ui/progress"
import { LineFinancialChart } from "@/components/ui/chart"
import {
    Target,
    BarChart3,
    PiggyBank
} from "lucide-react"
import { useTranslations } from 'next-intl'
import { useFireCalculator } from "@/hooks/useFireCalculator"

export default function CalculatorSection() {
    const t = useTranslations('home');

    const {
        fireData,
        updateField,
        monthlyDifference,
        yearsToFire,
        requiredAmount,
        projectedAmount,
        fireProgress,
        chartData
    } = useFireCalculator({
        currentAge: 30,
        targetAge: 50,
        currentSavings: 15000,
        monthlyIncome: 3000,
        monthlyExpenses: 2000,
        expectedReturn: 7
    })

    return (
        <section id="fire-calculator" className="py-24 bg-muted/50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 tracking-normal">
                        🔥 {t('features.calculator.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        {t('features.calculator.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Input Panel */}
                    <Card className="bg-card border-border shadow-xl">
                        <CardHeader className="border-b border-border/50">
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                {t('features.calculator.configTitle')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('features.calculator.labels.currentAge')}</Label>
                                    <Input
                                        type="number"
                                        value={fireData.currentAge}
                                        onChange={(e) => updateField('currentAge', parseInt(e.target.value) || 0)}
                                        className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('features.calculator.labels.targetAge')}</Label>
                                    <Input
                                        type="number"
                                        value={fireData.targetAge}
                                        onChange={(e) => updateField('targetAge', parseInt(e.target.value) || 0)}
                                        className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('features.calculator.labels.currentSavings')}</Label>
                                <Input
                                    type="number"
                                    value={fireData.currentSavings}
                                    onChange={(e) => updateField('currentSavings', parseInt(e.target.value) || 0)}
                                    className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('features.calculator.labels.monthlyIncome')}</Label>
                                    <Input
                                        type="number"
                                        value={fireData.monthlyIncome}
                                        onChange={(e) => updateField('monthlyIncome', parseInt(e.target.value) || 0)}
                                        className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">{t('features.calculator.labels.monthlyExpenses')}</Label>
                                    <Input
                                        type="number"
                                        value={fireData.monthlyExpenses}
                                        onChange={(e) => updateField('monthlyExpenses', parseInt(e.target.value) || 0)}
                                        className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">{t('features.calculator.labels.expectedReturn')} (%)</Label>
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={fireData.expectedReturn}
                                    onChange={(e) => updateField('expectedReturn', parseFloat(e.target.value) || 0)}
                                    className="bg-muted/50 border-border focus:ring-primary h-12 text-lg"
                                />
                            </div>

                            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 shadow-inner">
                                <div className="flex items-center gap-2 text-primary mb-2">
                                    <PiggyBank className="h-5 w-5" />
                                    <span className="font-bold text-lg">{t('features.calculator.monthlySavings')}</span>
                                </div>
                                <div className="text-3xl font-black text-primary">
                                    €{monthlyDifference.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {monthlyDifference > 0 ? t('features.calculator.feedback.good') : t('features.calculator.feedback.bad')}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <div className="space-y-6">

                        {/* FIRE Progress */}
                        <Card className="bg-gradient-to-br from-card to-muted border-border shadow-xl">
                            <CardHeader className="border-b border-border/50 text-center">
                                <CardTitle className="text-2xl font-bold">
                                    🔥 {t('features.calculator.progressTitle')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="flex justify-center mb-10">
                                    <CircularProgress
                                        value={fireProgress}
                                        size={220}
                                        variant="fire"
                                        label={t('features.calculator.progressLabel')}
                                        showValue
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-center">
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('features.calculator.results.projected')}</div>
                                        <div className="text-2xl font-bold text-primary">
                                            €{Math.round(projectedAmount).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('features.calculator.results.target')}</div>
                                        <div className="text-2xl font-bold">
                                            €{Math.round(requiredAmount).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('features.calculator.results.years')}</div>
                                        <div className="text-2xl font-bold text-green-500">
                                            {yearsToFire} años
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t('features.calculator.results.passive')}</div>
                                        <div className="text-2xl font-bold text-blue-500">
                                            €{Math.round(fireData.monthlyExpenses).toLocaleString()}/mes
                                        </div>
                                    </div>
                                </div>

                                {fireProgress >= 100 && (
                                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
                                        <div className="text-green-500 font-bold text-lg">🎉 {t('features.calculator.success.title')}</div>
                                        <div className="text-sm text-green-500/80">{t('features.calculator.success.subtitle')}</div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Evolution Chart */}
                        <Card className="bg-card border-border shadow-xl">
                            <CardHeader className="border-b border-border/50">
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-500" />
                                    {t('features.calculator.chartTitle')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <LineFinancialChart
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    data={chartData as any}
                                    height={280}
                                    colors={["hsl(var(--primary))", "hsl(var(--destructive))"]}
                                    title=""
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
