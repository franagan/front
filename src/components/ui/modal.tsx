'use client'

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    className?: string
    size?: "sm" | "md" | "lg" | "xl"
    showCloseButton?: boolean
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
}

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true
}: ModalProps) => {
    // Hook para manejar tecla ESC
    React.useEffect(() => {
        if (!closeOnEscape) return

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevenir scroll del body cuando modal está abierto
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose, closeOnEscape])

    // No renderizar si está cerrado
    if (!isOpen) return null

    // Tamaños del modal
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    }

    // Función para manejar clic en overlay
    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
            onClose()
        }
    }

    // Renderizar modal usando portal (fuera del DOM normal)
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay/Fondo oscuro */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleOverlayClick}
                aria-hidden="true"
            />

            {/* Contenedor del modal */}
            <div
                className={cn(
                    "relative w-full bg-background rounded-lg shadow-xl transition-all border border-border",
                    sizeClasses[size],
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
            >

                {/* Header con título y botón cerrar */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-xl font-semibold text-foreground"
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground"
                                aria-label="Cerrar modal"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}

                {/* Contenido del modal */}
                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>,
        document.body
    )
}

// Hook personalizado para facilitar el uso
export const useModal = () => {
    const [isOpen, setIsOpen] = React.useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)
    const toggleModal = () => setIsOpen(!isOpen)

    return {
        isOpen,
        openModal,
        closeModal,
        toggleModal
    }
}

export { Modal }