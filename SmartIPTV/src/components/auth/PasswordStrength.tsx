import React from 'react';
import { View, Text } from 'react-native';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-violet-500', 'bg-emerald-500'];
  const labels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <View className="mt-2">
      <View className="flex-row gap-1 mb-1">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className={`flex-1 h-1 rounded-full ${
              i < strength ? colors[strength] : 'bg-white/10'
            }`}
          />
        ))}
      </View>
      <View className="flex-row gap-3">
        {checks.map((c) => (
          <View key={c.label} className="flex-row items-center gap-1">
            <View
              className={`w-1.5 h-1.5 rounded-full ${
                c.pass ? 'bg-violet-400' : 'bg-white/20'
              }`}
            />
            <Text
              className={`text-[10px] ${
                c.pass ? 'text-violet-400' : 'text-white/30'
              }`}
            >
              {c.label}
            </Text>
          </View>
        ))}
        {strength > 0 && (
          <Text
            className={`text-[10px] ml-auto ${colors[strength].replace(
              'bg-',
              'text-'
            )}`}
          >
            {labels[strength]}
          </Text>
        )}
      </View>
    </View>
  );
}