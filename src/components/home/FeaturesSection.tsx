'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

export default function FeaturesSection() {
    const t = useTranslations('home');

    const features = [
        {
            icon: "calculate",
            title: t('features.calculator.title'),
            description: t('features.calculator.description'),
            colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
            btn: "Explorar"
        },
        {
            icon: "menu_book",
            title: t('features.blog.title'),
            description: t('features.blog.description'),
            colorClass: "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300",
            btn: "Aprender"
        },
        {
            icon: "flight_takeoff",
            title: t('features.nomad.title'),
            description: t('features.nomad.description'),
            colorClass: "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
            btn: t('features.nomad.button')
        },
        {
            icon: "groups",
            title: t('features.community.title'),
            description: t('features.community.description'),
            colorClass: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
            btn: t('features.community.button')
        },
        {
            icon: "smart_display",
            title: t('features.youtube.title'),
            description: t('features.youtube.description'),
            colorClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            btn: t('features.youtube.button'),
            action: () => window.open('https://www.youtube.com/@InversionLibre', '_blank')
        },
        {
            icon: "verified_user",
            title: t('features.proven.title'),
            description: t('features.proven.description'),
            colorClass: "bg-primary text-primary-foreground",
            btn: t('features.proven.button')
        }
    ]

    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-8">
                <div className="mb-16 text-center">
                    <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                        {t('features.title')}
                    </h2>
                    <div className="h-1.5 w-24 liquid-gold-gradient mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                         <div key={idx} className="bg-card text-card-foreground p-8 md:p-10 rounded-[2rem] hover:shadow-2xl transition-all duration-300 border border-black/5 dark:border-white/10 group hover:-translate-y-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-sm ${feature.colorClass}`}>
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                            </div>
                            <h3 className="text-2xl font-bold font-headline tracking-tight mb-4 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm mb-8">
                                {feature.description}
                            </p>
                            <button
                                className="font-bold text-sm tracking-wide text-primary hover:text-primary/80 transition-colors uppercase flex items-center gap-2 group/btn"
                                onClick={feature.action}
                            >
                                {feature.btn}
                                <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
