import axios from 'axios';
import { 
    Portfolio, 
    PortfolioDetail, 
    PortfolioSummary,
    CreatePortfolioRequest,
    UpdatePortfolioRequest,
    ApiResponse 
} from '@/types/portfolio.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const storage = localStorage.getItem('auth-storage');
        if (storage) {
            const { state } = JSON.parse(storage);
            if (state?.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
    }
    return config;
});

const portfolioService = {
    /**
     * Get all portfolios for the authenticated user
     */
    getPortfolios: () => {
        return api.get<ApiResponse<Portfolio[]>>('/portfolios/user');
    },

    /**
     * Get a specific portfolio by ID
     */
    getPortfolio: (id: string) => {
        return api.get<ApiResponse<PortfolioDetail>>(`/portfolios/${id}`);
    },

    /**
     * Get portfolio summary (key metrics)
     */
    getPortfolioSummary: (id: string) => {
        return api.get<ApiResponse<PortfolioSummary>>(`/portfolios/${id}/summary`);
    },

    /**
     * Create a new portfolio
     */
    createPortfolio: (data: CreatePortfolioRequest) => {
        return api.post<ApiResponse<Portfolio>>('/portfolios', data);
    },

    /**
     * Update an existing portfolio
     */
    updatePortfolio: (id: string, data: UpdatePortfolioRequest) => {
        return api.put<ApiResponse<Portfolio>>(`/portfolios/${id}`, data);
    },

    /**
     * Delete a portfolio (soft delete)
     */
    deletePortfolio: (id: string) => {
        return api.delete<ApiResponse<void>>(`/portfolios/${id}`);
    },

    /**
     * Recalculate portfolio values
     */
    recalculatePortfolio: (id: string) => {
        return api.post<ApiResponse<Portfolio>>(`/portfolios/${id}/recalculate`);
    }
};

export default portfolioService;
