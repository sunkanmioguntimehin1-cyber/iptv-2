import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Linking } from 'react-native';
import { createCheckout, getStatus, cancelSubscription } from '../services/subscriptionApi';
import { useAuthStore } from '../store/authStore';

export function useCheckout() {
  const setIptvCredentials = useAuthStore((s) => s.setIptvCredentials);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => createCheckout(planId),
    onSuccess: async ({ checkoutUrl, sessionId }) => {
      // Invalidate status so the success screen starts polling
      console.log(
        "Checkout successful, invalidating subscription status query",
        checkoutUrl,
      );
      queryClient.setQueryData(['checkout', 'sessionId'], sessionId);
      // Open Stripe Checkout in browser
      await Linking.openURL(checkoutUrl);
    },
  });
}

export function useSubscriptionStatus() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setIptvCredentials = useAuthStore((s) => s.setIptvCredentials);

  return useQuery({
    queryKey: ['subscription', 'status'],
    queryFn: async () => {
      const data = await getStatus();
      console.log("Subscription status:", data);
      if (data.iptvCredentials) {
        setIptvCredentials(data.iptvCredentials);
      }
      return data;
    },
    enabled: !!accessToken,
    refetchInterval: (query) =>
      query.state.data?.subscription?.status === 'pending' ? 10000 : false,
    staleTime: 1000 * 60,
    retry: 2,
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
