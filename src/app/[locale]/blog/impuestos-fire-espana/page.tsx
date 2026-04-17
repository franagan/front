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
    BookOpen,
    AlertCircle,
    CheckCircle2
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
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20 px-3 py-1">
                        Estrategia Fiscal
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Guía de Impuestos para FIRE en España
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b border-border pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">FP</div>
                            <span>Francisco Palero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>5 de Febrero, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>13 min de lectura</span>
                        </div>
                    </div>
                </header>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
                    <p className="text-foreground font-medium text-xl leading-relaxed italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-xl">
                        "No es lo que ganas, sino lo que mantienes". Esta es la máxima que todo aspirante a la independencia financiera (FIRE) debe tatuarse. En España, una planificación fiscal inteligente puede adelantar tu jubilación entre 3 y 7 años.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">1. El Impuesto sobre el Ahorro</h2>
                    <p>
                        A diferencia de los rendimientos del trabajo (Nómina), que pueden tributar hasta al 47%, los beneficios de tus inversiones (acciones, fondos, dividendos) tributan en la base del ahorro. En 2024, los tramos son:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Hasta 6.000€: <strong>19%</strong></li>
                        <li>De 6.000€ a 50.000€: <strong>21%</strong></li>
                        <li>De 50.000€ a 200.000€: <strong>23%</strong></li>
                        <li>Más de 200.000€: <strong>27-28%</strong></li>
                    </ul>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 my-10 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="text-blue-500 font-black mb-2 uppercase text-sm">El "Hack" de los Fondos de Inversión</h4>
                            <p className="text-sm">
                                En España, el traspaso entre fondos de inversión está <strong>exento de tributación</strong>. Esto te permite rebalancear tu cartera o cambiar de estrategia sin pasar por Hacienda, permitiendo que el interés compuesto trabaje sobre el 100% de tu capital durante décadas.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-foreground pt-8">2. Dividendos vs Acumulación</h2>
                    <p>
                        Para un inversor FIRE, los dividendos pueden parecer atractivos por ser ingresos pasivos directos. Sin embargo, en España, cada dividendo que cobras paga impuestos en ese momento. Los fondos de acumulación reinvierten esos dividendos automáticamente dentro del fondo, difiriendo el impuesto hasta el día que vendas.
                    </p>

                    <h2 className="text-3xl font-black text-foreground pt-8">3. La Regla del 4% y la Regla del Fisco</h2>
                    <p>
                        Cuando empieces a retirar dinero, no estarás retirando beneficios al 100%. Estarás retirando una mezcla de capital aportado (ya tributado) y plusvalías. Esto reduce tu <strong>tipo impositivo real</strong> drásticamente.
                    </p>

                    <Card className="bg-muted border-border p-8 my-10 rounded-3xl">
                        <h3 className="text-2xl font-black text-foreground mb-4">Estrategia Ganadora</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                <p className="text-sm">Utiliza Fondos Indexados de bajo coste para diferir impuestos.</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                <p className="text-sm">Aprovecha los primeros 6.000€ de beneficio al tipo mínimo del 19%.</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                                <p className="text-sm">Considera el cambio de residencia fiscal solo si tu patrimonio supera los 2M€.</p>
                            </div>
                        </div>
                    </Card>

                    <p>
                        En conclusión, España no es el infierno fiscal que muchos pintan para el inversor FIRE, siempre que utilices los vehículos adecuados. Planifica hoy para disfrutar mañana.
                    </p>
                </div>

                <footer className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="rounded-full">
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Útil (124)
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartir
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="secondary">#Impuestos</Badge>
                        <Badge variant="secondary">#Estrategia</Badge>
                        <Badge variant="secondary">#España</Badge>
                    </div>
                </footer>
            </main>
        </div>
    )
}
