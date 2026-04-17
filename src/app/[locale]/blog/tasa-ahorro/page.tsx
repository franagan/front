import { Navigation } from "@/components/ui/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Share2, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function TasaAhorroPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-green-500 mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver al Blog
                </Link>

                <article className="space-y-8">
                    <header className="space-y-4">
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Estrategia</Badge>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">La Tasa de Ahorro: Tu indicador más importante</h1>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Por Equipo Inversión Libre</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>4 min de lectura</span>
                            </div>
                        </div>
                    </header>

                    <div className="aspect-video w-full rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-border">
                         <TrendingUp className="h-16 w-16 text-blue-500" />
                    </div>

                    <div className="prose prose-invert max-w-none space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            Si quieres alcanzar la libertad financiera, olvida por un momento el rendimiento de tus inversiones o el precio de las acciones. Hay un número que es infinitamente más importante para predecir cuándo podrás jubilarte: **tu tasa de ahorro**.
                        </p>

                        <h2 className="text-2xl font-bold text-foreground">¿Qué es la tasa de ahorro?</h2>
                        <p>
                            Es el porcentaje de tus ingresos netos que no gastas. Si ganas 2.000€ y gastas 1.500€, ahorras 500€. Tu tasa de ahorro es del 25%. 
                        </p>

                        <div className="bg-secondary/30 p-4 rounded-lg border border-border font-mono text-center">
                            (Ingresos - Gastos) / Ingresos = Tasa de Ahorro
                        </div>

                        <h2 className="text-2xl font-bold text-foreground">¿Por qué importa tanto?</h2>
                        <p>
                            La tasa de ahorro tiene un doble efecto en tu camino al FIRE:
                        </p>
                        <ol className="list-decimal pl-6 space-y-4">
                            <li><strong>Más capital para invertir:</strong> Cuanto más ahorras, más gasolina le echas al motor del interés compuesto.</li>
                            <li><strong>Menos gastos que cubrir:</strong> Una tasa de ahorro alta significa que has aprendido a vivir con menos. Esto reduce automáticamente tu "Número FIRE" (la cantidad total que necesitas para jubilarte), ya que necesitas menos rentas para cubrir tu estilo de vida.</li>
                        </ol>

                        <h2 className="text-2xl font-bold text-foreground">El poder de los porcentajes</h2>
                        <p>
                            Aquí es donde se pone interesante. Independientemente de cuánto ganes, el tiempo hacia el FIRE depende puramente del porcentaje:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>10% de ahorro: te jubilas en 51 años.</li>
                            <li>30% de ahorro: te jubilas en 28 años.</li>
                            <li>50% de ahorro: te jubilas en 17 años.</li>
                            <li>70% de ahorro: te jubilas en 8.5 años.</li>
                        </ul>

                        <p>
                            Como ves, pasar de un 10% a un 30% recorta **23 años** de vida laboral. Es la palanca más potente que tienes a tu alcance.
                        </p>
                    </div>

                    <footer className="pt-8 border-t border-border flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">#Ahorro</Button>
                            <Button variant="outline" size="sm">#Inversión</Button>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Share2 className="h-5 w-5" />
                        </Button>
                    </footer>
                </article>
            </main>
        </div>
    );
}
