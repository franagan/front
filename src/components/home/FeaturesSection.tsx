'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Calculator,
    BookOpen,
    Plane,
    Users,
    Youtube,
    Shield
} from "lucide-react"
import { useTranslations } from 'next-intl'

export default function FeaturesSection() {
    const t = useTranslations('home');

    const features = [
        {
            icon: Calculator,
            title: t('features.calculator.title'),
            description: t('features.calculator.description'),
            color: "yellow",
            btn: "Explorar"
        },
        {
            icon: BookOpen,
            title: t('features.blog.title'),
            description: t('features.blog.description'),
            color: "green",
            btn: "Aprender"
        },
        {
            icon: Plane,
            title: t('features.nomad.title'),
            description: t('features.nomad.description'),
            color: "blue",
            btn: t('features.nomad.button')
        },
        {
            icon: Users,
            title: t('features.community.title'),
            description: t('features.community.description'),
            color: "purple",
            btn: t('features.community.button')
        },
        {
            icon: Youtube,
            title: t('features.youtube.title'),
            description: t('features.youtube.description'),
            color: "red",
            btn: t('features.youtube.button'),
            action: () => window.open('https://www.youtube.com/@InversionLibre', '_blank')
        },
        {
            icon: Shield,
            title: t('features.proven.title'),
            description: t('features.proven.description'),
            color: "orange",
            btn: t('features.proven.button')
        }
    ]

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        {t('features.title')}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('features.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, idx) => (
                        <Card key={idx} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-10 text-center space-y-6">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg bg-${feature.color}-400/10`}>
                                    <feature.icon className={`h-10 w-10 text-${feature.color}-500`} />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                                <Button
                                    variant="outline"
                                    className={`mt-4 border-${feature.color}-400/50 text-${feature.color}-500 hover:bg-${feature.color}-500 hover:text-white rounded-full px-8 h-12 font-semibold`}
                                    onClick={feature.action}
                                >
                                    {feature.btn}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
