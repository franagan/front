'use client'

import { Navigation } from "@/components/ui/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Calendar, 
    Clock, 
    ChevronLeft, 
    Share2, 
    ThumbsUp, 
    Scale,
    Flame,
    Zap,
    Coffee,
    Pizza,
    Plane
} from "lucide-react"
import Link from "next/link"

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="max-w-4xl mx-auto px-4 pt-12 pb-24">
                <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Volver al blog
                </Link>

                <header className="space-y-6 mb-12">
                    <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-3 py-1">
                        Estrategia & Estilo de Vida
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Los diferentes tipos de FIRE: De la austeridad al lujo
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-500">FP</div>
                            <span>Francisco Palero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>10 de Enero, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>6 min de lectura</span>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-orange-500 pl-6 py-2 bg-orange-500/5 rounded-r-xl">
                        "La libertad financiera no es una talla única. Dependiendo de cuánto necesites para ser feliz, tu camino hacia el FIRE será radicalmente distinto."
                    </p>

                    <p>
                        El movimiento FIRE ha evolucionado. Lo que empezó como un grupo de personas ultra-ahorradoras, se ha convertido en una malla de diferentes filosofías adaptadas a cada tipo de persona. No es lo mismo retirarse en una furgoneta que en un ático en Manhattan.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">1. Lean FIRE: El minimalista</h2>
                    <p>
                        El **Lean FIRE** es para aquellos que han abrazado el minimalismo. El objetivo es cubrir solo los gastos básicos del día a día. 
                    </p>
                    <div className="bg-muted p-6 rounded-2xl border border-border flex gap-4">
                        <Coffee className="h-6 w-6 text-blue-400 shrink-0" />
                        <div>
                            <span className="font-bold text-foreground">Perfil:</span> Gastos anuales menores a 25.000€. Requiere un patrimonio de unos 500.000€ o menos. Es la forma más rápida de alcanzar la independencia, pero requiere una disciplina de gasto férrea.
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">2. Regular FIRE: El equilibrio</h2>
                    <p>
                        Es el estándar. Permite mantener un estilo de vida de clase media sin grandes lujos pero sin privaciones extremas. 
                    </p>
                    <div className="bg-muted p-6 rounded-2xl border border-border flex gap-4">
                        <Pizza className="h-6 w-6 text-orange-400 shrink-0" />
                        <div>
                            <span className="font-bold text-foreground">Perfil:</span> Gastos anuales entre 40.000€ y 60.000€. Requiere una cartera de entre 1M€ y 1.5M€. Permite salir a cenar, viajar anualmente y tener un hogar confortable.
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">3. Fat FIRE: El retiro de lujo</h2>
                    <p>
                        ¿Quieres retirarte sin mirar la cuenta en el restaurante? ¿Quieres primera clase y hoteles de 5 estrellas? Entonces buscas el **Fat FIRE**.
                    </p>
                    <div className="bg-muted p-6 rounded-2xl border border-border flex gap-4">
                        <Plane className="h-6 w-6 text-purple-400 shrink-0" />
                        <div>
                            <span className="font-bold text-foreground">Perfil:</span> Gastos de más de 100.000€ anuales. Patrimonio superior a los 2.5M€. Este camino requiere ingresos muy altos o décadas de inversión constante, pero ofrece libertad absoluta.
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">4. Coast FIRE: El retiro psicológico</h2>
                    <p>
                        Este es mi favorito. El **Coast FIRE** sucede cuando ya has ahorrado lo suficiente para que, aunque no añadas ni un euro más, el interés compuesto haga que llegues a tu cifra de retiro a los 65 años.
                    </p>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 my-10 flex gap-4">
                        <Zap className="h-6 w-6 text-emerald-500 shrink-0" />
                        <div>
                            <h4 className="text-emerald-500 font-black mb-2 uppercase text-sm">La Magia del Tiempo</h4>
                            <p className="text-sm">
                                Una vez eres Coast FIRE, puedes dejar un trabajo estresante y buscar uno que te apasione, aunque ganes menos, porque ya no necesitas ahorrar para el futuro. Solo necesitas cubrir tus gastos del presente.
                            </p>
                        </div>
                    </div>

                    <p>
                        **¿Cuál es el tuyo?** Lo importante es empezar a caminar. Puedes empezar buscando el Lean FIRE y, a medida que tus ingresos crezcan, decidir si quieres subir de nivel.
                    </p>
                </div>

                <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full text-foreground">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Interesante (189)
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    )
}
