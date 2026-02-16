'use client'

import { Navigation } from "@/components/ui/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineFinancialChart } from "@/components/ui/chart"
import {
    Globe,
    Youtube,
    Target,
    TrendingUp,
    MapPin,
    Calendar,
    Award,
    BookOpen,
    Users,
    Heart,
    Coffee,
    Plane,
    Mail,
    CheckCircle,
    Star,
    Briefcase,
    Compass,
    Zap,
    Calculator
} from "lucide-react"

export default function SobreMiPage() {

    // Datos del viaje FIRE (ejemplo)
    const fireJourneyData = [
        { name: '2015', patrimonio: 5000, objetivo: 500000 },
        { name: '2016', patrimonio: 25000, objetivo: 500000 },
        { name: '2017', patrimonio: 55000, objetivo: 500000 },
        { name: '2018', patrimonio: 95000, objetivo: 500000 },
        { name: '2019', patrimonio: 150000, objetivo: 500000 },
        { name: '2020', patrimonio: 220000, objetivo: 500000 },
        { name: '2021', patrimonio: 310000, objetivo: 500000 },
        { name: '2022', patrimonio: 420000, objetivo: 500000 },
        { name: '2023', patrimonio: 500000, objetivo: 500000 },
        { name: '2024', patrimonio: 580000, objetivo: 500000 }
    ]

    const achievements = [
        { icon: <Target className="h-5 w-5" />, title: "FIRE conseguido", description: "Independencia financiera a los 35", year: "2023" },
        { icon: <Globe className="h-5 w-5" />, title: "25 países visitados", description: "Como nómada digital", year: "2024" },
        { icon: <Youtube className="h-5 w-5" />, title: "500K+ suscriptores", description: "Canal de YouTube", year: "2024" },
        { icon: <Users className="h-5 w-5" />, title: "1000+ personas", description: "Ayudadas hacia FIRE", year: "2024" },
        { icon: <Award className="h-5 w-5" />, title: "15% rendimiento", description: "Promedio anual cartera", year: "2023" },
        { icon: <BookOpen className="h-5 w-5" />, title: "100+ artículos", description: "Educación financiera", year: "2024" }
    ]

    const timeline = [
        {
            year: "2015",
            title: "Descubrimiento del FIRE",
            description: "Leyendo blogs americanos sobre independencia financiera, me enamoré del concepto FIRE.",
            icon: <Zap className="h-4 w-4" />
        },
        {
            year: "2016-2018",
            title: "Aprendizaje y Optimización",
            description: "Estudié inversiones, optimicé gastos y aumenté mi tasa de ahorro al 65%.",
            icon: <TrendingUp className="h-4 w-4" />
        },
        {
            year: "2019",
            title: "Primeros Éxitos",
            description: "Mi cartera superó los €150K. Lancé el canal de YouTube para compartir mi experiencia.",
            icon: <Youtube className="h-4 w-4" />
        },
        {
            year: "2020-2022",
            title: "Aceleración",
            description: "Los mercados y el crecimiento del canal aceleraron mi camino hacia el FIRE.",
            icon: <Target className="h-4 w-4" />
        },
        {
            year: "2023",
            title: "FIRE Conseguido",
            description: "Alcancé €500K de patrimonio. Oficialmente independiente financieramente.",
            icon: <CheckCircle className="h-4 w-4" />
        },
        {
            year: "2024",
            title: "Vida Nómada",
            description: "Viajando por Europa en autocaravana, viviendo de mis inversiones y ayudando a otros.",
            icon: <Plane className="h-4 w-4" />
        }
    ]

    const countries = [
        "🇪🇸 España", "🇫🇷 Francia", "🇮🇹 Italia", "🇵🇹 Portugal", "🇩🇪 Alemania",
        "🇳🇱 Países Bajos", "🇧🇪 Bélgica", "🇨🇭 Suiza", "🇦🇹 Austria", "🇨🇿 República Checa",
        "🇭🇺 Hungría", "🇵🇱 Polonia", "🇸🇰 Eslovaquia", "🇸🇮 Eslovenia", "🇭🇷 Croacia",
        "🇧🇦 Bosnia", "🇷🇸 Serbia", "🇲🇪 Montenegro", "🇦🇱 Albania", "🇬🇷 Grecia",
        "🇧🇬 Bulgaria", "🇷🇴 Rumania", "🇺🇦 Ucrania", "🇪🇪 Estonia", "🇱🇻 Letonia"
    ]

    return (
        <div className="min-h-screen">

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Texto principal */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Badge className="bg-gradient-to-r from-blue-400 to-purple-600 text-white font-semibold">
                                    👋 Hola, soy Francisco
                                </Badge>
                                <h1 className="text-5xl font-bold leading-tight">
                                    Conseguí mi
                                    <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> FIRE</span>
                                    <br />a los 35 años
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    Desde entonces vivo como <strong>nómada digital</strong> viajando por Europa en autocaravana,
                                    viviendo de mis inversiones y ayudando a otros a conseguir su independencia financiera.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400">€580K</div>
                                    <div className="text-sm text-muted-foreground">Patrimonio actual</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-400">5 años</div>
                                    <div className="text-sm text-muted-foreground">Desde FIRE</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400">500K+</div>
                                    <div className="text-sm text-muted-foreground">Suscriptores</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">25</div>
                                    <div className="text-sm text-muted-foreground">Países visitados</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    className="bg-red-600 text-white hover:bg-red-700"
                                    onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                >
                                    <Youtube className="h-4 w-4 mr-2" />
                                    Seguir en YouTube
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-primary/50 text-foreground hover:bg-muted"
                                    onClick={() => window.location.href = '/contacto'}
                                >
                                    <Mail className="h-4 w-4 mr-2" />
                                    Contactar
                                </Button>
                            </div>
                        </div>

                        {/* Imagen/Stats */}
                        <div className="space-y-6">
                            <Card className="bg-card border-border">
                                <CardContent className="p-8">
                                    <div className="text-center space-y-6">
                                        <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto flex items-center justify-center text-6xl">
                                            👨‍💻
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-bold text-foreground mb-2">Francisco Palero</h3>
                                            <p className="text-muted-foreground">Nómada Digital & Educador FIRE</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>Actualmente en Europa</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>FIRE desde 2019</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Briefcase className="h-4 w-4" />
                                                <span>Ex-Ingeniero de Software</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mi Historia */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">📖 Mi Historia hacia el FIRE</h2>
                        <p className="text-xl text-muted-foreground">
                            Desde desarrollador con salario normal hasta independencia financiera total
                        </p>
                    </div>

                    <Card className="bg-card border-border mb-12">
                        <CardHeader>
                            <CardTitle className="text-foreground">📈 Evolución de mi Patrimonio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineFinancialChart
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                data={fireJourneyData as any}
                                height={300}
                                colors={["#3b82f6", "#ef4444"]}
                                title=""
                            />
                            <div className="mt-4 text-sm text-gray-400 text-center">
                                El momento en que crucé la línea roja fue cuando supe que había conseguido mi FIRE 🎉
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                                        <Badge variant="outline" className="text-muted-foreground">
                                            {item.year}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Logros */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">🏆 Logros y Hitos</h2>
                        <p className="text-xl text-gray-400">
                            Algunos números que resumen mi camino hacia y después del FIRE
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements.map((achievement, index) => (
                            <Card key={index} className="bg-card border-border hover:border-blue-400/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                                            {achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-foreground mb-1">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm mb-2">
                                                {achievement.description}
                                            </p>
                                            <Badge variant="outline" className="text-muted-foreground text-xs">
                                                {achievement.year}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vida Nómada */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-foreground">🌍 Vida Nómada Digital</h2>
                        <p className="text-xl text-muted-foreground">
                            Viajando por Europa en autocaravana desde que conseguí mi FIRE
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        <Card className="bg-card border-border shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                                    <Plane className="h-6 w-6 text-primary" />
                                    Países Visitados (25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                                    {countries.map((country, index) => (
                                        <div key={index} className="flex items-center gap-2 group cursor-default">
                                            <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                                {country.split(' ')[0]}
                                            </span>
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {country.split(' ')[1]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/10">
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                        <Compass className="h-5 w-5" />
                                        <span className="font-bold">Próximo destino</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Explorando los Balcanes: <strong className="text-foreground">Albania, Macedonia del Norte y Kosovo</strong>.
                                        ¡Sígueme en YouTube para ver nuestra ruta en tiempo real!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>


                        <div className="space-y-6">
                            <Card className="bg-card border-border shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                                        <Compass className="h-6 w-6 text-primary" />
                                        Mi Oficina Móvil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        Trabajo desde una autocaravana equipada con todo lo necesario para mi día a día:
                                        internet por satélite, energía solar y un estudio de grabación completo.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-sm font-medium text-foreground">Internet Starlink</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Zap className="h-5 w-5 text-yellow-500" />
                                            <span className="text-sm font-medium text-foreground">400W Solar</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Briefcase className="h-5 w-5 text-blue-500" />
                                            <span className="text-sm font-medium text-foreground">Estudio móvil</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Coffee className="h-5 w-5 text-orange-500" />
                                            <span className="text-sm font-medium text-foreground">Autonomía 7 días</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card border-border shadow-sm overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                                        <Calculator className="h-6 w-6 text-primary" />
                                        Gastos de Vida Nómada
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">Combustible</span>
                                                <span className="text-foreground font-bold">€400/mes</span>
                                            </div>
                                            <Progress value={40} className="h-2" variant="default" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">Comida</span>
                                                <span className="text-foreground font-bold">€300/mes</span>
                                            </div>
                                            <Progress value={30} className="h-2" variant="success" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">Camping/Parkings</span>
                                                <span className="text-foreground font-bold">€200/mes</span>
                                            </div>
                                            <Progress value={20} className="h-2" variant="warning" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground font-medium">Otros</span>
                                                <span className="text-foreground font-bold">€100/mes</span>
                                            </div>
                                            <Progress value={10} className="h-2" variant="destructive" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-black text-primary">€1,000</div>
                                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold italic">
                                                Total mensual estimado
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10 py-1">
                                                -60% vs Madrid
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>

            {/* Filosofía */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 text-foreground">💭 Mi Filosofía</h2>
                        <div className="mt-4 text-sm text-muted-foreground text-center">
                            El momento en que crucé la línea roja fue cuando supe que había conseguido mi FIRE 🎉
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <Card className="bg-card border-blue-500/20 dark:border-blue-500/10 hover:border-blue-500/50 transition-all bg-gradient-to-br from-blue-500/5 to-transparent border shadow-sm">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-5xl mb-2">🎯</div>
                                    <h3 className="text-2xl font-bold text-foreground">FIRE no es sobre dinero</h3>
                                    <p className="text-muted-foreground text-lg">
                                        Es sobre <strong className="text-foreground">libertad de elección</strong>. El dinero es solo la herramienta
                                        que te permite decidir cómo pasar tu tiempo.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-green-500/20 dark:border-green-500/10 hover:border-green-500/50 transition-all bg-gradient-to-br from-green-500/5 to-transparent border shadow-sm">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-5xl mb-2">🌱</div>
                                    <h3 className="text-2xl font-bold text-foreground">Empezar es lo importante</h3>
                                    <p className="text-muted-foreground text-lg">
                                        No necesitas ser perfecto desde el día 1. Yo cometí muchos errores,
                                        pero <strong className="text-foreground">empezar temprano</strong> fue la clave.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-purple-500/20 dark:border-purple-500/10 hover:border-purple-500/50 transition-all bg-gradient-to-br from-purple-500/5 to-transparent border shadow-sm">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-5xl mb-2">🎓</div>
                                    <h3 className="text-2xl font-bold text-foreground">Educación continua</h3>
                                    <p className="text-muted-foreground text-lg">
                                        Los mercados evolucionan, las estrategias cambian.
                                        <strong className="text-foreground">Nunca pares de aprender</strong> sobre finanzas e inversión.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-orange-500/20 dark:border-orange-500/10 hover:border-orange-500/50 transition-all bg-gradient-to-br from-orange-500/5 to-transparent border shadow-sm">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-5xl mb-2">🤝</div>
                                    <h3 className="text-2xl font-bold text-foreground">Comparte el conocimiento</h3>
                                    <p className="text-muted-foreground text-lg">
                                        Lo que más me satisface es ver a otros conseguir su FIRE.
                                        <strong className="text-foreground">Ayudar es mi nueva pasión</strong>.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-gradient-to-r from-blue-400 to-purple-600">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        ¿Quieres empezar tu propio camino al FIRE?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        No importa tu edad o situación actual. Si yo pude, tú también puedes.
                        Te ayudo completamente gratis.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                            onClick={() => window.location.href = '/calculadoras'}
                        >
                            <Calculator className="h-5 w-5 mr-2" />
                            Calcular mi FIRE
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-600"
                            onClick={() => window.location.href = '/contacto'}
                        >
                            <Coffee className="h-5 w-5 mr-2" />
                            Hablemos
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-8 text-white/70 text-sm">
                        <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Consultas gratuitas
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            Sin intereses comerciales
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            Experiencia real
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted py-16 border-t border-border">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-2xl">🔥</span>
                            <span className="text-xl font-bold text-foreground">Inversión Libre</span>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            Compartiendo mi camino hacia la independencia financiera.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:text-foreground"
                                onClick={() => window.location.href = '/'}
                            >
                                Inicio
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:text-foreground"
                                onClick={() => window.location.href = '/blog'}
                            >
                                Blog
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:text-foreground"
                                onClick={() => window.location.href = '/calculadoras'}
                            >
                                Calculadoras
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-muted-foreground hover:text-foreground"
                                onClick={() => window.location.href = '/contacto'}
                            >
                                Contacto
                            </Button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}