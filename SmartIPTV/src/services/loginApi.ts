import { apiClient } from '../api/client';

interface LoginPayload {
  email: string;
  password: string;
}

export interface IptvCredentials {
  portalUrl: string;
  iptvUsername: string;
  iptvPassword: string;
  expiresAt?: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptionStatus?: string | null;
    planSlug?: string | null;
    expiresAt?: string | null;
  };
  accessToken: string;
  refreshToken: string;
  iptvCredentials?: IptvCredentials;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const USE_MOCK = true;

  if (USE_MOCK) {
    return {
      user: {
        id: 'dev-001',
        name: 'Dev User',
        email: payload.email,
        role: 'subscriber',
      },
      accessToken: 'mock-token-' + Date.now(),
      refreshToken: 'mock-refresh-' + Date.now(),
      iptvCredentials: {
        portalUrl: 'http://opplex.rw:8080',
        iptvUsername: 'kings117987',
        iptvPassword: '505050',
      },
    };
  }

  console.log('Logging in with', payload);
  const response = await apiClient.post<LoginResponse>('/auth/login', payload);
  return response.data;
}
