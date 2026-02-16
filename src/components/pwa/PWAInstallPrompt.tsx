'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/toast'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
    console.log('PWAInstallPrompt: Componente montado')
    const { addToast } = useToast()

    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Stash the event so it can be triggered later.
            const promptEvent = e as BeforeInstallPromptEvent
            setDeferredPrompt(promptEvent)

            console.log('PWA: beforeinstallprompt event fired')

            // Show a toast informing the user they can install the app
            addToast({
                type: 'info',
                title: '¡App disponible!',
                description: 'Puedes instalar Inversión Libre en tu dispositivo para un acceso más rápido.',
                duration: 15000,
                action: {
                    label: 'Instalar',
                    onClick: async () => {
                        console.log('PWA: Install button clicked')
                        await promptEvent.prompt()
                        const { outcome } = await promptEvent.userChoice
                        console.log(`PWA: User response to install prompt: ${outcome}`)
                        setDeferredPrompt(null)
                    }
                }
            })
        }

        window.addEventListener('beforeinstallprompt', handler)

        // Check if app is already installed
        const installedHandler = () => {
            console.log('PWA: Installed successfully')
            setDeferredPrompt(null)
            addToast({
                type: 'success',
                title: '¡Instalación completada!',
                description: 'Inversión Libre se ha instalado correctamente.',
                duration: 5000
            })
        }

        window.addEventListener('appinstalled', installedHandler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
            window.removeEventListener('appinstalled', installedHandler)
        }
    }, [addToast])

    return null // This component doesn't render anything visually, it just manages logic/toasts
}
