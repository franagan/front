import axios from 'axios';
import { SavingsGoal, CreateGoalRequest } from '@/types/goal.types';
import { ApiResponse } from '@/types/portfolio.types';
import { Expense } from '@/types/expense.types';

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

const goalService = {
    getGoals: () => {
        return api.get<ApiResponse<SavingsGoal[]>>('/goals');
    },

    createGoal: (data: CreateGoalRequest) => {
        return api.post<ApiResponse<SavingsGoal>>('/goals', data);
    },

    updateGoal: (id: string, data: Partial<CreateGoalRequest>) => {
        return api.put<ApiResponse<SavingsGoal>>(`/goals/${id}`, data);
    },

    deleteGoal: (id: string) => {
        return api.delete<ApiResponse<void>>(`/goals/${id}`);
    },

    getGoalMovements: (id: string) => {
        return api.get<ApiResponse<Expense[]>>(`/goals/${id}/movements`);
    }
};

export default goalService;
