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
    Brain,
    Lightbulb,
    Target
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
                    <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20 px-3 py-1">
                        Mentalidad & Psicología
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Psicología del Dinero: El mayor obstáculo hacia el FIRE
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center font-bold text-orange-500">FP</div>
                            <span>Francisco Palero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>1 de Febrero, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>11 min de lectura</span>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-orange-500 pl-6 py-2 bg-orange-500/5 rounded-r-xl">
                        "Hacerlo bien con el dinero tiene poco que ver con lo inteligente que seas y mucho con cómo te comportas". No lo digo yo, lo dice Morgan Housel, y es la verdad más absoluta del camino FIRE.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">La Brecha entre Saber y Hacer</h2>
                    <p>
                        Puedes tener la mejor hoja de cálculo del mundo. Puedes conocer cada ETF de Vanguard por su nombre técnico. Pero si cuando el mercado cae un 20% entras en pánico y vendes, tus conocimientos matemáticos valen cero. El FIRE es un juego de <strong>resistencia emocional</strong>, no de cálculo mental.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">El Sesgo de la Comparación Social</h2>
                    <p>
                        El mayor enemigo del ahorro no es la inflación, es el vecino. Vivimos en la era de la "envidia diseñada" por las redes sociales. El movimiento FIRE te obliga a desaprender la necesidad de demostrar estatus a través del consumo.
                    </p>

                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 my-10 flex gap-4">
                        <Lightbulb className="h-6 w-6 text-orange-500 shrink-0" />
                        <div>
                            <h4 className="text-orange-500 font-black mb-2 uppercase text-sm">El Valor de la Opción de No Hacer Nada</h4>
                            <p className="text-sm">
                                La riqueza es, en esencia, lo que no ves. Son los coches que no se compraron, los relojes que no se lucen y los viajes de lujo que se cambiaron por experiencias más sencillas. Ese dinero "escondido" es lo que compra tu libertad futura.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">3 Pilares de la Mentalidad FIRE</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                        <Card className="bg-muted/50 border-border p-6 rounded-2xl">
                            <Target className="h-6 w-6 text-orange-500 mb-4" />
                            <h3 className="font-bold mb-2">Propósito</h3>
                            <p className="text-xs">No huyas del trabajo, corre hacia algo que ames.</p>
                        </Card>
                        <Card className="bg-muted/50 border-border p-6 rounded-2xl">
                            <Brain className="h-6 w-6 text-orange-500 mb-4" />
                            <h3 className="font-bold mb-2">Desapego</h3>
                            <p className="text-xs">Separa tu identidad de tus posesiones materiales.</p>
                        </Card>
                        <Card className="bg-muted/50 border-border p-6 rounded-2xl">
                            <Clock className="h-6 w-6 text-orange-500 mb-4" />
                            <h3 className="font-bold mb-2">Paciencia</h3>
                            <p className="text-xs">El tiempo es el ingrediente secreto del interés compuesto.</p>
                        </Card>
                    </div>

                    <p>
                        En última instancia, el éxito financiero depende de tu capacidad para gestionar el miedo y la codicia. Si dominas tu mente, el FIRE es inevitable.
                    </p>
                </div>

                <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Útil (256)
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartir
                        </Button>
                    </div>
                </footer>
            </main>
        </div>
    )
}
