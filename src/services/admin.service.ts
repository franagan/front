import axios from 'axios';
import { User, ApiResponse } from '@/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

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

const adminService = {
    getAllUsers: () => {
        return api.get<ApiResponse<User[]>>('/admin/users');
    },

    updateUserRole: (id: string, role: string) => {
        return api.put<ApiResponse<User>>(`/admin/users/${id}/role?role=${role}`);
    },

    toggleUserStatus: (id: string, enabled: boolean) => {
        return api.put<ApiResponse<User>>(`/admin/users/${id}/status?enabled=${enabled}`);
    },

    deleteUser: (id: string) => {
        return api.delete<ApiResponse<void>>(`/admin/users/${id}`);
    }
};

export default adminService;
