import { create } from 'zustand';
import { roundApi, type Round, type RoundDetails } from '../api/rounds';
import { useAuthStore } from './auth';

interface RoundState {
  rounds: Round[];
  currentRound: RoundDetails | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
  createRound: () => Promise<void>;
  getRounds: (cursor?: string, limit?: number, status?: string) => Promise<void>;
  getRoundDetails: (roundId: string) => Promise<void>;
  registerTap: (roundId: string) => Promise<void>;
  clearError: () => void;
  setCurrentRound: (details: RoundDetails | null) => void;
}

export const useRoundStore = create<RoundState>((set, get) => ({
  rounds: [],
  currentRound: null,
  isLoading: false,
  error: null,
  pagination: {
    limit: 10,
    nextCursor: null,
    hasMore: false,
  },

  createRound: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('Не авторизован');
      
      const newRound = await roundApi.createRound(token);
      set(state => ({
        rounds: [newRound, ...state.rounds],
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка при создании раунда';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  getRounds: async (cursor?: string, limit: number = 10, status?: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('Не авторизован');
      
      const response = await roundApi.getRounds(token, cursor, limit, status);
      set(state => ({
        rounds: cursor ? [...state.rounds, ...response.data] : response.data,
        pagination: response.pagination,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка при загрузке раундов';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  getRoundDetails: async (roundId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('Не авторизован');
      
      const details = await roundApi.getRoundDetails(roundId, token);
      set({ 
        currentRound: details,
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка при загрузке деталей раунда';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  registerTap: async (roundId: string) => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error('Не авторизован');
      
      const tapResponse = await roundApi.registerTap(roundId, token);
      
      // Обновляем статистику текущего раунда
      const currentRound = get().currentRound;
      if (currentRound && currentRound.round.id === roundId) {
        set({
          currentRound: {
            ...currentRound,
            myStats: {
              taps: currentRound.myStats.taps + tapResponse.taps,
              score: currentRound.myStats.score + tapResponse.score,
            },
            round: {
              ...currentRound.round,
              totalScore: currentRound.round.totalScore + tapResponse.score,
            }
          },
          isLoading: false
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ошибка при регистрации тапа';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setCurrentRound: (details: RoundDetails | null) => set({ currentRound: details }),
}));