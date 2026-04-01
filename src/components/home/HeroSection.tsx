'use client'

import { Button } from "@/components/ui/button"
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
        // @ts-ignore
        addToast(toast.info(t('hero.toast?.success') || "¡Genial!", t('hero.toast?.message') || "Calcula tu FIRE ahora"))
    }

    return (
        <section className="relative overflow-hidden px-8 py-20 md:py-32 bg-background flex flex-col justify-center min-h-[calc(100vh-6rem)]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Text Content Block */}
                <div className="z-10 animate-in fade-in slide-in-from-left duration-1000">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                        {t('hero.badge')}
                    </span>
                    
                    <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tighter mb-8" suppressHydrationWarning>
                        {t('hero.title')} <br/><span className="text-transparent bg-clip-text liquid-gold-gradient">{t('hero.titleHighlight')}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                        {t('hero.subtitle')}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                        <button 
                            className="liquid-gold-gradient text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-2 group"
                            onClick={scrollToCalculator}
                        >
                            <Calculator className="w-5 h-5" />
                            {t('hero.cta')}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            className="bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-accent/80 transition-colors flex items-center gap-2"
                            onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                        >
                            <Youtube className="w-5 h-5 text-red-500" />
                            {t('hero.ctaSecondary')}
                        </button>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium mt-10 flex-wrap">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-tertiary" />
                            {t('hero.benefits.free')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-tertiary" />
                            {t('hero.benefits.proven')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-tertiary" />
                            {t('hero.benefits.community')}
                        </div>
                    </div>
                </div>

                {/* Premium Freedom Meter Visual Block */}
                <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125 -z-10 hidden dark:block"></div>
                    <div className="bg-card text-card-foreground p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-black/5 dark:border-white/10">
                        
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="font-headline text-2xl font-bold text-foreground">{t('hero.preview.title')}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-muted-foreground text-sm">{t('hero.preview.status')}</p>
                                </div>
                            </div>
                            <div className="bg-green-500/20 p-2 rounded-xl text-green-600 dark:text-green-400 flex items-center justify-center">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-4 relative">
                            {/* Decorative concentric circles */}
                            <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-full scale-125"></div>
                            <div className="absolute inset-0 border border-black/5 dark:border-white/10 rounded-full scale-110"></div>
                            
                            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full freedom-meter-ring shadow-inner">
                                <div className="absolute inset-3 bg-card rounded-full shadow-lg flex flex-col items-center justify-center text-center">
                                    <span className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-foreground">65%</span>
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mt-1 tracking-widest text-slate-400">Libertad Alcanzada</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 grid grid-cols-2 gap-6">
                            <div className="bg-muted p-4 md:p-6 rounded-3xl hover:bg-muted/80 transition-colors cursor-default">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">{t('hero.preview.current')}</p>
                                <p className="text-2xl md:text-3xl font-black font-headline text-foreground">€350K</p>
                                <p className="text-xs font-semibold mt-2 text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2.4%
                                </p>
                            </div>
                            <div className="bg-muted p-4 md:p-6 rounded-3xl hover:bg-muted/80 transition-colors cursor-default">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">{t('hero.preview.target')}</p>
                                <div className="flex items-center gap-2">
                                     <p className="text-2xl md:text-3xl font-black font-headline text-foreground">€500K</p>
                                </div>
                                <p className="text-xs font-semibold mt-2 text-primary flex items-center gap-1">
                                    Meta final
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating Data Pill */}
                    <div className="absolute -bottom-6 -left-6 bg-card text-card-foreground p-4 rounded-2xl shadow-xl border border-black/5 dark:border-white/10 items-center gap-4 hidden lg:flex animate-bounce origin-bottom hover:scale-105 transition-transform" style={{ animationDuration: '3s' }}>
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 dark:bg-amber-500/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">trending_up</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Proyección FIRE</p>
                            <p className="text-sm font-bold text-foreground">Retiro en 8.4 años</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

