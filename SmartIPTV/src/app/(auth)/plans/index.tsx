import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { usePlans } from "../../../hooks/usePlans";
import { useCheckout } from "../../../hooks/useSubscription";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Plan } from "../../../services/plansApi";

export default function PlansScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const { data: plans, isLoading, isError, error, refetch } = usePlans();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  console.log("Available plans:", selected);
  const handleContinue = () => {
    if (!selected) return;
    checkout(selected, {
      onSuccess: ({ sessionId }) => {
        router.push(`/payment/success?session_id=${sessionId}` as any);
      },
      onError: (err) => {
        Alert.alert(
          "Checkout failed",
          err?.message ?? "Something went wrong. Please try again.",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#080810] items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-white/40 text-[13px] mt-4">Loading plans...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-[#080810] items-center justify-center px-6">
        <Text className="text-red-400 text-[14px] text-center">
          {error?.message ?? "Failed to load plans. Please try again."}
        </Text>
        <TouchableOpacity
          className="mt-4 bg-violet-600 rounded-xl px-6 py-3"
          onPress={() => refetch()}
          activeOpacity={0.8}
        >
          <Text className="text-white text-[14px] font-semibold">Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#080810]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-6 pb-10"
      >
        <TouchableOpacity
          className="self-start py-2 mb-6"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text className="text-white/40 text-[13px]">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-[26px] font-bold tracking-tight mb-2">
          Choose a plan
        </Text>
        <Text className="text-white/40 text-[14px] mb-8 leading-relaxed">
          Cancel anytime · 7-day free trial on all plans
        </Text>

        {(plans ?? []).map((plan: Plan) => {
          const isSelected = selected === plan._id;
          return (
            <TouchableOpacity
              key={plan._id}
              onPress={() => setSelected(plan._id)}
              activeOpacity={0.85}
              className={`rounded-2xl border p-5 mb-4 ${
                isSelected
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              {/* Header row */}
              <View className="flex-row items-start justify-between mb-3">
                <View>
                  {plan.popular && (
                    <View className="bg-violet-600 rounded-full px-2.5 py-0.5 self-start mb-2">
                      <Text className="text-white text-[10px] font-bold tracking-wider">
                        POPULAR
                      </Text>
                    </View>
                  )}
                  {plan.savings && (
                    <View className="bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5 self-start mb-2">
                      <Text className="text-emerald-400 text-[10px] font-bold">
                        SAVE {plan.savings}
                      </Text>
                    </View>
                  )}
                  <Text className="text-white text-[18px] font-bold">
                    {plan.name}
                  </Text>
                </View>
                <View className="items-end">
                  <View className="flex-row items-end gap-1">
                    <Text className="text-violet-400 text-[28px] font-bold">
                      ${plan.price}
                    </Text>
                    <Text className="text-white/30 text-[13px] mb-1.5">
                      /{plan.slug === "monthly" ? "mo" : "yr"}
                    </Text>
                  </View>
                  {plan.slug === "yearly" && (
                    <Text className="text-white/30 text-[11px]">
                      ${(plan.price / 12).toFixed(2)}/mo
                    </Text>
                  )}
                </View>
              </View>

              {/* Features */}
              <View className="gap-2">
                {plan.features.map((f) => (
                  <View key={f} className="flex-row items-center gap-2.5">
                    <View
                      className={`w-4 h-4 rounded-full items-center justify-center ${isSelected ? "bg-violet-500" : "bg-white/10"}`}
                    >
                      <Text className="text-white text-[9px] font-bold">✓</Text>
                    </View>
                    <Text className="text-white/70 text-[13px]">{f}</Text>
                  </View>
                ))}
              </View>

              {/* Selected indicator */}
              {isSelected && (
                <View className="absolute top-4 right-4 w-5 h-5 rounded-full bg-violet-500 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        <Text className="text-white/20 text-[12px] text-center mb-6 leading-relaxed">
          You won't be charged during your free trial.{"\n"}Cancel anytime
          before it ends.
        </Text>

        <TouchableOpacity
          className={`h-[52] rounded-xl items-center justify-center ${
            !selected || isCheckingOut ? 'bg-violet-600/60' : 'bg-violet-600'
          }`}
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!selected || isCheckingOut}
        >
          {isCheckingOut ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="#fff" size="small" />
              <Text className="text-white text-[15px] font-semibold">
                Redirecting to payment...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-[15px] font-semibold">
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
