import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const baseStyles = 'h-13 rounded-xl items-center justify-center';
  const variantStyles = variant === 'primary'
    ? 'bg-violet-600'
    : 'bg-white/5 border border-white/10';

  const disabledStyles = variant === 'primary'
    ? 'bg-violet-600/60'
    : 'opacity-60';

  return (
    <TouchableOpacity
      className={`${baseStyles} ${className} ${
        disabled || loading ? disabledStyles : variantStyles
      }`}
      style={{ height: 52 }}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator color="#fff" size="small" />
          <Text className="text-white text-[15px] font-semibold">
            {label}
          </Text>
        </View>
      ) : (
        <Text className="text-white text-[15px] font-semibold">
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}