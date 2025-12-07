import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/request';
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ToastProvider } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata } from 'next';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Inversión Libre - Tu camino hacia la independencia financiera",
    description: "Aprende a conseguir la libertad financiera con estrategias FIRE probadas y vive como nómada digital. Calculadoras, educación y comunidad.",
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ToastProvider>
                            {children}
                        </ToastProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
