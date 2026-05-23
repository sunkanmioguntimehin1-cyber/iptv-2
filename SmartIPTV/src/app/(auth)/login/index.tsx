import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoMark, SocialButton, SubscriptionBanner } from '../../../components/auth';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { useLogin } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';

interface FormValues {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
  });

  const {
    mutate: login,
    isPending,
    isError,
    error,
  } = useLogin();

  const onSubmit = (data: FormValues) => {

    console.log('Submitting login form with data:', data);
    login(data, {
      onSuccess: (result) => {
        console.log('Login successful:', result);
          // router.replace("/(main)/channels" as any);

        if (result.iptvCredentials) {
          router.replace("/(main)/channels" as any);
        } else if (result.user?.subscriptionStatus === 'pending') {
          router.replace("/payment/success" as any);
        } else {
          router.replace("/(auth)/plans" as any);
        }
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#080810]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-4 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            className="self-start py-2 mb-6"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text className="text-white/40 text-[13px]">← Back</Text>
          </TouchableOpacity>

          <View className="mb-8">
            <LogoMark />
            <Text className="text-white text-[26px] font-bold tracking-tight mt-5 mb-1.5">
              Welcome back
            </Text>
            <Text className="text-white/40 text-[14px] leading-relaxed">
              Log in to access your channels and continue watching.
            </Text>
          </View>

          <SubscriptionBanner
            plan={user?.plan ?? null}
            expiresAt={user?.expiresAt ?? null}
          />

          {isError && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
              <Text className="text-red-400 text-[13px] leading-relaxed">
                {error?.message === 'Invalid credentials'
                  ? 'Email or password is incorrect. Please try again.'
                  : (error?.message ?? 'Login failed. Please try again.')}
              </Text>
            </View>
          )}

          <SocialButton onPress={() => {}} />

          <View className="flex-row items-center gap-3 mb-6">
            <View className="flex-1 h-px bg-white/8" />
            <Text className="text-white/20 text-[11px] uppercase tracking-widest">
              or
            </Text>
            <View className="flex-1 h-px bg-white/8" />
          </View>

          <FormField
            label="Email address"
            name="email"
            control={control}
            placeholder="amaka@example.com"
            keyboardType="email-address"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Enter a valid email address',
              },
            }}
            error={errors.email?.message}
          />

          <View className="mb-2">
            <Text className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
              Password
            </Text>
            <View
              className={`flex-row items-center bg-white/5 border rounded-xl overflow-hidden ${
                errors.password ? 'border-red-500/60' : 'border-white/10'
              }`}
            >
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 h-12 px-4 text-[14px] text-white"
                    placeholder="Your password"
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                className="px-4 h-12 items-center justify-center"
                onPress={() => setShowPassword((s) => !s)}
                activeOpacity={0.7}
              >
                <Text className="text-[11px] font-semibold text-violet-400">
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-[11px] text-red-400 mt-1.5">
                {errors.password.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="flex-row items-center gap-2 mb-7 mt-3"
            onPress={() => setRememberMe((r) => !r)}
            activeOpacity={0.7}
          >
            <View
              className={`w-4 h-4 rounded border ${
                rememberMe ? 'bg-violet-500 border-violet-500' : 'border-white/20 bg-white/5'
              } items-center justify-center`}
            >
              {rememberMe && (
                <Text className="text-white text-[10px] font-bold">✓</Text>
              )}
            </View>
            <Text className="text-white/30 text-[12px]">Keep me logged in</Text>
          </TouchableOpacity>

          <Button
            label={isPending ? 'Logging in...' : 'Log in'}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <View className="flex-row items-center justify-center gap-1.5 mt-4">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <Text className="text-white/20 text-[11px]">
              Secure login · SSL encrypted
            </Text>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-white/30 text-[13px]">
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-violet-400 text-[13px] font-semibold">
                  Sign up free
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}