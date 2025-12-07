'use client'

import { Navigation } from "@/components/ui/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineFinancialChart } from "@/components/ui/chart"
import {
    User,
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
    Camera,
    Mail,
    ExternalLink,
    CheckCircle,
    Star,
    Clock,
    DollarSign,
    Briefcase,
    GraduationCap,
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
                                    <div className="text-sm text-gray-400">Desde FIRE</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400">500K+</div>
                                    <div className="text-sm text-gray-400">Suscriptores</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400">25</div>
                                    <div className="text-sm text-gray-400">Países visitados</div>
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
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
                                            <h3 className="text-2xl font-bold text-white mb-2">Francisco Palero</h3>
                                            <p className="text-muted-foreground">Nómada Digital & Educador FIRE</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-center gap-2 text-gray-300">
                                                <MapPin className="h-4 w-4" />
                                                <span>Actualmente en Europa</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-gray-300">
                                                <Calendar className="h-4 w-4" />
                                                <span>FIRE desde 2019</span>
                                            </div>
                                            <div className="flex items-center justify-center gap-2 text-gray-300">
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
            <section className="py-16 bg-muted/30 dark:bg-gray-800/30">
                <div className="max-w-4xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">📖 Mi Historia hacia el FIRE</h2>
                        <p className="text-xl text-muted-foreground">
                            Desde desarrollador con salario normal hasta independencia financiera total
                        </p>
                    </div>

                    <Card className="bg-gray-800 border-gray-700 mb-12">
                        <CardHeader>
                            <CardTitle className="text-white">📈 Evolución de mi Patrimonio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineFinancialChart
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
                                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                                            {item.year}
                                        </Badge>
                                    </div>
                                    <p className="text-gray-300">{item.description}</p>
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
                            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-400/50 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white">
                                            {achievement.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {achievement.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2">
                                                {achievement.description}
                                            </p>
                                            <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs">
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
            <section className="py-16 bg-muted/30 dark:bg-gray-800/30">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">🌍 Vida Nómada Digital</h2>
                        <p className="text-xl text-gray-400">
                            Viajando por Europa en autocaravana desde que conseguí mi FIRE
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Plane className="h-5 w-5 text-green-400" />
                                    Países Visitados (25)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {countries.map((country, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-300">
                                            <span>{country}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-400 mb-2">
                                        <Compass className="h-4 w-4" />
                                        <span className="font-semibold">Próximo destino</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        Explorando los Balcanes: Albania, Macedonia del Norte y Kosovo.
                                        ¡Sígueme en YouTube para ver el viaje!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">🚐 Mi Oficina Móvil</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-gray-300">
                                        Trabajo desde una autocaravana equipada con todo lo necesario:
                                        internet por satélite, placas solares y un setup de grabación completo.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            <span className="text-gray-300">Internet Starlink</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            <span className="text-gray-300">400W Paneles solares</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            <span className="text-gray-300">Estudio móvil</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            <span className="text-gray-300">Autonomía 7 días</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white">💰 Gastos de Vida Nómada</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Combustible</span>
                                            <span className="text-white">€400/mes</span>
                                        </div>
                                        <Progress value={40} className="h-2" variant="default" />

                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Comida</span>
                                            <span className="text-white">€300/mes</span>
                                        </div>
                                        <Progress value={30} className="h-2" variant="success" />

                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Camping/Parkings</span>
                                            <span className="text-white">€200/mes</span>
                                        </div>
                                        <Progress value={20} className="h-2" variant="warning" />

                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Otros</span>
                                            <span className="text-white">€100/mes</span>
                                        </div>
                                        <Progress value={10} className="h-2" variant="destructive" />
                                    </div>

                                    <div className="pt-4 border-t border-gray-600">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-white">Total mensual:</span>
                                            <span className="text-green-400">€1,000</span>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Vs €2,500 viviendo en Madrid
                                        </p>
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
                        <h2 className="text-3xl font-bold mb-4">💭 Mi Filosofía</h2>
                        <p className="text-xl text-gray-400">
                            Lo que he aprendido en mi camino hacia y después del FIRE
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl">🎯</div>
                                    <h3 className="text-xl font-semibold text-white">FIRE no es sobre dinero</h3>
                                    <p className="text-gray-300">
                                        Es sobre <strong>libertad de elección</strong>. El dinero es solo la herramienta
                                        que te permite decidir cómo pasar tu tiempo.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl">🌱</div>
                                    <h3 className="text-xl font-semibold text-white">Empezar es lo importante</h3>
                                    <p className="text-gray-300">
                                        No necesitas ser perfecto desde el día 1. Yo cometí muchos errores,
                                        pero <strong>empezar temprano</strong> fue la clave.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl">🎓</div>
                                    <h3 className="text-xl font-semibold text-white">Educación continua</h3>
                                    <p className="text-gray-300">
                                        Los mercados evolucionan, las estrategias cambian.
                                        <strong>Nunca pares de aprender</strong> sobre finanzas e inversión.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-700">
                            <CardContent className="p-8">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl">🤝</div>
                                    <h3 className="text-xl font-semibold text-white">Comparte el conocimiento</h3>
                                    <p className="text-gray-300">
                                        Lo que más me satisface es ver a otros conseguir su FIRE.
                                        <strong>Ayudar es mi nueva pasión</strong>.
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
            <footer className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-2xl">🔥</span>
                            <span className="text-xl font-bold text-white">Inversión Libre</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Compartiendo mi camino hacia la independencia financiera.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={() => window.location.href = '/'}
                            >
                                Inicio
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={() => window.location.href = '/blog'}
                            >
                                Blog
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                onClick={() => window.location.href = '/calculadoras'}
                            >
                                Calculadoras
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
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