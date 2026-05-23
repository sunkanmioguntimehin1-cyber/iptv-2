import React from 'react';
import { View, Text } from 'react-native';

interface SubscriptionBannerProps {
  plan?: string | null;
  expiresAt?: string | null;
}

export function SubscriptionBanner({ plan, expiresAt }: SubscriptionBannerProps) {
  if (!plan) return null;

  const expired = expiresAt && new Date(expiresAt) < new Date();

  return (
    <View
      className={`flex-row items-center gap-2.5 rounded-xl px-4 py-3 mb-5 border ${
        expired
          ? 'bg-red-500/10 border-red-500/30'
          : 'bg-emerald-500/10 border-emerald-500/30'
      }`}
    >
      <View
        className={`w-2 h-2 rounded-full ${expired ? 'bg-red-400' : 'bg-emerald-400'}`}
      />
      <Text
        className={`text-[12px] font-medium ${
          expired ? 'text-red-400' : 'text-emerald-400'
        }`}
      >
        {expired
          ? 'Your subscription has expired — renew to continue watching'
          : `${plan} plan active`}
      </Text>
    </View>
  );
}