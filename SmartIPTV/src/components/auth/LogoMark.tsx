import React from 'react';
import { View } from 'react-native';

export function LogoMark() {
  return (
    <View className="w-14 h-14 rounded-2xl bg-violet-600 items-center justify-center">
      <View className="w-7 h-5 relative">
        <View className="absolute left-0 top-1 w-5 h-4 rounded bg-white opacity-90" />
        <View
          className="absolute right-0 top-2"
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 7,
            borderLeftColor: '#a78bfa',
            borderTopWidth: 4,
            borderTopColor: 'transparent',
            borderBottomWidth: 4,
            borderBottomColor: 'transparent',
          }}
        />
      </View>
    </View>
  );
}