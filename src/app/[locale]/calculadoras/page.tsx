'use client'

import { useState } from "react"
import { Navigation } from "@/components/ui/navigation"
import { Button } from "@/components/ui/button"
import { 
    Calculator, 
    Flame, 
    TrendingUp, 
    PiggyBank, 
    Clock, 
    Zap, 
    Info, 
    ShieldCheck, 
    Globe,
    CheckCircle
} from "lucide-react"
import FireCalculator from "@/components/tools/FireCalculator"
import CompoundInterestCalculator from "@/components/tools/CompoundInterestCalculator"
import BudgetCalculator from "@/components/tools/BudgetCalculator"
import TimeFireCalculator from "@/components/tools/TimeFireCalculator"
import { cn } from "@/lib/utils"

export default function CalculadorasPage() {
    const [selectedTool, setSelectedTool] = useState<string>('fire')

    const tools = [
        {
            id: 'fire',
            title: "Calculadora FIRE",
            description: "Calcula cuándo podrás retirarte usando la regla del 4%.",
            icon: <Flame className="h-5 w-5" />,
            color: "text-orange-500",
            active: "bg-orange-500 text-white shadow-orange-500/20 shadow-lg"
        },
        {
            id: 'compound',
            title: "Interés Compuesto",
            description: "Visualiza el poder del interés a largo plazo.",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-emerald-500",
            active: "bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg"
        },
        {
            id: 'budget',
            title: "Presupuesto",
            description: "Optimiza tus gastos para maximizar el ahorro.",
            icon: <PiggyBank className="h-5 w-5" />,
            color: "text-purple-500",
            active: "bg-purple-500 text-white shadow-purple-500/20 shadow-lg"
        },
        {
            id: 'time',
            title: "Tiempo FIRE",
            description: "Análisis de hitos y años restantes.",
            icon: <Clock className="h-5 w-5" />,
            color: "text-blue-500",
            active: "bg-blue-500 text-white shadow-blue-500/20 shadow-lg"
        }
    ]

    const stats = [
        { label: "4 Calculadoras", icon: <Calculator className="h-4 w-4" />, color: "text-blue-500" },
        { label: "100% Gratuitas", icon: <ShieldCheck className="h-4 w-4" />, color: "text-emerald-500" },
        { label: "Sin Límites", icon: <Globe className="h-4 w-4" />, color: "text-purple-500" },
        { label: "24/7 Disponible", icon: <Clock className="h-4 w-4" />, color: "text-orange-500" }
    ]

    return (
        <div className="min-h-screen bg-background pb-0">
            <Navigation />

            {/* Hero Section with Stats */}
            <div className="bg-muted/30 pt-16 pb-20 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-6">
                        <Zap className="h-3 w-3" />
                        Herramientas GRATUITAS
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
                        Calculadoras <span className="text-emerald-500">Financieras</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                        Herramientas gratuitas para planificar tu independencia financiera. Calcula tu FIRE, 
                        simula inversiones y optimiza tu presupuesto con precisión.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={cn("p-2.5 rounded-xl bg-background border border-border shadow-sm", stat.color)}>
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-[-40px]">
                {/* Switcher */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex flex-wrap sm:flex-nowrap p-1.5 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setSelectedTool(tool.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm transition-all duration-300",
                                    selectedTool === tool.id 
                                        ? tool.active
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {tool.icon}
                                <span className="hidden sm:inline">{tool.title}</span>
                                <span className="sm:hidden">{tool.id.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center justify-center gap-3">
                            {tools.find(t => t.id === selectedTool)?.title}
                            <span className={tools.find(t => t.id === selectedTool)?.color}>
                                {tools.find(t => t.id === selectedTool)?.icon}
                            </span>
                        </h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                            {tools.find(t => t.id === selectedTool)?.description}
                        </p>
                    </div>

                    <div className="bg-card/40 backdrop-blur-sm border border-border rounded-[2.5rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
                        {selectedTool === 'fire' && <FireCalculator />}
                        {selectedTool === 'compound' && <CompoundInterestCalculator />}
                        {selectedTool === 'budget' && <BudgetCalculator />}
                        {selectedTool === 'time' && <TimeFireCalculator />}
                    </div>
                </div>
            </main>

            {/* CTA Help */}
            <section className="mt-24 py-24 bg-gradient-to-br from-emerald-500 via-blue-600 to-indigo-700 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-24 opacity-10 rotate-12">
                    <TrendingUp className="w-96 h-96" />
                </div>
                <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">
                        ¿Necesitas ayuda personalizada?
                    </h2>
                    <p className="text-xl text-white/80 mb-10 leading-relaxed font-medium">
                        Si tienes dudas sobre los resultados o necesitas asesoramiento específico para tu estrategia FIRE, 
                        contáctanos. Es completamente gratuito.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-700 hover:bg-emerald-50 font-black h-16 px-10 rounded-2xl shadow-xl hover:scale-105 transition-all"
                            onClick={() => window.location.href = '/contacto'}
                        >
                            <Zap className="h-5 w-5 mr-3 fill-current" />
                            Consulta Gratis
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 h-16 px-10 rounded-2xl font-black hover:scale-105 transition-all"
                            onClick={() => window.location.href = '/blog'}
                        >
                            <Info className="h-5 w-5 mr-3" />
                            Guía FIRE
                        </Button>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="bg-black py-16 text-center border-t border-white/5">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="inline-flex items-center gap-2 mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <span className="text-xl">🔥</span>
                        <span className="text-sm font-black text-white uppercase tracking-widest">Inversión Libre</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">
                        <a href="/" className="hover:text-white transition-colors">Inicio</a>
                        <a href="/blog" className="hover:text-white transition-colors">Aprende</a>
                        <a href="/calculadoras" className="text-white">Calculadoras</a>
                        <a href="/contacto" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                    <p className="text-xs text-muted-foreground/60 font-medium">
                        &copy; {new Date().getFullYear()} Inversión Libre. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    )
}
