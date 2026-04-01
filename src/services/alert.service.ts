import axios from 'axios'
import {
    Alert,
    CreateAlertRequest,
    UpdateAlertRequest,
    AlertSummary,
    AlertApiResponse
} from '@/types/alert.types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para agregar el token JWT a las peticiones
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const storage = localStorage.getItem('auth-storage')
        if (storage) {
            try {
                const { state } = JSON.parse(storage)
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`
                }
            } catch {
                // Token not available
            }
        }
    }
    return config
})

const alertService = {
    /**
     * Obtener todas las alertas del usuario
     */
    getAlerts: async (): Promise<AlertApiResponse<Alert[]>> => {
        const response = await api.get<AlertApiResponse<Alert[]>>('/alerts')
        return response.data
    },

    /**
     * Obtener alertas activas del usuario
     */
    getActiveAlerts: async (): Promise<AlertApiResponse<Alert[]>> => {
        const response = await api.get<AlertApiResponse<Alert[]>>('/alerts/active')
        return response.data
    },

    /**
     * Obtener alertas disparadas del usuario
     */
    getTriggeredAlerts: async (): Promise<AlertApiResponse<Alert[]>> => {
        const response = await api.get<AlertApiResponse<Alert[]>>('/alerts/triggered')
        return response.data
    },

    /**
     * Obtener resumen de alertas
     */
    getAlertSummary: async (): Promise<AlertApiResponse<AlertSummary>> => {
        const response = await api.get<AlertApiResponse<AlertSummary>>('/alerts/summary')
        return response.data
    },

    /**
     * Obtener una alerta especifica por ID
     */
    getAlertById: async (id: string): Promise<AlertApiResponse<Alert>> => {
        const response = await api.get<AlertApiResponse<Alert>>(`/alerts/${id}`)
        return response.data
    },

    /**
     * Crear una nueva alerta
     */
    createAlert: async (data: CreateAlertRequest): Promise<AlertApiResponse<Alert>> => {
        const response = await api.post<AlertApiResponse<Alert>>('/alerts', data)
        return response.data
    },

    /**
     * Actualizar una alerta existente
     */
    updateAlert: async (id: string, data: UpdateAlertRequest): Promise<AlertApiResponse<Alert>> => {
        const response = await api.put<AlertApiResponse<Alert>>(`/alerts/${id}`, data)
        return response.data
    },

    /**
     * Eliminar una alerta
     */
    deleteAlert: async (id: string): Promise<AlertApiResponse<void>> => {
        const response = await api.delete<AlertApiResponse<void>>(`/alerts/${id}`)
        return response.data
    },

    /**
     * Descartar una alerta disparada
     */
    dismissAlert: async (id: string): Promise<AlertApiResponse<Alert>> => {
        const response = await api.post<AlertApiResponse<Alert>>(`/alerts/${id}/dismiss`)
        return response.data
    },

    /**
     * Reactivar una alerta
     */
    reactivateAlert: async (id: string): Promise<AlertApiResponse<Alert>> => {
        const response = await api.post<AlertApiResponse<Alert>>(`/alerts/${id}/reactivate`)
        return response.data
    },

    /**
     * Refrescar precio de un simbolo
     */
    refreshPrice: async (symbol: string): Promise<AlertApiResponse<number>> => {
        const response = await api.post<AlertApiResponse<number>>('/alerts/refresh-price', null, {
            params: { symbol }
        })
        return response.data
    }
}

export default alertService