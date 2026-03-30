'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Star, Map, Zap, Users } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function TestimonialsSection() {
    const t = useTranslations('home');

    const testimonials = [
        {
            initial: "M",
            name: "María, 34",
            role: t('testimonials.items.maria.role'),
            quote: t('testimonials.items.maria.quote'),
            fire: "€420K",
            reach: "15 países",
            icon: Map,
            iconCol: "blue"
        },
        {
            initial: "J",
            name: "Javier, 29",
            role: t('testimonials.items.javier.role'),
            quote: t('testimonials.items.javier.quote'),
            fire: "€380K",
            reach: "Startup €1M",
            icon: Zap,
            iconCol: "green"
        },
        {
            initial: "L",
            name: "Laura & Pablo",
            role: t('testimonials.items.laura.role'),
            quote: t('testimonials.items.laura.quote'),
            fire: "€650K",
            reach: "Familia de 4",
            icon: Users,
            iconCol: "purple"
        }
    ];

    return (
        <section className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('testimonials.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {testimonials.map((item, idx) => (
                        <Card key={idx} className="bg-card border-border hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="p-10 space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="bg-gradient-to-br from-primary to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                                        <span className="text-primary-foreground text-2xl font-black">{item.initial}</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl text-foreground">{item.name}</div>
                                        <div className="text-sm font-medium text-primary uppercase tracking-tighter">{item.role}</div>
                                    </div>
                                </div>
                                <p className="text-lg text-muted-foreground italic leading-relaxed">
                                    &quot;{item.quote}&quot;
                                </p>
                                <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-bold text-primary">FIRE: {item.fire}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <item.icon className={`h-5 w-5 text-${item.iconCol}-500`} />
                                        <span className={`text-sm font-bold text-${item.iconCol}-500`}>{item.reach}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
