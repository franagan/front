'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Flame, TrendingUp, Info, Zap, Globe, Clock, ShieldCheck } from "lucide-react"
import FireCalculator from "@/components/tools/FireCalculator"
import CompoundInterestCalculator from "@/components/tools/CompoundInterestCalculator"
import { cn } from "@/lib/utils"

export default function ToolsHubPage() {
    const [selectedTool, setSelectedTool] = useState<string | null>('fire')

    const tools = [
        {
            id: 'fire',
            title: "Calculadora FIRE",
            description: "Calcula cuántos años te faltan para alcanzar la independencia financiera.",
            icon: <Flame className="h-5 w-5" />,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "border-orange-500/50",
            active: "bg-orange-500 text-white shadow-orange-500/20 shadow-lg"
        },
        {
            id: 'compound',
            title: "Interés Compuesto",
            description: "Visualiza el poder del interés compuesto a largo plazo.",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/50",
            active: "bg-emerald-500 text-white shadow-emerald-500/20 shadow-lg"
        }
    ]

    const stats = [
        { label: "4 Calculadoras", icon: <Calculator className="h-4 w-4" />, color: "text-blue-500" },
        { label: "100% Gratuitas", icon: <ShieldCheck className="h-4 w-4" />, color: "text-emerald-500" },
        { label: "Sin Límites", icon: <Globe className="h-4 w-4" />, color: "text-purple-500" },
        { label: "24/7 Disponible", icon: <Clock className="h-4 w-4" />, color: "text-orange-500" }
    ]

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Hero Section with Stats */}
            <div className="bg-muted/30 pt-12 pb-16 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Calculadoras <span className="text-emerald-500">Financieras</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Herramientas gratuitas para planificar tu independencia financiera. Calcula tu FIRE, 
                        simula inversiones y optimiza tu patrimonio con datos precisos.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className={cn("p-2 rounded-lg bg-background border border-border shadow-sm", stat.color)}>
                                    {stat.icon}
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-[-40px]">
                {/* Modern Horizontal Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex p-1.5 bg-card/80 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
                        {tools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => setSelectedTool(tool.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all duration-300",
                                    selectedTool === tool.id 
                                        ? tool.active
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {tool.icon}
                                {tool.title}
                            </button>
                        ))}
                        <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-muted-foreground/50 cursor-not-allowed italic">
                            Config. Presupuesto
                        </button>
                    </div>
                </div>

                {/* Tool Description & Content */}
                {selectedTool && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                                <Info className="h-3 w-3" />
                                {selectedTool === 'fire' ? 'Calculadora Completa' : 'Proyección de Interés'}
                            </div>
                            <h2 className="text-3xl font-black tracking-tight flex items-center justify-center gap-3">
                                {tools.find(t => t.id === selectedTool)?.title}
                                {selectedTool === 'fire' && <Flame className="h-8 w-8 text-orange-500" />}
                                {selectedTool === 'compound' && <TrendingUp className="h-8 w-8 text-emerald-500" />}
                            </h2>
                            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                                {tools.find(t => t.id === selectedTool)?.description}
                            </p>
                        </div>

                        <div className="bg-card/30 backdrop-blur-sm border border-border rounded-3xl p-4 sm:p-8 shadow-inner">
                            {selectedTool === 'fire' && <FireCalculator />}
                            {selectedTool === 'compound' && <CompoundInterestCalculator />}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
