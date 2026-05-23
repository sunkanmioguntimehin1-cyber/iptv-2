import { apiClient } from '../api/client';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
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
  iptvCredentials?: {
    portalUrl: string;
    iptvUsername: string;
    iptvPassword: string;
    expiresAt?: string;
  };
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>('/auth/register', payload);
  return response.data;
}
