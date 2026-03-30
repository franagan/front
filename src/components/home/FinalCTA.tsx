'use client'

import { Button } from "@/components/ui/button"
import { Calculator, Youtube, CheckCircle, Shield, Clock } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function FinalCTA() {
    const t = useTranslations('home');

    const scrollToCalculator = () => {
        document.getElementById('fire-calculator')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-primary/5 border-y border-primary/10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="max-w-4xl mx-auto px-8 relative text-center space-y-12">
                <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('cta.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-10 h-16 text-lg rounded-full shadow-xl hover:shadow-primary/20 transition-all hover:scale-105"
                        onClick={scrollToCalculator}
                    >
                        <Calculator className="h-6 w-6 mr-3" />
                        {t('cta.button')}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="border-primary/50 text-primary hover:bg-primary/10 font-bold px-10 h-16 text-lg rounded-full"
                        onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                        aria-label="Visitar canal de YouTube"
                    >
                        <Youtube className="h-6 w-6 mr-3" />
                        {t('cta.youtube')}
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-4">
                    <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <div className="bg-green-500/10 p-2 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        {t('cta.benefits.noRegister')}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Shield className="h-5 w-5 text-blue-500" />
                        </div>
                        {t('cta.benefits.free')}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        <div className="bg-orange-500/10 p-2 rounded-lg">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        {t('cta.benefits.fast')}
                    </div>
                </div>
            </div>
        </section>
    )
}
