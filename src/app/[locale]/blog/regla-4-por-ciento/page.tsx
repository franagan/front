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
    Calculator,
    BarChart,
    ShieldCheck,
    AlertTriangle
} from "lucide-react"
import Link from "next/link"

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="max-w-4xl mx-auto px-4 pt-12 pb-24">
                <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Volver al blog
                </Link>

                <header className="space-y-6 mb-12">
                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20 px-3 py-1">
                        Fundamentos FIRE
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        La Regla del 4%: La base matemática de tu independencia
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">FP</div>
                            <span>Francisco Palero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>5 de Enero, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>10 min de lectura</span>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2 bg-blue-500/5 rounded-r-xl">
                        "¿Cuánto dinero necesito exactamente para no volver a trabajar?" Esta es la pregunta del millón, y la respuesta se llama la Regla del 4%."
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">¿Qué es el Estudio Trinity?</h2>
                    <p>
                        Todo empezó en 1998, cuando tres profesores de la Universidad Trinity realizaron un estudio analizando datos históricos del mercado de valores y bonos. Querían saber cuánta rentabilidad podía extraer un jubilado de su cartera cada año sin quedarse sin dinero antes de morir.
                    </p>

                    <div className="bg-muted border border-border rounded-3xl p-8 my-10">
                        <h3 className="text-2xl font-black text-foreground mb-4 flex items-center gap-2">
                            <Calculator className="h-6 w-6 text-blue-500" />
                            La fórmula mágica
                        </h3>
                        <p className="mb-6">
                            Para saber tu "Número FIRE", solo tienes que multiplicar tus gastos anuales por 25.
                        </p>
                        <div className="bg-background rounded-2xl p-6 border border-border text-center">
                            <code className="text-2xl font-black text-blue-500">Gastos Anuales x 25 = Patrimonio Necesario</code>
                        </div>
                        <p className="mt-6 text-sm italic text-center">
                            Ejemplo: Si gastas 2.000€/mes (24.000€/año), necesitas 600.000€.
                        </p>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">¿Por qué funciona?</h2>
                    <p>
                        Históricamente, la bolsa de valores genera una rentabilidad media del 7-10%. Si retiramos un 4% y tenemos en cuenta una inflación media del 2-3%, el resultado es que el capital se mantiene intacto (o incluso crece) a largo plazo.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                        <Card className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl">
                            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-4" />
                            <h4 className="font-bold mb-2">Seguridad</h4>
                            <p className="text-xs">Incluso en los peores escenarios de la historia (como la Gran Depresión), con una tasa del 4% las carteras sobrevivieron 30 años en el 95% de los casos.</p>
                        </Card>
                        <Card className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-2xl">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 mb-4" />
                            <h4 className="font-bold mb-2">Precauciones</h4>
                            <p className="text-xs">La regla no tiene en cuenta impuestos, comisiones bancarias ni escenarios de "mala suerte" en los primeros años (Secuencia de Retornos).</p>
                        </Card>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">Retiradas flexibles</h2>
                    <p>
                        La mayoría de los jubilados FIRE hoy en día no aplican un 4% ciego. Utilizan reglas de **retirada flexible**. Si el mercado cae mucho un año, reducen su gasto ese año para dejar que la cartera se recupere. Esto aumenta las probabilidades de éxito al 99.9%.
                    </p>

                    <Card className="bg-blue-600 p-8 text-white rounded-[2.5rem] my-12 relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <h3 className="text-2xl font-black mb-4 tracking-tighter">¿Quieres saber tu número?</h3>
                            <p className="mb-8 font-medium">Usa nuestra calculadora avanzada para ver cuánto tiempo te falta para llegar a tu patrimonio objetivo.</p>
                            <Link href="/calculadoras">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black px-8 py-6 rounded-2xl text-lg">
                                    Ir a la Calculadora
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <p>
                        La Regla del 4% es una brújula, no un destino inmutable. Entenderla es el primer paso para dejar de ver la jubilación como una edad y empezar a verla como un número.
                    </p>
                </div>

                <footer className="mt-16 pt-8 border-t border-border">
                   <div className="flex justify-between items-center text-muted-foreground text-sm">
                        <span>Compartido 1.2k veces</span>
                        <div className="flex gap-4">
                            <ThumbsUp className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                            <Share2 className="h-5 w-5 cursor-pointer hover:text-blue-500" />
                        </div>
                   </div>
                </footer>
            </main>
        </div>
    )
}
