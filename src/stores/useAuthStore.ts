import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import authService from '@/services/auth.service';
import { User, RegisterRequest, LoginRequest } from '@/types/auth.types';


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(data);
          console.log('Login response:', response.data);
          const { token, email, firstName, lastName, role } = response.data.data;
          
          const userData = { id: email, email, firstName, lastName, role };
          console.log('User data to store:', userData);
          
          set({ 
            user: userData, 
            token: token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Error al iniciar sesión', 
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          const { token, email, firstName, lastName, role } = response.data.data;
          
          set({ 
            user: { id: email, email, firstName, lastName, role }, 
            token: token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || 'Error al registrarse', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Migration: Clean up old data format
        if (state?.user && 'data' in state.user) {
          console.warn('Detected old user data format, cleaning up...');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      },
    }
  )
);
