import axios from 'axios';
import type { Expense } from "@/types/expense.types";
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

const expenseService = {
    getExpenses: () => {
        return api.get<ApiResponse<Expense[]>>('/expenses');
    },

    createExpense: (expense: Partial<Expense>) => {
        return api.post<ApiResponse<Expense>>('/expenses', expense);
    },

    importExpenses: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return api.post<ApiResponse<Expense[]>>('/expenses/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    updateExpense: (id: string, expense: Partial<Expense>) => {
        return api.put<ApiResponse<Expense>>(`/expenses/${id}`, expense);
    },

    deleteExpense: (id: string) => {
        return api.delete<ApiResponse<void>>(`/expenses/${id}`);
    }
};

export default expenseService;
