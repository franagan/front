import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Search, LineChart, PieChart, ShieldAlert, Bot, Calculator } from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function FeatureList() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
                
                {/* Feature 1: Dashboard / Resumen Financiero */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center flex-col-reverse lg:flex-row">
                    <div className="relative rounded-2xl border border-border bg-background shadow-xl p-8 overflow-hidden mt-12 lg:mt-0 order-last lg:order-first">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
                                <p className="text-muted-foreground text-sm uppercase tracking-wide">Patrimonio Neto</p>
                                <p className="text-4xl font-bold text-foreground">€120,000</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/30">
                                <div className="flex items-center gap-2 mb-2"><TrendingUpIcon className="h-4 w-4 text-green-500"/> Ingresos</div>
                                <p className="text-xl font-bold text-green-500">+€3,500</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/30">
                                <div className="flex items-center gap-2 mb-2"><TrendingDownIcon className="h-4 w-4 text-red-500"/> Gastos</div>
                                <p className="text-xl font-bold text-red-500">-€1,200</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Dashboard Financiero
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            Toda tu vida financiera en un solo lugar
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                            Nuestro dashboard te ofrece una visión clara y actualizada de tu patrimonio neto, incluyendo las ganancias y pérdidas mensuales de tus inversiones y la evolución de tu cuenta bancaria.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Resumen Financiero: indicadores clave en tiempo real.",
                                "Flujo de Caja: ingresos frente a gastos.",
                                "Distribución de Activos: gráficos claros de tu patrimonio."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Feature 2: Budgeting */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="mb-12 lg:mb-0">
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Presupuestos y Gastos
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            Budgeting: controla tus gastos y cumple tu plan
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8">
                            Organiza tus finanzas por categorías, fija límites mensuales y sigue cómo evolucionan tus gastos. Evita sobrepasar tu presupuesto y mantente fiel a tus metas de ahorro.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Categorías personalizadas: vivienda, ocio, transporte, etc.",
                                "Registro de gastos rápido y sencillo.",
                                "Comparativas visuales de gasto vs presupuesto.",
                                "Alertas inteligentes de límite de gasto."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative rounded-2xl border border-border bg-background shadow-xl p-8 overflow-hidden">
                        <div className="space-y-6 relative z-10">
                            <div className="p-4 rounded-xl border border-border bg-muted/50">
                                <div className="flex justify-between mb-2"><span className="font-medium">Vivienda</span><span>€800 / €800</span></div>
                                <div className="w-full bg-border rounded-full h-2.5"><div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '100%' }}></div></div>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/50">
                                <div className="flex justify-between mb-2"><span className="font-medium">Alimentación</span><span>€450 / €500</span></div>
                                <div className="w-full bg-border rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div></div>
                            </div>
                            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-4">
                                <ShieldAlert className="text-red-500 h-8 w-8" />
                                <div>
                                    <p className="font-medium text-red-500">Alerta de Presupuesto</p>
                                    <p className="text-sm text-muted-foreground">Has alcanzado el 90% en Alimentación.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Investment */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center flex-col-reverse lg:flex-row">
                    <div className="relative rounded-2xl border border-border bg-background shadow-xl p-8 overflow-hidden mt-12 lg:mt-0 order-last lg:order-first">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                                <p className="text-xs text-muted-foreground">Rentabilidad Total</p>
                                <p className="text-xl font-bold text-green-500">+18.5%</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                                <p className="text-xs text-muted-foreground">Rentabilidad Mensual</p>
                                <p className="text-xl font-bold text-green-500">+2.1%</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                                <p className="text-xs text-muted-foreground">Dividendos Anuales</p>
                                <p className="text-xl font-bold text-foreground">€1,250</p>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                                <p className="text-xs text-muted-foreground">Nº de Posiciones</p>
                                <p className="text-xl font-bold text-foreground">12</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Gestión de Cartera
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            Inversión: haz crecer tu patrimonio con control total
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                            La sección de inversión te ofrece un resumen completo de tu patrimonio invertido, con métricas clave de rentabilidad total, mensual y diaria, además del número de posiciones activas.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Seguimiento de Acciones, ETFs y Criptomonedas.",
                                "Precios en tiempo real integrados con el mercado.",
                                "Control detallado de dividendos cobrados y pendientes.",
                                "Distribución de la cartera por sectores y tipos de activo."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Feature 4: BolScan */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="mb-12 lg:mb-0">
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Análisis de Mercado
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            InverScan: analiza cualquier acción al detalle
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8">
                            Introduce un ticker y obtén un análisis completo de su evolución financiera: dividendos, crecimiento, beneficios, deuda y eficiencia del capital. Visualiza los datos y toma decisiones más inteligentes.
                        </p>
                        <div className="space-y-4 mb-8">
                            {[
                                "Evolución histórica del Dividendo.",
                                "Crecimiento y Beneficio Neto.",
                                "Deuda y Eficiencia del Capital.",
                                "Métricas fundamentales de valoración (PER, EPS, etc)."
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center p-3 rounded-lg border border-border bg-background shadow-sm">
                                    <LineChart className="h-5 w-5 text-yellow-500 mr-3 shrink-0" />
                                    <span className="font-medium text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative rounded-2xl border border-border bg-gradient-to-b from-muted/50 to-background shadow-xl p-8 overflow-hidden flex items-center justify-center min-h-[400px]">
                        <div className="w-full max-w-md space-y-6">
                            <div className="flex relative">
                                <input type="text" value="AAPL" readOnly className="w-full bg-background border border-border rounded-lg py-3 px-4 text-lg font-bold shadow-inner" />
                                <Button className="absolute right-1 top-1 bottom-1 bg-yellow-600 hover:bg-yellow-700">Analizar</Button>
                            </div>
                            <div className="bg-background rounded-xl border border-border p-4 shadow-sm space-y-4">
                                <div className="flex justify-between items-end border-b border-border pb-4">
                                    <div>
                                        <p className="text-xl font-bold">Apple Inc.</p>
                                        <p className="text-muted-foreground text-sm">Technology</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-500">185.92</p>
                                </div>
                                <div className="h-32 flex items-end gap-2 px-2 pt-4">
                                    {[40, 60, 45, 80, 65, 90, 85, 100].map((h, i) => (
                                        <div key={i} className="flex-1 bg-yellow-500/80 rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 5: AI Assistant */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center flex-col-reverse lg:flex-row">
                    <div className="relative rounded-2xl border border-border bg-background shadow-xl p-8 overflow-hidden mt-12 lg:mt-0 order-last lg:order-first">
                        <div className="space-y-4">
                            <div className="flex gap-4 items-end">
                                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <Bot className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="bg-muted p-3 rounded-2xl rounded-bl-none text-sm border border-border">
                                    ¡Hola! He analizado tu cartera. Veo que tienes un 60% en tecnológicas, lo que aumenta tu riesgo sectorial.
                                </div>
                            </div>
                            <div className="flex gap-4 items-end justify-end">
                                <div className="bg-yellow-600 text-white p-3 rounded-2xl rounded-br-none text-sm shadow-md">
                                    ¿Qué sectores me recomiendas para diversificar?
                                </div>
                            </div>
                            <div className="flex gap-4 items-end">
                                <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <Bot className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="bg-muted p-3 rounded-2xl rounded-bl-none text-sm border border-border">
                                    Considerando tu perfil, podrías evaluar ETFs del sector salud o consumo defensivo.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Inteligencia Artificial
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            AIPA: Tu Asesor Financiero Personal
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6">
                            Interactúa con nuestra Inteligencia Artificial basada en GPT. AIPA analiza tus datos financieros reales, tu portfolio y tus hábitos de gasto para darte consejos 100% personalizados.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Sugerencias de diversificación y control de riesgo.",
                                "Respuestas a dudas financieras complejas.",
                                "Análisis de impacto de inflación e impuestos.",
                                "Asistencia disponible 24/7."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Feature 6: Calculators */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="mb-12 lg:mb-0">
                        <h2 className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                            Planificación FIRE
                        </h2>
                        <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl mb-6">
                            Calculadoras de Independencia Financiera
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8">
                            Descubre en cuántos años podrás retirarte con nuestras simulaciones. Planifica tu futuro aplicando reglas matemáticas validadas (como la regla del 4%) y el poder del interés compuesto.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Calculadora FIRE (Financial Independence, Retire Early).",
                                "Simulador de Interés Compuesto.",
                                "Proyección de inflación y retorno de inversión a largo plazo."
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 text-yellow-500 mr-3 shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative rounded-2xl border border-border bg-gradient-to-tr from-yellow-500/10 to-transparent shadow-xl p-8 overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                        <Calculator className="h-24 w-24 text-yellow-600/50 mb-6" />
                        <h4 className="text-xl font-bold mb-2">Simulador FIRE</h4>
                        <div className="w-full max-w-sm space-y-4">
                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Edad Objetivo:</span><span className="font-bold">45 años</span></div>
                            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Capital Necesario:</span><span className="font-bold">€750,000</span></div>
                            <div className="w-full bg-border rounded-full h-3"><div className="bg-green-500 h-3 rounded-full" style={{ width: '45%' }}></div></div>
                            <p className="text-center text-xs text-muted-foreground">Vas por buen camino</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function TrendingDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </svg>
  )
}
