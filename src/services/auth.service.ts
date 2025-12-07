import axios from 'axios';
import { LoginRequest, RegisterRequest, User, AuthResponse, ApiResponse } from '@/types/auth.types';

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

const authService = {
    login: (data: LoginRequest) => {
        return api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    },

    register: (data: RegisterRequest) => {
        return api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    },

    logout: () => {
        // If backend has a logout endpoint
        // return api.post('/auth/logout');
        // For now just client side cleanup which is handled by store
        return Promise.resolve();
    },
    
    getCurrentUser: () => {
        return api.get<ApiResponse<User>>('/auth/me');
    }
};

export default authService;
