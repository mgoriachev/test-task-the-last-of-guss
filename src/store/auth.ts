import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, type User, type LoginData } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          set({ 
            user: { username: response.username, role: response.role },
            token: response.token,
            isLoading: false 
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Ошибка авторизации';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        const token = get().token;
        if (token) {
          try {
            await authApi.logout(token);
          } catch (error) {
            console.error('Ошибка при выходе:', error);
          }
        }
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });
        try {
          const user = await authApi.getCurrentUser(token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ user: null, token: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);