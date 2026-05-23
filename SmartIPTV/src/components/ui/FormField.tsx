import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Controller, Control } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  control: Control<any>;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  rules?: any;
  error?: string;
  hint?: string;
}

export function FormField({
  label,
  name,
  control,
  placeholder,
  secure = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rules,
  error,
  hint,
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-white/5 border rounded-xl overflow-hidden ${
          error
            ? 'border-red-500/60'
            : focused
            ? 'border-violet-500/70'
            : 'border-white/10'
        }`}
      >
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 h-12 px-4 text-[14px] text-white"
              placeholder={placeholder}
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => setFocused(true)}
              secureTextEntry={secure && !show}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={false}
            />
          )}
        />
        {secure && (
          <TouchableOpacity
            className="px-4 h-12 items-center justify-center"
            onPress={() => setShow((s) => !s)}
            activeOpacity={0.7}
          >
            <Text className="text-[11px] font-semibold text-violet-400">
              {show ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-[11px] text-red-400 mt-1.5">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-[11px] text-white/30 mt-1.5">{hint}</Text>
      )}
    </View>
  );
}