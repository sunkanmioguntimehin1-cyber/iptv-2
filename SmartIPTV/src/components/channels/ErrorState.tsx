import { View, Text, TouchableOpacity } from 'react-native';

export default function ErrorState({ message, onRetry }) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      {/* Error icon */}
      <View className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 items-center justify-center mb-5">
        <View className="w-6 h-6 items-center justify-center">
          <View className="w-0.5 h-4 bg-red-400 rounded-full" />
          <View className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1" />
        </View>
      </View>

      <Text className="text-white text-[16px] font-semibold text-center mb-2">
        Could not load channels
      </Text>

      <Text className="text-white/30 text-[13px] text-center leading-relaxed mb-6">
        {message ?? 'Something went wrong. Check your connection and try again.'}
      </Text>

      {onRetry && (
        <TouchableOpacity
          className="h-11 px-6 bg-violet-600 rounded-xl items-center justify-center"
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text className="text-white text-[14px] font-semibold">Try again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
