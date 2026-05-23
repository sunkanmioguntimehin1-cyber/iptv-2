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
import { LogoMark, PasswordStrength, SocialButton } from '../../../components/auth';
import { FormField } from '../../../components/ui/FormField';
import { Button } from '../../../components/ui/Button';
import { useRegister } from '../../../hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password");

  const {
    mutate: register,
    isPending,
    isError,
    error,
  } = useRegister();

  const onSubmit = (data: any) => {
    const { confirmPassword, ...payload } = data;
    register(payload, {
      onSuccess: (result) => {
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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
              Create your account
            </Text>
            <Text className="text-white/40 text-[14px] leading-relaxed">
              Start your 7-day free trial.{"\n"}No credit card required right
              now.
            </Text>
          </View>

          {isError && (
            <View className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
              <Text className="text-red-400 text-[13px] leading-relaxed">
                {error?.message ?? "Something went wrong. Please try again."}
              </Text>
            </View>
          )}

          <SocialButton onPress={() => {}} />

          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-1 h-px bg-white/8" />
            <Text className="text-white/20 text-[11px] uppercase tracking-widest">
              or
            </Text>
            <View className="flex-1 h-px bg-white/8" />
          </View>

          <FormField
            label="Full name"
            name="name"
            control={control}
            placeholder="Amaka Johnson"
            autoCapitalize="words"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            error={errors.name?.message}
          />

          <FormField
            label="Email address"
            name="email"
            control={control}
            placeholder="amaka@example.com"
            keyboardType="email-address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter a valid email address",
              },
            }}
            error={errors.email?.message}
          />

          <View className="mb-4">
            <Text className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">
              Password
            </Text>
            <View
              className={`flex-row items-center bg-white/5 border rounded-xl overflow-hidden ${
                errors.password ? "border-red-500/60" : "border-white/10"
              }`}
            >
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => {
                  const [show, setShow] = useState(false);
                  return (
                    <>
                      <TextInput
                        className="flex-1 h-12 px-4 text-[14px] text-white"
                        placeholder="Min. 8 characters"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!show}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        className="px-4 h-12 items-center justify-center"
                        onPress={() => setShow((s) => !s)}
                        activeOpacity={0.7}
                      >
                        <Text className="text-[11px] font-semibold text-violet-400">
                          {show ? "Hide" : "Show"}
                        </Text>
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
            </View>
            {errors.password && (
              <Text className="text-[11px] text-red-400 mt-1.5">
                {errors.password.message}
              </Text>
            )}
            <PasswordStrength password={passwordValue} />
          </View>

          <FormField
            label="Confirm password"
            name="confirmPassword"
            control={control}
            placeholder="Re-enter your password"
            secure
            rules={{
              required: "Please confirm your password",
            }}
            error={errors.confirmPassword?.message}
          />

          <Text className="text-white/20 text-[11px] text-center leading-relaxed mb-5">
            By creating an account you agree to our{" "}
            <Text className="text-violet-400">Terms of Service</Text> and{" "}
            <Text className="text-violet-400">Privacy Policy</Text>
          </Text>

          <Button
            label={isPending ? "Creating account..." : "Create account"}
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <View className="flex-row justify-center mt-5">
            <Text className="text-white/30 text-[13px]">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-violet-400 text-[13px] font-semibold">
                  Log in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}