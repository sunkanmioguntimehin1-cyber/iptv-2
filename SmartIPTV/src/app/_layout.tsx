import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { useCurrentUser } from "../hooks/useAuth";
import "../../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, retryDelay: (i) => Math.min(1000 * 2 ** i, 30000) },
  },
});

function AuthGate() {
  const { hydrate } = useAuthStore();
  const [ready, setReady] = useState(false);

  useCurrentUser();

  useEffect(() => {
    hydrate().finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen
        name="payment/success"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}