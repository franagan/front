import api from './api';
import { 
    Investment, 
    InvestmentDetail,
    CreateInvestmentRequest,
    UpdateInvestmentRequest,
    ApiResponse 
} from '@/types/portfolio.types';

const investmentService = {
    /**
     * Get all investments for a portfolio
     */
    getInvestments: (portfolioId: string) => {
        return api.get<ApiResponse<Investment[]>>(`/investments/portfolio/${portfolioId}`);
    },

    /**
     * Get a specific investment by ID
     */
    getInvestment: (id: string) => {
        return api.get<ApiResponse<InvestmentDetail>>(`/investments/${id}`);
    },

    /**
     * Create a new investment
     */
    createInvestment: (data: CreateInvestmentRequest) => {
        return api.post<ApiResponse<Investment>>('/investments', data);
    },

    /**
     * Update an existing investment
     */
    updateInvestment: (id: string, data: UpdateInvestmentRequest) => {
        return api.put<ApiResponse<Investment>>(`/investments/${id}`, data);
    },

    /**
     * Delete an investment
     */
    deleteInvestment: (id: string) => {
        return api.delete<ApiResponse<void>>(`/investments/${id}`);
    },

    /**
     * Update the current price of an investment
     */
    updatePrice: (id: string, newPrice: number) => {
        return api.patch<ApiResponse<Investment>>(`/investments/${id}/price`, null, {
            params: { newPrice }
        });
    }
};

export default investmentService;
