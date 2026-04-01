/**
 * Servicio para generación de reportes financieros
 *
 * Endpoints disponibles:
 * - GET /api/reports/portfolio/pdf - Reporte PDF del portafolio
 * - GET /api/reports/investments/excel - Reporte Excel de inversiones
 * - GET /api/reports/transactions/csv - Reporte CSV de transacciones
 * - GET /api/reports/financial-summary/pdf - Resumen financiero PDF
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Crear instancia de axios con configuración
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 segundos para archivos grandes
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

/**
 * Descarga un archivo blob
 */
const downloadBlob = (data: BlobPart, filename: string, mimeType: string) => {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Genera un nombre de archivo con timestamp
 */
const generateFilename = (baseName: string, extension: string): string => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `inversion_libre_${baseName}_${timestamp}.${extension}`;
};

export const reportService = {
    /**
     * Descarga el reporte PDF del portafolio
     */
    async downloadPortfolioPdf(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.get('/reports/portfolio/pdf', {
                responseType: 'blob',
            });

            const filename = generateFilename('portafolio', 'pdf');
            downloadBlob(response.data, filename, 'application/pdf');

            return { success: true, message: 'Reporte PDF descargado exitosamente' };
        } catch (error) {
            console.error('Error descargando PDF del portafolio:', error);
            return { success: false, message: 'Error al descargar el reporte PDF' };
        }
    },

    /**
     * Descarga el reporte Excel de inversiones
     */
    async downloadInvestmentsExcel(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.get('/reports/investments/excel', {
                responseType: 'blob',
            });

            const filename = generateFilename('inversiones', 'xlsx');
            downloadBlob(response.data, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            return { success: true, message: 'Reporte Excel descargado exitosamente' };
        } catch (error) {
            console.error('Error descargando Excel de inversiones:', error);
            return { success: false, message: 'Error al descargar el reporte Excel' };
        }
    },

    /**
     * Descarga el reporte CSV de transacciones
     */
    async downloadTransactionsCsv(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.get('/reports/transactions/csv', {
                responseType: 'text',
            });

            const filename = generateFilename('transacciones', 'csv');
            downloadBlob(response.data, filename, 'text/csv');

            return { success: true, message: 'Reporte CSV descargado exitosamente' };
        } catch (error) {
            console.error('Error descargando CSV de transacciones:', error);
            return { success: false, message: 'Error al descargar el reporte CSV' };
        }
    },

    /**
     * Descarga el resumen financiero en PDF
     */
    async downloadFinancialSummaryPdf(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await api.get('/reports/financial-summary/pdf', {
                responseType: 'blob',
            });

            const filename = generateFilename('resumen_financiero', 'pdf');
            downloadBlob(response.data, filename, 'application/pdf');

            return { success: true, message: 'Resumen financiero descargado exitosamente' };
        } catch (error) {
            console.error('Error descargando resumen financiero:', error);
            return { success: false, message: 'Error al descargar el resumen financiero' };
        }
    },
};

export default reportService;