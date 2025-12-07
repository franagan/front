export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
}

export interface AuthResponse {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errorCode?: string;
    timestamp: string;
}
