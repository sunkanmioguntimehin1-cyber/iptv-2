import { apiClient } from '../api/client';
import type { IptvCredentials, SubscriptionInfo } from './subscriptionApi';

interface CurrentUser {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  subscription: SubscriptionInfo | null;
  iptvCredentials: IptvCredentials | null;
}

export async function getMe(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>('/auth/me');
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}
