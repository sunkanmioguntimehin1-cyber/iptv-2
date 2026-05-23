import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAppStore();

  const handleGetStarted = () => router.push("/(auth)/register");

  const handleReturning = () => {
    router.push("/(auth)/login");
    // if (user) {
    //   router.replace("/" as any);
    // } else {
    //   router.push("/(auth)/login");
    // }
  };

  

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0F]">
      <View className="flex-1 px-7 pt-16 pb-9 justify-between">

        <View className="items-center flex-1 justify-center gap-3">
          <View className="w-[72] h-[72] rounded-[20] bg-[#534AB7] items-center justify-center mb-1">
            <View className="w-[28] h-[22] relative">
              <View className="w-[18] h-[14] rounded-[3] bg-white/90 absolute left-0 top-[4]" />
              <View
                className="absolute right-0 top-[6]"
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 8,
                  borderLeftColor: "#AFA9EC",
                  borderTopWidth: 5,
                  borderTopColor: "transparent",
                  borderBottomWidth: 5,
                  borderBottomColor: "transparent",
                }}
              />
            </View>
          </View>
          <Text className="text-[28px] font-bold text-white tracking-tight">
            StreamVault
          </Text>
          <Text className="text-[11px] text-[#4A4A5A] tracking-[2] font-medium">
            LIVE TV · MOVIES · SERIES
          </Text>
        </View>

        <View className="flex-row gap-[10] mb-10">
          {[
            { label: "10,000+\nchannels", color: "#534AB7" },
            { label: "4K HDR\nstreams", color: "#1D9E75" },
            { label: "VOD\nlibrary", color: "#D85A30" },
          ].map((f) => (
            <View
              key={f.label}
              className="flex-1 bg-[#141420] border border-[#1E1E2A] rounded-[12] py-[14] px-2 items-center gap-2"
            >
              <View
                className="w-[10] h-[10] rounded-full"
                style={{ backgroundColor: f.color }}
              />
              <Text className="text-[11px] text-[#8A8A9A] text-center leading-4">
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-[10]">
          <TouchableOpacity
            className="h-[52] bg-[#534AB7] rounded-[14] items-center justify-center"
            onPress={handleGetStarted}
            activeOpacity={0.85}
          >
            <Text className="text-[15px] font-semibold text-white tracking-wide">
              Get started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="h-[48] border border-[#2a2a35] rounded-[14] items-center justify-center"
            onPress={handleReturning}
            activeOpacity={0.7}
          >
            <Text className="text-[14px] text-[#6B6B7A]">
              I already have an account
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center gap-[6] mt-1">
            <View className="w-[7] h-[7] rounded-full bg-[#1D9E75]" />
            <Text className="text-[12px] text-[#3A3A4A]">
              Servers online · 99.9% uptime
            </Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}
