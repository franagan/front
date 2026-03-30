'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CircularProgress } from "@/components/ui/progress"
import {
    Calculator,
    ArrowRight,
    Youtube,
    CheckCircle,
    Shield,
    Globe
} from "lucide-react"
import { useTranslations } from 'next-intl'
import { useToast, toast } from "@/components/ui/toast"


export default function HeroSection() {
    const t = useTranslations('home');
    const { addToast } = useToast()

    const scrollToCalculator = () => {
        document.getElementById('fire-calculator')?.scrollIntoView({ behavior: 'smooth' })
        addToast(toast.info("¡Genial!", "Calcula tu FIRE ahora"))
    }

    return (
        <section className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_hsl(var(--primary))_0%,_transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_hsl(var(--primary))_0%,_transparent_50%)]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Hero Content */}
                    <div className="space-y-8">
                        <div className="space-y-4" suppressHydrationWarning>
                            <Badge suppressHydrationWarning className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/30 px-4 py-1 text-sm font-medium">
                                ✨ {t('hero.badge')}
                            </Badge>
                            <h1 suppressHydrationWarning className="flex flex-wrap gap-x-3 text-5xl xl:text-6xl font-bold leading-tight">
                                <span>{t('hero.title')}</span>
                                <span className="text-yellow-500 tracking-normal drop-shadow-sm">
                                    {t('hero.titleHighlight')}
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                                {t('hero.subtitle')}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">500K+</div>
                                <div className="text-sm text-muted-foreground">{t('stats.users')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">25</div>
                                <div className="text-sm text-muted-foreground">{t('stats.countries')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">15%</div>
                                <div className="text-sm text-muted-foreground">{t('stats.performance')}</div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 px-8 h-14 text-lg rounded-full group"
                                onClick={scrollToCalculator}
                            >
                                <Calculator className="h-5 w-5 mr-2" />
                                {t('hero.cta')}
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                className="border-primary/50 text-primary hover:bg-primary/10 h-14 px-8 text-lg rounded-full flex items-center gap-2"
                                onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                aria-label="Visitar canal de YouTube de Inversión Libre"
                            >
                                <Youtube className="h-5 w-5" />
                                {t('hero.ctaSecondary')}
                            </Button>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {t('hero.benefits.free')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" />
                                {t('hero.benefits.proven')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-purple-500" />
                                {t('hero.benefits.community')}
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative animate-in zoom-in duration-1000 delay-200">
                        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
                        <div className="relative bg-card/50 backdrop-blur-xl rounded-2xl p-8 border border-primary/20 shadow-2xl">
                            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                                {t('hero.preview.badge')}
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                                    <h3 className="text-xl font-bold tracking-normal">{t('hero.preview.title')}</h3>
                                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{t('hero.preview.status')}</Badge>
                                </div>

                                <div className="flex justify-center py-4">
                                    <CircularProgress
                                        value={75}
                                        size={180}
                                        variant="fire"
                                        label={t('hero.preview.label')}
                                        showValue
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                        <div className="text-xl font-bold text-primary">€350K</div>
                                        <div className="text-muted-foreground">{t('hero.preview.current')}</div>
                                    </div>
                                    <div className="bg-muted p-4 rounded-xl border border-border">
                                        <div className="text-xl font-bold text-foreground">€500K</div>
                                        <div className="text-muted-foreground">{t('hero.preview.target')}</div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <div className="text-lg font-bold text-green-500">8 años</div>
                                        <div className="text-xs text-muted-foreground">{t('hero.preview.remaining')}</div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <div className="text-lg font-bold text-blue-500">€2.100/mes</div>
                                        <div className="text-xs text-muted-foreground">{t('hero.preview.needed')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
