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
    TrendingUp,
    PieChart
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
                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 px-3 py-1">
                        Inversión Avanzada
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Dividendos vs Indexados: ¿Cuál es mejor para el FIRE?
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">FP</div>
                            <span>Francisco Palero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>25 de Enero, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>14 min de lectura</span>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/5 rounded-r-xl">
                        ¿Prefieres recibir un cheque cada mes o ver cómo el valor total de tu cartera crece silenciosamente? Este debate ha dividido a la comunidad FIRE durante décadas.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">La Estrategia de Dividendos (DGI)</h2>
                    <p>
                        La inversión en dividendos crecientes (Dividend Growth Investing) se basa en comprar empresas sólidas que reparten beneficios regularmente.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                            <h4 className="font-bold text-emerald-500 mb-2">Ventajas</h4>
                            <ul className="text-sm space-y-1">
                                <li>Ingresos pasivos predecibles.</li>
                                <li>Barrera psicológica ante caídas.</li>
                                <li>Empresas de alta calidad (Blue Chips).</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <h4 className="font-bold text-red-500 mb-2">Desventajas</h4>
                            <ul className="text-sm space-y-1">
                                <li>Menor eficiencia fiscal.</li>
                                <li>Mayor tiempo de gestión individual.</li>
                                <li>Sesgo de concentración sectorial.</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">La Inversión Indexada (Bogleheads)</h2>
                    <p>
                        Consiste en comprar "todo el mercado" a través de fondos que replican índices como el MSCI World o el S&P 500.
                    </p>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 my-10 flex gap-4">
                        <Scale className="h-6 w-6 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-blue-500 font-black mb-2 uppercase text-sm">El Veredicto del Largo Plazo</h4>
                            <p className="text-sm">
                                Históricamente, la mayoría de los inversores individuales que eligen acciones de dividendos no logran batir al mercado indexado en el largo plazo después de impuestos y comisiones. Sin embargo, el dividendo ofrece una "paz mental" que ayuda a mantener la inversión en tiempos difíciles.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">¿Cuál elegir?</h2>
                    <p>
                        Si eres una persona ocupada que busca la máxima eficiencia y sencillez, la **indexación** es tu camino. Si eres un entusiasta de la analítica empresarial y los flujos de caja constantes te motivan a ahorrar más, los **dividendos** pueden ser para ti.
                    </p>
                </div>

                <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full text-foreground">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Útil (312)
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    )
}
