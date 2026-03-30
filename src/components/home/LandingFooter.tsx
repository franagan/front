'use client'

import { Button } from "@/components/ui/button"
import { Youtube } from "lucide-react"
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function LandingFooter() {
    const tFooter = useTranslations('footer');

    const sections = [
        {
            title: tFooter('tools.title'),
            links: [
                { label: tFooter('tools.fireCalculator'), href: "#" },
                { label: tFooter('tools.compoundInterest'), href: "#" },
                { label: tFooter('tools.expensePlanner'), href: "#" },
                { label: tFooter('tools.progressTracker'), href: "#" }
            ]
        },
        {
            title: tFooter('education.title'),
            links: [
                { label: tFooter('education.beginnersGuide'), href: "#" },
                { label: tFooter('education.investingStrategies'), href: "#" },
                { label: tFooter('education.digitalNomadism'), href: "#" },
                { label: tFooter('education.successStories'), href: "#" }
            ]
        },
        {
            title: tFooter('support.title'),
            links: [
                { label: tFooter('support.contact'), href: "/contacto" },
                { label: tFooter('support.faq'), href: "/contacto" },
                { label: tFooter('support.community'), href: "#" },
                { label: tFooter('support.privacyPolicy'), href: "#" }
            ]
        }
    ];

    return (
        <footer className="bg-neutral-950 text-neutral-400 py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

                    {/* Brand Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-primary-foreground text-3xl shadow-lg shadow-primary/20">🔥</div>
                            <span className="text-2xl font-black text-white tracking-tighter">{tFooter('brand')}</span>
                        </div>
                        <p className="text-lg leading-relaxed max-w-sm">
                            {tFooter('description')}
                        </p>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-full font-bold px-8"
                                onClick={() => window.open('https://www.youtube.com/@InversionLibre', '_blank')}
                                aria-label="YouTube"
                            >
                                <Youtube className="h-5 w-5 mr-3" />
                                {tFooter('youtube')}
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h4 className="font-bold text-white text-lg tracking-wide">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link
                                            href={link.href}
                                            className="hover:text-primary transition-colors duration-200 block"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/5 mt-20 pt-10 text-center flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-medium">{tFooter('rights')}</p>
                    <div className="flex gap-8 text-sm font-bold text-neutral-500">
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
