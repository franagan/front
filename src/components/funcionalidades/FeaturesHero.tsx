import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet } from "lucide-react"
import { Link } from "@/i18n/navigation"

export default function FeaturesHero() {
    return (
        <section className="relative overflow-hidden bg-background pt-24 pb-16">
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-yellow-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-yellow-600 bg-yellow-500/10 mb-6 border border-yellow-500/20">
                    <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
                    Tu vida financiera en un solo lugar
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
                    Conoce todo lo que <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">Inversión Libre</span> puede hacer por ti
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Nuestro ecosistema de finanzas personales te ofrece una visión clara y actualizada de tu patrimonio neto. Ahorra más, invierte mejor y toma decisiones informadas hacia tu libertad financiera.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-8 shadow-lg shadow-yellow-500/25 transition-transform hover:scale-105" asChild>
                        <Link href="/login">
                            Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
