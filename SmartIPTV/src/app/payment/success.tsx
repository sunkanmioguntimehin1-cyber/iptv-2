import { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStatus } from '../../hooks/useSubscription';
import { useAuthStore } from '../../store/authStore';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const { data, isLoading, isError, error, refetch } = useSubscriptionStatus();
  const portalUrl = useAuthStore((s) => s.portalUrl);
  const iptvUsername = useAuthStore((s) => s.iptvUsername);

  const subscription = data?.subscription;
  const iptvCredentials = data?.iptvCredentials;

  const isProvisioned = !!portalUrl && !!iptvUsername && !!iptvCredentials;

  useEffect(() => {
    if (isProvisioned || subscription?.status === 'active') {
      const timer = setTimeout(() => {
        router.replace('/(main)/channels' as any);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isProvisioned, subscription?.status]);

  if (isProvisioned || subscription?.status === 'active') {
    return (
      <SafeAreaView className="flex-1 bg-[#080810] items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
          <Text className="text-emerald-400 text-3xl">✓</Text>
        </View>
        <Text className="text-white text-[22px] font-bold mb-2">
          Subscription Active!
        </Text>
        <Text className="text-white/40 text-[14px] text-center leading-relaxed mb-8">
          Your IPTV credentials are ready.{'\n'}Redirecting to channels...
        </Text>
        <ActivityIndicator size="small" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-[#080810] items-center justify-center px-6">
        <View className="w-16 h-16 rounded-full bg-red-500/20 items-center justify-center mb-4">
          <Text className="text-red-400 text-3xl">!</Text>
        </View>
        <Text className="text-white text-[22px] font-bold mb-2">
          Something went wrong
        </Text>
        <Text className="text-white/40 text-[14px] text-center leading-relaxed mb-6">
          {error?.message ?? 'We could not verify your payment status.'}
        </Text>
        <TouchableOpacity
          className="bg-violet-600 rounded-xl px-8 py-3"
          onPress={() => refetch()}
          activeOpacity={0.85}
        >
          <Text className="text-white text-[15px] font-semibold">Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#080810] items-center justify-center px-6">
      <ActivityIndicator size="large" color="#8B5CF6" />
      <Text className="text-white text-[22px] font-bold mt-6 mb-2">
        Processing Payment
      </Text>
      <Text className="text-white/40 text-[14px] text-center leading-relaxed">
        Your payment is being processed.{'\n'}This should only take a moment...
      </Text>
      {session_id && (
        <Text className="text-white/20 text-[11px] mt-8">
          Session: {session_id.slice(0, 12)}...
        </Text>
      )}
    </SafeAreaView>
  );
}
