'use client'

import { Navigation } from "@/components/ui/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Share2, ThumbsUp, Flame, Zap, Target, BookOpen } from "lucide-react"
import Link from "next/link"

export default function QueEsFirePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            
            <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
                <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-500 mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Volver al Blog
                </Link>

                <article className="space-y-12">
                    <header className="space-y-6">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                            Conceptos Básicos
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                            ¿Qué es el movimiento FIRE? El camino a la libertad financiera
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">FP</div>
                                <span>Por Francisco Palero</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>8 min de lectura</span>
                            </div>
                        </div>
                    </header>

                    <div className="prose prose-invert max-w-none space-y-8 text-lg text-muted-foreground leading-relaxed">
                        <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2 bg-emerald-500/5 rounded-r-xl">
                            "FIRE no se trata de jubilarse para no hacer nada; se trata de jubilarse para poder hacer CUALQUIER COSA".
                        </p>

                        <p>
                            El movimiento **FIRE** (Financial Independence, Retire Early) es mucho más que una tendencia financiera de Silicon Valley. Es una respuesta a la cultura del consumo excesivo y una guía para recuperar el recurso más valioso que tenemos: **nuestro tiempo**.
                        </p>

                        <h2 className="text-3xl font-black text-foreground pt-8 flex items-center gap-3">
                            <Zap className="h-7 w-7 text-emerald-500" />
                            El motor: La Tasa de Ahorro
                        </h2>
                        <p>
                            En el mundo de las finanzas personales tradicionales, se nos dice que ahorrar un 10% es suficiente. En el mundo FIRE, eso no es suficiente si quieres recuperar décadas de tu vida. La clave es la brecha entre lo que ganas y lo que gastas.
                        </p>
                        <p>
                            Si ahorras el 50% de tus ingresos, por cada año trabajado compras un año de libertad futura. Si ahorras el 70%, por cada año trabajado compras dos años y medio de libertad. Las matemáticas son implacables.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                            <div className="p-6 rounded-3xl bg-muted/50 border border-border">
                                <h4 className="font-bold text-foreground mb-2">Mentalidad FIRE</h4>
                                <p className="text-sm">Consumo consciente, optimización de gastos fijos y enfoque en la felicidad no material.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-muted/50 border border-border">
                                <h4 className="font-bold text-foreground mb-2">Mecánica FIRE</h4>
                                <p className="text-sm">Inversión en activos productivos (Fondos Indexados, Inmuebles) y reinversión del interés compuesto.</p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-foreground pt-8 flex items-center gap-3">
                            <Target className="h-7 w-7 text-emerald-500" />
                            ¿Cuál es la meta?
                        </h2>
                        <p>
                            La meta no es un número arbitrario. La meta es alcanzar un patrimonio que, invertido con prudencia, genere suficientes ingresos pasivos para cubrir tus gastos anuales para siempre. Esto suele identificarse con la **Regla del 4%**.
                        </p>

                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 mt-12">
                            <h3 className="text-2xl font-black text-foreground mb-4">¿Estás listo para empezar?</h3>
                            <p className="text-base mb-6 text-muted-foreground">La libertad financiera empieza por conocer tu situación actual. Usa nuestra herramienta de simulación para proyectar tu futuro.</p>
                            <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-black px-8 rounded-2xl">
                                <Link href="/calculadoras">Descubrir mi Número FIRE</Link>
                            </Button>
                        </div>
                    </div>

                    <footer className="pt-8 border-t border-border flex justify-between items-center">
                        <div className="flex gap-4">
                            <Button variant="outline" size="sm" className="rounded-full">
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Excelente (432)
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
