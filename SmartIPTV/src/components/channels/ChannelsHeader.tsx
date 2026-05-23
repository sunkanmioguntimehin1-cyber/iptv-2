import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

export default function ChannelsHeader() {
  const router  = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // router.replace('/(auth)/welcome');
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
      {/* Left — logo + greeting */}
      <View className="flex-row items-center gap-3">
        <View className="w-9 h-9 rounded-xl bg-violet-600 items-center justify-center">
          {/* TV icon shape */}
          <View className="w-5 h-3.5 rounded-sm bg-white opacity-90" />
        </View>
        <View>
          <Text className="text-white/40 text-[11px] font-medium tracking-wider uppercase">
            {greeting()}
          </Text>
          <Text className="text-white text-[15px] font-semibold tracking-tight">
            {user?.name?.split(' ')[0] ?? 'Subscriber'}
          </Text>
        </View>
      </View>

      {/* Right — logout */}
      <TouchableOpacity
        className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 items-center justify-center"
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <Text className="text-white/40 text-[12px] font-medium">Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
