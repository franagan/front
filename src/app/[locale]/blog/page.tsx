'use client'

import { Navigation } from "@/components/ui/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import { useTranslations } from "next-intl"
import {
    Search,
    Calendar,
    Clock,
    // User,
    // TrendingUp,
    // Target,
    // DollarSign,
    BookOpen,
    Star,
    ArrowRight,
    Filter,
    Tag,
    Eye,
    ThumbsUp,
    // Share2,
    // Bookmark
} from "lucide-react"

// Datos de artículos de ejemplo
const articles = [
    {
        id: 'que-es-fire',
        title: '¿Qué es FIRE? Guía completa para principiantes',
        excerpt: 'Descubre qué significa Financial Independence, Retire Early y cómo puedes aplicar esta filosofía para conseguir tu libertad financiera.',
        content: 'El método FIRE (Financial Independence, Retire Early) es una estrategia financiera que te permite conseguir la independencia económica y retirarte mucho antes de la edad tradicional...',
        author: 'Francisco Palero',
        publishDate: '2024-01-15',
        readTime: '8 min',
        category: 'fundamentals',
        tags: ['FIRE', 'Principiantes', 'Libertad Financiera'],
        views: 12500,
        likes: 450,
        featured: true,
        image: '🔥'
    },
    {
        id: 'tipos-de-fire',
        title: 'Los diferentes tipos de FIRE: Lean, Regular y Fat',
        excerpt: 'No todos los FIRE son iguales. Aprende las diferencias entre Lean FIRE, Regular FIRE y Fat FIRE para elegir el que mejor se adapte a ti.',
        content: 'Existen diferentes enfoques del método FIRE según tu estilo de vida objetivo y la cantidad de dinero que necesites para mantenerte...',
        author: 'Francisco Palero',
        publishDate: '2024-01-10',
        readTime: '6 min',
        category: 'strategy',
        tags: ['Lean FIRE', 'Fat FIRE', 'Planificación'],
        views: 8900,
        likes: 320,
        featured: true,
        image: '🎯'
    },
    {
        id: 'regla-4-por-ciento',
        title: 'La Regla del 4%: La base matemática del FIRE',
        excerpt: 'Entiende la regla fundamental que permite a millones de personas vivir de sus inversiones para siempre.',
        content: 'La Regla del 4% es el principio matemático que sustenta todo el método FIRE. Esta regla establece que puedes retirar el 4% de tu patrimonio...',
        author: 'Francisco Palero',
        publishDate: '2024-01-05',
        readTime: '10 min',
        category: 'fundamentals',
        tags: ['Regla 4%', 'Matemáticas', 'Retiros'],
        views: 15200,
        likes: 680,
        featured: true,
        image: '📊'
    },
    {
        id: 'primeros-pasos-fire',
        title: 'Primeros pasos hacia el FIRE: Por dónde empezar',
        excerpt: 'Una guía práctica paso a paso para comenzar tu camino hacia la independencia financiera hoy mismo.',
        content: 'Conseguir el FIRE puede parecer abrumador al principio, pero con los pasos correctos puedes empezar tu camino hoy...',
        author: 'Francisco Palero',
        publishDate: '2024-01-01',
        readTime: '12 min',
        category: 'savings',
        tags: ['Primeros Pasos', 'Planificación', 'Presupuesto'],
        views: 9800,
        likes: 410,
        featured: false,
        image: '🚀'
    },
    {
        id: 'inversiones-para-fire',
        title: 'Las mejores inversiones para conseguir el FIRE',
        excerpt: 'Descubre qué instrumentos financieros son más efectivos para construir un patrimonio que genere ingresos pasivos.',
        content: 'No todas las inversiones son iguales cuando tu objetivo es el FIRE. Algunas son más efectivas para generar ingresos pasivos...',
        author: 'Francisco Palero',
        publishDate: '2023-12-28',
        readTime: '15 min',
        category: 'investing',
        tags: ['ETFs', 'Dividendos', 'Portfolio'],
        views: 11300,
        likes: 520,
        featured: false,
        image: '💰'
    },
    {
        id: 'nomadismo-digital-fire',
        title: 'FIRE + Nomadismo Digital: La combinación perfecta',
        excerpt: 'Cómo combinar la independencia financiera con el estilo de vida nómada para maximizar tu libertad.',
        content: 'El FIRE y el nomadismo digital son dos filosofías que se complementan perfectamente. Mientras el FIRE te da libertad financiera...',
        author: 'Francisco Palero',
        publishDate: '2023-12-20',
        readTime: '9 min',
        category: 'lifestyle',
        tags: ['Nomadismo', 'Viajes', 'Libertad'],
        views: 7600,
        likes: 290,
        featured: false,
        image: '✈️'
    },
    {
        id: 'psicologia-del-dinero',
        title: 'Psicología del Dinero: El mayor obstáculo hacia el FIRE',
        excerpt: 'Tu mente es tu mejor aliada o tu peor enemiga. Descubre cómo reprogramar tus hábitos de consumo.',
        content: 'La mayoría de la gente piensa que el FIRE es una cuestión de matemáticas, pero la realidad es que es un 80% psicología...',
        author: 'Francisco Palero',
        publishDate: '2024-02-01',
        readTime: '11 min',
        category: 'fundamentals',
        tags: ['Psicología', 'Mentalidad', 'Hábitos'],
        views: 14200,
        likes: 560,
        featured: true,
        image: '🧠'
    },
    {
        id: 'dividendos-vs-indexados',
        title: 'Dividendos vs Indexados: ¿Cuál es mejor para el FIRE?',
        excerpt: 'Análisis profundo de las dos estrategias más populares para vivir de las rentas en el siglo XXI.',
        content: 'Si quieres vivir de tus inversiones, tarde o temprano te enfrentarás a este debate: ¿Cartera de dividendos o Indexación?',
        author: 'Francisco Palero',
        publishDate: '2024-01-25',
        readTime: '14 min',
        category: 'investing',
        tags: ['Dividendos', 'Indexados', 'ETFs'],
        views: 18500,
        likes: 890,
        featured: true,
        image: '⚖️'
    },
    {
        id: 'arbitraje-geografico',
        title: 'Arbitraje Geográfico: Vive como un rey en el retiro',
        excerpt: 'Cómo multiplicar tu patrimonio viviendo en países con menor coste de vida sin sacrificar calidad.',
        content: 'El arbitraje geográfico es el "hack" más potente del movimiento FIRE. Consiste en ganar dinero en una moneda fuerte...',
        author: 'Francisco Palero',
        publishDate: '2024-01-20',
        readTime: '10 min',
        category: 'lifestyle',
        tags: ['Viajes', 'Coste de Vida', 'GeoArbitraje'],
        views: 9200,
        likes: 340,
        featured: false,
        image: '🌍'
    },
    {
        id: 'impuestos-fire-espana',
        title: 'Guía de Impuestos para FIRE en España',
        excerpt: 'No es lo que ganas, sino lo que mantienes. Aprende a declarar tus inversiones de forma eficiente.',
        content: 'La fiscalidad puede ser la diferencia entre retirarte 5 años antes o 5 años después. En España, existen ventajas...',
        author: 'Francisco Palero',
        publishDate: '2024-02-05',
        readTime: '13 min',
        category: 'strategy',
        tags: ['Impuestos', 'España', 'Hacienda'],
        views: 22000,
        likes: 1200,
        featured: true,
        image: '📑'
    },
    {
        id: 'fire-despues-de-los-40',
        title: 'FIRE después de los 40: ¿Es demasiado tarde?',
        excerpt: 'Nunca es tarde para empezar. Estrategias específicas para quienes descubren el FIRE a mitad de carrera.',
        content: '¿Crees que el FIRE es solo para veinteañeros que viven con sus padres? Nada más lejos de la realidad...',
        author: 'Francisco Palero',
        publishDate: '2024-02-10',
        readTime: '9 min',
        category: 'strategy',
        tags: ['Edad', 'Carrera', 'Planificación'],
        views: 6500,
        likes: 210,
        featured: false,
        image: '⏳'
    }
]

const categories = ['all', 'fundamentals', 'strategy', 'savings', 'investing', 'lifestyle']

export default function BlogPage() {
    const t = useTranslations('blog')
    const tFooter = useTranslations('footer')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Filtrar artículos
    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    const featuredArticles = filteredArticles.filter(article => article.featured)
    const regularArticles = filteredArticles.filter(article => !article.featured)

    return (
        <div className="min-h-screen">

            {/* Navigation */}
            <Navigation />

            {/* Hero Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10" />

                <div className="relative max-w-7xl mx-auto px-8 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="space-y-4">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold">
                                {t('hero.badge')}
                            </Badge>
                            <h1 className="text-5xl font-bold leading-tight">
                                {t('hero.title')}{' '}
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"> {t('hero.highlight')}</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {t('hero.description')}
                            </p>
                        </div>

                        {/* Estadísticas del blog */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">{articles.length}</div>
                                <div className="text-sm text-muted-foreground">{t('stats.articles')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {Math.round(articles.reduce((sum, article) => sum + article.views, 0) / 1000)}K
                                </div>
                                <div className="text-sm text-muted-foreground">{t('stats.views')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {articles.reduce((sum, article) => sum + parseInt(article.readTime), 0)}
                                </div>
                                <div className="text-sm text-muted-foreground">{t('stats.minutes')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filtros y Búsqueda */}
            <section className="py-8 bg-muted/50 border-y border-border">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-center">

                        {/* Barra de búsqueda */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-input border-border text-foreground placeholder-muted-foreground"
                            />
                        </div>

                        {/* Filtros por categoría */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="h-4 w-4 text-gray-400" />
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className={selectedCategory === category
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "text-muted-foreground"
                                    }
                                >
                                    {t(`categories.${category}`)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Artículos Destacados */}
            {featuredArticles.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex items-center gap-2 mb-8">
                            <Star className="h-6 w-6 text-yellow-400" />
                            <h2 className="text-3xl font-bold">{t('featured.title')}</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {featuredArticles.map((article) => (
                                <Card key={article.id} className="bg-card border-border hover:border-yellow-400/50 transition-all group">
                                    <CardHeader className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="text-4xl">{article.image}</div>
                                            <Badge className="bg-yellow-900 text-yellow-300">
                                                {t('featured.badge')}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    {t(`categories.${article.category}`)}
                                                </Badge>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {article.readTime}
                                                </div>
                                            </div>

                                            <CardTitle className="text-foreground group-hover:text-yellow-400 transition-colors">
                                                {article.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex flex-wrap gap-1">
                                            {article.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                                                    <Tag className="h-2 w-2 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    {article.views.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-3 w-3" />
                                                    {article.likes}
                                                </div>
                                            </div>

                                            <Link href={`/blog/${article.id}`}>
                                                <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-600">
                                                    {t('readMore')}
                                                    <ArrowRight className="h-3 w-3 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Todos los Artículos */}
            <section className="py-16 bg-muted/20">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="flex items-center gap-2 mb-8">
                        <BookOpen className="h-6 w-6 text-blue-400" />
                        <h2 className="text-3xl font-bold">
                            {selectedCategory === 'all' ? t('allArticles') : `${t('articlesOf')} ${t(`categories.${selectedCategory}`)}`}
                        </h2>
                        <span className="text-gray-400">({filteredArticles.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {regularArticles.map((article) => (
                            <Card key={article.id} className="bg-card border-border hover:border-border/80 transition-all group">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="text-3xl flex-shrink-0">{article.image}</div>

                                        <div className="flex-1 space-y-3">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <Badge variant="outline" className="text-muted-foreground">
                                                        {t(`categories.${article.category}`)}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(article.publishDate).toLocaleDateString('es-ES')}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {article.readTime}
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-semibold text-foreground group-hover:text-yellow-400 transition-colors">
                                                    {article.title}
                                                </h3>
                                            </div>

                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {article.excerpt}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {article.views.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ThumbsUp className="h-3 w-3" />
                                                        {article.likes}
                                                    </div>
                                                </div>

                                                <Link href={`/blog/${article.id}`}>
                                                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                                                        {t('read')}
                                                        <ArrowRight className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">{t('noResults.title')}</h3>
                            <p className="text-gray-500">{t('noResults.description')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA para Newsletter */}
            <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h2 className="text-4xl font-bold text-black mb-6">
                        {t('newsletter.title')}
                    </h2>
                    <p className="text-xl text-black/80 mb-8">
                        {t('newsletter.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            placeholder={t('newsletter.placeholder')}
                            className="bg-white border-white text-black placeholder-gray-500"
                        />
                        <Button className="bg-black text-yellow-400 hover:bg-gray-900 whitespace-nowrap">
                            {t('newsletter.button')}
                        </Button>
                    </div>

                    <p className="text-sm text-black/60 mt-4">
                        {t('newsletter.spam')}
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted py-16 border-t border-border">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🔥</span>
                                <span className="text-xl font-bold text-foreground">{tFooter('brand')}</span>
                            </div>
                            <p className="text-muted-foreground">
                                {tFooter('description')}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-foreground mb-4">{tFooter('popular')}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="/blog/que-es-fire" className="hover:text-yellow-400 transition-colors">¿Qué es FIRE?</Link></li>
                                <li><Link href="/blog/regla-4-por-ciento" className="hover:text-yellow-400 transition-colors">La Regla del 4%</Link></li>
                                <li><Link href="/blog/tipos-de-fire" className="hover:text-yellow-400 transition-colors">Tipos de FIRE</Link></li>
                                <li><Link href="/blog/primeros-pasos-fire" className="hover:text-yellow-400 transition-colors">Primeros Pasos</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-foreground mb-4">{tFooter('categories')}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="/blog?categoria=fundamentos" className="hover:text-yellow-400 transition-colors">{t('categories.fundamentals')}</Link></li>
                                <li><Link href="/blog?categoria=estrategia" className="hover:text-yellow-400 transition-colors">{t('categories.strategy')}</Link></li>
                                <li><Link href="/blog?categoria=inversiones" className="hover:text-yellow-400 transition-colors">{t('categories.investing')}</Link></li>
                                <li><Link href="/blog?categoria=lifestyle" className="hover:text-yellow-400 transition-colors">{t('categories.lifestyle')}</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-foreground mb-4">{tFooter('tools.title')}</h4>
                            <ul className="space-y-2 text-muted-foreground">
                                <li><Link href="/" className="hover:text-yellow-400 transition-colors">{tFooter('tools.fireCalculator')}</Link></li>
                                <li><Link href="/contacto" className="hover:text-yellow-400 transition-colors">{tFooter('support.contact')}</Link></li>
                                <li><Link href="/sobre-mi" className="hover:text-yellow-400 transition-colors">{t('hero.title')}</Link></li>
                                <li><a href="https://www.youtube.com/@InversionLibre" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">{tFooter('youtube')}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
                        <p>{tFooter('rights')}</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}