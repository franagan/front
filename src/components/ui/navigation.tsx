'use client'

import * as React from "react"
import { useState, useTransition } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    TrendingUp,
    Menu,
    X,
    Home,
    BookOpen,
    Calculator,
    User,
    LogIn,
    Moon,
    Sun
} from "lucide-react"
import AuthModal from "@/components/auth/AuthModal"
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';

interface NavigationProps {
    className?: string
}

const Navigation = ({ className }: NavigationProps) => {
    const t = useTranslations('navigation');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
    const { theme, setTheme } = useTheme()

    // Enlaces principales del menú
    const mainLinks = [
        {
            href: "/",
            label: t('home'),
            icon: Home
        },
        {
            href: "/blog",
            label: t('blog'),
            icon: BookOpen
        },
        {
            href: "/calculadoras",
            label: t('calculators'),
            icon: Calculator
        },
        {
            href: "/sobre-mi",
            label: t('about'),
            icon: User
        }
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const openAuthModal = (tab: 'login' | 'register') => {
        setAuthModalTab(tab)
        setIsAuthModalOpen(true)
        setIsMobileMenuOpen(false)
    }

    const onLanguageChange = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <>
            <nav className={cn(
                "bg-background border-b border-border sticky top-0 z-50 shadow-sm backdrop-blur-sm",
                className
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo y marca */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                                {/* Logo circular negro con dorado */}
                                <div className="h-10 w-10 bg-foreground dark:bg-background border-2 border-yellow-500 rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div className="hidden sm:block">
                                    <span className="text-xl font-bold text-foreground">Inversión Libre</span>
                                    <span className="hidden lg:block text-sm text-muted-foreground ml-2">Educación Financiera</span>
                                </div>
                            </Link>
                        </div>

                        {/* Enlaces principales - Desktop */}
                        <div className="hidden md:flex items-center space-x-8">
                            {mainLinks.map((link) => {
                                const IconComponent = link.icon
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center space-x-1 text-foreground hover:text-yellow-600 transition-colors font-medium"
                                    >
                                        <IconComponent className="h-4 w-4" />
                                        <span>{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Botones de acción - Desktop */}
                        <div className="hidden md:flex items-center space-x-3 ml-4 ">
                            <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')} className="hover:bg-yellow-600">
                                <LogIn className="h-4 w-4 mr-2 " />
                                {t('login')}
                            </Button>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700" onClick={() => openAuthModal('register')}>
                                {t('register')}
                            </Button>
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            {/* Selector de Tema */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                aria-label="Toggle theme"
                                className="border-border text-foreground hover:bg-accent hover:bg-yellow-600"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4 " /> : <Moon className="h-4 w-4" />}
                            </Button>

                            {/* Selector de Idioma */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onLanguageChange}
                                disabled={isPending}
                                className="border-border text-foreground hover:bg-accent min-w-[3rem] hover:bg-yellow-600"
                            >
                                {locale === 'es' ? 'ES' : 'EN'}
                            </Button>
                        </div>

                        {/* Botón menú móvil */}
                        <div className="md:hidden flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onLanguageChange}
                                disabled={isPending}
                            >
                                {locale === 'es' ? 'ES' : 'EN'}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleMobileMenu}
                                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Menú móvil */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-border">
                            <div className="px-2 pt-2 pb-3 space-y-1">

                                {/* Enlaces móviles */}
                                {mainLinks.map((link) => {
                                    const IconComponent = link.icon
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center space-x-3 px-3 py-2 rounded-md text-foreground hover:text-yellow-600 hover:bg-accent transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                            <span className="font-medium">{link.label}</span>
                                        </Link>
                                    )
                                })}

                                {/* Separador */}
                                <div className="border-t border-border my-3"></div>

                                {/* Botones móviles */}
                                <div className="space-y-2 px-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start"
                                        onClick={() => openAuthModal('login')}
                                    >
                                        <LogIn className="h-4 w-4 mr-2" />
                                        {t('login')}
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                                        onClick={() => openAuthModal('register')}
                                    >
                                        {t('register')}
                                    </Button>

                                </div>


                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                defaultTab={authModalTab}
            />
        </>
    )
}

export { Navigation }