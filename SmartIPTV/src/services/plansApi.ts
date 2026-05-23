import { apiClient } from '../api/client';

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  maxConnections: number;
  features: string[];
  popular: boolean;
  savings: string | null;
  stripePriceId?: string;
}

export async function getPlans(): Promise<Plan[]> {
  const response = await apiClient.get<{ plans: Plan[] }>('/plans');
  return response.data.plans;
}

export async function getPlan(id: string): Promise<Plan> {
  const response = await apiClient.get<{ plan: Plan }>(`/plans/${id}`);
  return response.data.plan;
}
