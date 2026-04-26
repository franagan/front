'use client'

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { useUIStore } from "@/stores/useUIStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { useRouter } from "@/i18n/navigation"

export default function PricingSection() {
    const { openAuthModal } = useUIStore()
    const { user } = useAuthStore()
    const router = useRouter()

    const handleFreePlan = () => {
        if (user) {
            router.push('/mainboard')
        } else {
            openAuthModal('register')
        }
    }

    const handleProPlan = () => {
        alert("¡Estamos trabajando en el Plan Pro! Estará disponible muy pronto con todas las funciones avanzadas.")
    }

    return (
        <section id="pricing" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-4">
                        Precios simples y transparentes
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Comienza gratis y mejora cuando necesites más herramientas. Sin sorpresas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    
                    {/* Free Plan */}
                    <div className="rounded-3xl border border-border bg-background shadow-sm p-8 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground mb-2">Básico</h3>
                        <p className="text-muted-foreground text-sm mb-6">Perfecto para empezar a organizar tus finanzas personales.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-foreground">Gratis</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Dashboard financiero básico",
                                "Gestión de presupuestos (hasta 5 categorías)",
                                "Seguimiento de ingresos y gastos",
                                "Calculadoras de Independencia Financiera"
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mr-3 shrink-0" />
                                    <span className="text-sm text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button 
                            variant="outline" 
                            className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white rounded-full"
                            onClick={handleFreePlan}
                        >
                            {user ? "Ir al Dashboard" : "Comenzar Gratis"}
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-3xl border-2 border-yellow-600 bg-muted/20 shadow-xl p-8 flex flex-col relative transform md:-translate-y-4">
                        <div className="absolute top-0 right-6 transform -translate-y-1/2">
                            <span className="bg-yellow-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                                Próximamente
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Pro</h3>
                        <p className="text-muted-foreground text-sm mb-6">Para inversores que quieren maximizar su rentabilidad.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-foreground">€4.99</span>
                            <span className="text-muted-foreground">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Todo lo del plan Básico",
                                "Categorías de presupuesto ilimitadas",
                                "InverScan: Análisis avanzado de acciones",
                                "LIA: Asesora Financiera IA integrada",
                                "Alertas inteligentes de portfolio",
                                "Sincronización en tiempo real"
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mr-3 shrink-0" />
                                    <span className="text-sm text-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button 
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-full"
                            onClick={handleProPlan}
                        >
                            Saber más
                        </Button>
                    </div>

                </div>
            </div>
        </section>
    )
}
