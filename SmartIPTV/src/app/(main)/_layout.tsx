import { useEffect } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function MainLayout() {
  const router = useRouter();
  const { accessToken, portalUrl, iptvUsername, user } = useAuthStore();

    useEffect(() => {
      if (!accessToken) {
        router.replace("/(auth)" as any);
        return;
      }
      if (portalUrl && iptvUsername) return;
      if (user?.subscriptionStatus === 'pending') {
        router.replace("/payment/success" as any);
        return;
      }
      router.replace("/(auth)/plans" as any);
    }, [accessToken, portalUrl, iptvUsername, user?.subscriptionStatus]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#080810" },
        animation: "slide_from_right",
      }}
    />
  );
}
