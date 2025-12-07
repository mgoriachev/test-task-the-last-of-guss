import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://v2991160.hosted-by-vdsina.ru/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Round {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
}

export interface PaginatedRounds {
  data: Round[];
  pagination: {
    limit: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export interface RoundDetails {
  round: Round;
  topStats: Array<{
    taps: number;
    score: number;
    user: {
      username: string;
    };
  }>;
  myStats: {
    taps: number;
    score: number;
  };
}

export interface TapResponse {
  taps: number;
  score: number;
}

export interface CreateRoundResponse {
  id: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  createdAt: string;
}

export const roundApi = {
  createRound: async (token: string): Promise<CreateRoundResponse> => {
    const response = await api.post<CreateRoundResponse>('/rounds', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  getRounds: async (
    token: string,
    cursor: string = '',
    limit: number = 10,
    status?: string
  ): Promise<PaginatedRounds> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    const response = await api.get<PaginatedRounds>(`/rounds?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  getRoundDetails: async (roundId: string, token: string): Promise<RoundDetails> => {
    const response = await api.get<RoundDetails>(`/rounds/${roundId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  registerTap: async (roundId: string, token: string): Promise<TapResponse> => {
    const response = await api.post<TapResponse>(`/rounds/${roundId}/tap`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};