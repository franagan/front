'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import {
    LayoutDashboard,
    Briefcase,
    Wallet,
    Target,
    Calculator,
    ShieldAlert,
    Menu,
    X,
    TrendingUp,
    DollarSign,
    Landmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function Sidebar() {
    const pathname = usePathname()
    const { user } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)

    // Using basic Next.js routing, locale is in pathname. Let's extract it.
    // e.g. /es/mainboard -> locale is 'es'
    const locale = pathname.split('/')[1] || 'es'
    const basePath = `/${locale}/mainboard`

    const navItems = [
        { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
        { name: 'Patrimonio', href: `${basePath}/net-worth`, icon: Landmark },
        { name: 'Portfolio', href: `${basePath}/portfolio`, icon: Briefcase },
        // { name: 'Gastos', href: `${basePath}/expenses`, icon: DollarSign },
        { name: 'Gastos-Presupuestos', href: `${basePath}/budget`, icon: Wallet },
        { name: 'Objetivos', href: `${basePath}/goals`, icon: Target },
        { name: 'Calculadoras', href: `${basePath}/tools`, icon: Calculator },
    ]

    const toggleSidebar = () => setIsOpen(!isOpen)

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-card border-r border-border">
            <div className="flex items-center h-16 px-6 border-b border-border">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold tracking-tight">Inversión Libre</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== basePath

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "mr-3 flex-shrink-0 h-5 w-5",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Admin Menu */}
                {user?.role === 'ADMIN' && (
                    <div className="mt-8">
                        <div className="px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Administración
                        </div>
                        <nav className="space-y-1 px-3">
                            <Link
                                href={`${basePath}/admin`}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    pathname.startsWith(`${basePath}/admin`)
                                        ? "bg-red-500/10 text-red-500"
                                        : "text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                                )}
                            >
                                <ShieldAlert className="mr-3 flex-shrink-0 h-5 w-5" />
                                Panel Admin
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border text-foreground shadow-sm"
                onClick={toggleSidebar}
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="absolute top-4 right-4 z-50 lg:hidden">
                    <button onClick={toggleSidebar} className="p-2 text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <SidebarContent />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
                <SidebarContent />
            </div>
        </>
    )
}
