import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface SocialButtonProps {
  onPress: () => void;
  label?: string;
}

export function SocialButton({ onPress, label = 'Continue with Google' }: SocialButtonProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center gap-2.5 h-12 bg-white/5 border border-white/10 rounded-xl"
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className="w-5 h-5 rounded-full bg-white items-center justify-center">
        <Text className="text-[10px] font-bold text-violet-700">G</Text>
      </View>
      <Text className="text-white/60 text-[13px] font-medium">{label}</Text>
    </TouchableOpacity>
  );
}