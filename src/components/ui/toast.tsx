'use client'

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2
} from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info" | "loading"
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"

export interface ToastData {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastProps extends ToastData {
  onRemove: (id: string) => void
  position: ToastPosition
}

interface ToastContextType {
  toasts: ToastData[]
  addToast: (toast: Omit<ToastData, 'id'>) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
}

// Context para gestión global
const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// Hook para usar toasts
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Componente Toast individual
const Toast = ({ id, type, title, description, duration = 5000, action, onRemove, position }: ToastProps) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLeaving, setIsLeaving] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const handleRemove = React.useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onRemove(id)
    }, 300) // Tiempo de animación de salida
  }, [id, onRemove])

  // Animación de entrada
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-dismiss timer
  React.useEffect(() => {
    if (type === 'loading') return // Los loading no se auto-cierran

    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleRemove()
      }, duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [duration, type, handleRemove])

  // Iconos y colores por tipo
  const toastConfig = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-900",
      iconClassName: "text-green-500"
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-50 border-red-200 text-red-900",
      iconClassName: "text-red-500"
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-50 border-yellow-200 text-yellow-900",
      iconClassName: "text-yellow-500"
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-900",
      iconClassName: "text-blue-500"
    },
    loading: {
      icon: Loader2,
      className: "bg-gray-50 border-gray-200 text-gray-900",
      iconClassName: "text-gray-500 animate-spin"
    }
  }

  const config = toastConfig[type]
  const IconComponent = config.icon

  // Animaciones de entrada/salida
  const getAnimationClass = () => {
    const baseClass = "transition-all duration-300 ease-in-out"

    if (isLeaving) {
      if (position.includes('right')) return `${baseClass} translate-x-full opacity-0`
      if (position.includes('left')) return `${baseClass} -translate-x-full opacity-0`
      return `${baseClass} -translate-y-full opacity-0`
    }

    if (!isVisible) {
      if (position.includes('right')) return `${baseClass} translate-x-full opacity-0`
      if (position.includes('left')) return `${baseClass} -translate-x-full opacity-0`
      return `${baseClass} -translate-y-full opacity-0`
    }

    return `${baseClass} translate-x-0 translate-y-0 opacity-100`
  }

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
        config.className,
        getAnimationClass()
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icono */}
      <IconComponent className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconClassName)} />

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        {description && (
          <div className="mt-1 text-sm opacity-90">{description}</div>
        )}

        {/* Botón de acción */}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Botón cerrar */}
      {type !== 'loading' && (
        <button
          onClick={handleRemove}
          className="flex-shrink-0 ml-2 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Barra de progreso para auto-dismiss */}
      {duration > 0 && type !== 'loading' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-30 animate-[shrink_var(--duration)_linear_forwards]"
            style={{ '--duration': `${duration}ms` } as React.CSSProperties}
          />
        </div>
      )}
    </div>
  )
}

// Provider de contexto
export const ToastProvider: React.FC<{
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}> = ({
  children,
  position = "top-right",
  maxToasts = 5
}) => {
    const [toasts, setToasts] = React.useState<ToastData[]>([])

    const addToast = React.useCallback((toastData: Omit<ToastData, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastData = { ...toastData, id }

      setToasts(prev => {
        const updated = [newToast, ...prev]
        // Mantener solo los últimos maxToasts
        return updated.slice(0, maxToasts)
      })

      return id
    }, [maxToasts])

    const removeToast = React.useCallback((id: string) => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const removeAllToasts = React.useCallback(() => {
      setToasts([])
    }, [])

    // Posiciones del contenedor
    const getPositionClasses = () => {
      switch (position) {
        case "top-right":
          return "top-4 right-4"
        case "top-left":
          return "top-4 left-4"
        case "bottom-right":
          return "bottom-4 right-4"
        case "bottom-left":
          return "bottom-4 left-4"
        case "top-center":
          return "top-4 left-1/2 transform -translate-x-1/2"
        case "bottom-center":
          return "bottom-4 left-1/2 transform -translate-x-1/2"
        default:
          return "top-4 right-4"
      }
    }

    return (
      <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
        {children}

        {/* Portal para renderizar toasts */}
        {typeof window !== 'undefined' && toasts.length > 0 && createPortal(
          <div
            className={cn(
              "fixed z-50 flex flex-col gap-2 pointer-events-none",
              getPositionClasses()
            )}
          >
            {toasts.map((toast) => (
              <div key={toast.id} className="pointer-events-auto">
                <Toast
                  {...toast}
                  onRemove={removeToast}
                  position={position}
                />
              </div>
            ))}
          </div>,
          document.body
        )}
      </ToastContext.Provider>
    )
  }

// Funciones helper para usar fácilmente
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastData>) => ({
    type: 'success' as const,
    title,
    description,
    ...options
  }),
  error: (title: string, description?: string, options?: Partial<ToastData>) => ({
    type: 'error' as const,
    title,
    description,
    ...options
  }),
  warning: (title: string, description?: string, options?: Partial<ToastData>) => ({
    type: 'warning' as const,
    title,
    description,
    ...options
  }),
  info: (title: string, description?: string, options?: Partial<ToastData>) => ({
    type: 'info' as const,
    title,
    description,
    ...options
  }),
  loading: (title: string, description?: string, options?: Partial<ToastData>) => ({
    type: 'loading' as const,
    title,
    description,
    duration: 0, // Loading no se auto-cierra
    ...options
  })
}