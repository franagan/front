import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Geist, Geist_Mono, Outfit, Manrope, Inter } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata, Viewport } from 'next';
import { AuthProvider } from "@/components/providers/AuthProvider";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import ChatbotWidget from "@/components/shared/ChatbotWidget";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

const manrope = Manrope({
    variable: "--font-manrope",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});
export const metadata: Metadata = {
    title: {
        template: '%s | Inversión Libre',
        default: 'Inversión Libre - Tu camino hacia la independencia financiera',
    },
    description: "Aprende a conseguir la libertad financiera con estrategias FIRE probadas y vive como nómada digital. Calculadoras, educación y comunidad.",
    keywords: ["libertad financiera", "FIRE", "inversiones", "presupuestos", "nómada digital", "finanzas personales"],
    authors: [{ name: "Inversión Libre Team" }],
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
        title: "Inversión Libre - Tu camino hacia la independencia financiera",
        description: "Aprende a conseguir la libertad financiera con estrategias FIRE probadas y vive como nómada digital.",
        url: 'https://inversion-libre.com',
        siteName: 'Inversión Libre',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Inversión Libre - Libertad Financiera',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Inversión Libre",
        description: "Gestión inteligente de inversiones y finanzas personales hacia el FIRE.",
        images: ['/twitter-image.png'],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Inversión Libre",
    },
};


export const viewport: Viewport = {
    themeColor: "#000000",
};


export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validar que el locale es soportado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // Cargar los mensajes para el locale actual
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${manrope.variable} ${inter.variable} antialiased bg-background text-foreground font-body`} suppressHydrationWarning>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ToastProvider>
                            <AuthProvider>
                                <PWAInstallPrompt />
                                {children}
                                <ChatbotWidget />
                            </AuthProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
