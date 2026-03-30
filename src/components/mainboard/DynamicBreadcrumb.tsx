'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export function DynamicBreadcrumb() {
    const pathname = usePathname()

    // Example: /es/mainboard/portfolio -> ['', 'es', 'mainboard', 'portfolio']
    const segments = pathname.split('/').filter(Boolean)

    // We want to skip the locale segment (e.g. 'es' or 'en')
    // and start from 'mainboard'
    const breadcrumbSegments = segments.slice(1)

    const formatSegment = (segment: string) => {
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    }

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link
                href="/mainboard"
                className="flex items-center hover:text-foreground transition-colors"
                title="Ir al inicio del panel"
            >
                <Home className="h-4 w-4" />
            </Link>

            {breadcrumbSegments.map((segment, index) => {
                const isLast = index === breadcrumbSegments.length - 1

                // Reconstruct path up to this segment
                // segments[0] is the locale.
                const href = '/' + segments[0] + '/' + breadcrumbSegments.slice(0, index + 1).join('/')

                return (
                    <div key={href} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-1" />
                        {isLast ? (
                            <span className="font-medium text-foreground" aria-current="page">
                                {formatSegment(segment)}
                            </span>
                        ) : (
                            <Link
                                href={href}
                                className="hover:text-foreground transition-colors"
                            >
                                {formatSegment(segment)}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
