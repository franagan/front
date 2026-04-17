import axios from 'axios';
import { BudgetCategory, CreateBudgetRequest, BudgetPeriod } from '@/types/budget.types';
import { ApiResponse } from '@/types/portfolio.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

const budgetService = {
    getBudgets: (period?: BudgetPeriod, year?: number, month?: number) => {
        return api.get<ApiResponse<BudgetCategory[]>>('/budgets', {
            params: { period, year, month }
        });
    },

    createBudget: (data: CreateBudgetRequest) => {
        return api.post<ApiResponse<BudgetCategory>>('/budgets', data);
    },

    updateBudget: (id: string, data: Partial<CreateBudgetRequest>) => {
        return api.put<ApiResponse<BudgetCategory>>(`/budgets/${id}`, data);
    },

    deleteBudget: (id: string) => {
        return api.delete<ApiResponse<void>>(`/budgets/${id}`);
    }
};

export default budgetService;
