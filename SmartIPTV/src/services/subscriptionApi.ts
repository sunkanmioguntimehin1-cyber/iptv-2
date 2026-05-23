import { apiClient } from '../api/client';

export interface SubscriptionInfo {
  _id: string;
  plan: { name: string; slug: string; durationDays: number; price: number };
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  startDate?: string;
  endDate?: string;
}

export interface IptvCredentials {
  portalUrl: string;
  iptvUsername: string;
  iptvPassword: string;
  expiresAt?: string;
}

interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

interface StatusResponse {
  subscription: SubscriptionInfo | null;
  iptvCredentials: IptvCredentials | null;
}

export async function createCheckout(planId: string): Promise<CheckoutResponse> {
  console.log("planId", planId)
  const response = await apiClient.post<CheckoutResponse>('/subscriptions/checkout', { planId });
  return response.data;
}

export async function getStatus(): Promise<StatusResponse> {
  const response = await apiClient.get<StatusResponse>('/subscriptions/status');
  return response.data;
}

export async function cancelSubscription(): Promise<void> {
  await apiClient.post('/subscriptions/cancel');
}
