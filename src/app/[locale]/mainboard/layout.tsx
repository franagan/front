'use client'

import { useAuthStore } from "@/stores/useAuthStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ReactNode, useTransition } from 'react';
import { usePathname, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from 'next-intl';
import ReactCountryFlag from "react-country-flag"
import { Sidebar } from "@/components/mainboard/Sidebar"
import { DynamicBreadcrumb } from "@/components/mainboard/DynamicBreadcrumb"

export default function MainboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { status } = useSession();
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter()
    const { user, logout, isAuthenticated, isHydrated } = useAuthStore()
    const { theme, setTheme } = useTheme()
    const tNav = useTranslations('navigation');
    const t = useTranslations('mainboard');
    const firstName = user?.firstName

    useEffect(() => {
        // Only redirect if hydration is complete AND we are not authenticated in store AND not authenticated in NextAuth (meaning no potential token exchange pending)
        if (isHydrated && !isAuthenticated && status !== 'authenticated' && status !== 'loading') {
            router.push('/');
        }
    }, [isAuthenticated, isHydrated, status, router]);

    // Show loading if:
    // 1. Store is not hydrated yet
    // 2. NextAuth is loading
    // 3. NextAuth is authenticated but Store is not yet authenticated (token exchange in progress)
    if (!isHydrated || status === 'loading' || (status === 'authenticated' && !isAuthenticated)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
        )
    }

    if (!user) {
        return null;
    }

    if (!isHydrated || !user) {
        return null // Or a loading spinner
    }

    const onLanguageChange = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            {/* Main content area */}
            <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
                {/* Top Navbar */}
                <header className="bg-background/80 border-b border-border sticky top-0 z-40 backdrop-blur-sm">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        {/* Left Side: Space for mobile menu button or Breadcrumbs */}
                        <div className="flex items-center flex-1">
                            <div className="hidden lg:block">
                                <DynamicBreadcrumb />
                            </div>
                        </div>

                        {/* Right Side: User Controls */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-muted-foreground">{t('welcome')}</p>
                                <p className="font-semibold">{firstName}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    logout()
                                    router.push('/')
                                }}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                {tNav('logout')}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="border-border text-foreground hover:bg-accent"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onLanguageChange}
                                disabled={isPending}
                                className="border-border text-foreground hover:bg-accent min-w-[3rem] hover:bg-yellow-600"
                            >
                                <ReactCountryFlag
                                    countryCode={locale === 'es' ? 'ES' : 'GB'}
                                    svg
                                    style={{ width: '1.5em', height: '1em' }}
                                />
                            </Button>
                        </div>
                    </div>
                    {/* Mobile Breadcrumb (Below Header) */}
                    <div className="lg:hidden px-4 py-2 border-t border-border bg-background/50">
                        <DynamicBreadcrumb />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
