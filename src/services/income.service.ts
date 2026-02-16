import axios from 'axios';
import { IncomeSource, CreateIncomeRequest } from '@/types/income.types';
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

const incomeService = {
    getIncomes: () => {
        return api.get<ApiResponse<IncomeSource[]>>('/incomes');
    },

    createIncome: (data: CreateIncomeRequest) => {
        return api.post<ApiResponse<IncomeSource>>('/incomes', data);
    },

    updateIncome: (id: string, data: Partial<CreateIncomeRequest>) => {
        return api.put<ApiResponse<IncomeSource>>(`/incomes/${id}`, data);
    },

    deleteIncome: (id: string) => {
        return api.delete<ApiResponse<void>>(`/incomes/${id}`);
    }
};

export default incomeService;
