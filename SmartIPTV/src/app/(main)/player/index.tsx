import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useStreamUrl } from '../../../hooks/useChannels';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const router = useRouter();
  const { channelId, channelName } = useLocalSearchParams<{
    channelId: string;
    channelName: string;
  }>();

  const channel = { id: channelId, name: channelName };
  const { data: streamUrl, isLoading, isError, error, refetch } = useStreamUrl(channel);

  const player = useVideoPlayer(streamUrl ?? null);

  useEffect(() => {
    if (streamUrl) {
      player.loop = true;
      player.play();
    }
  }, [streamUrl, player]);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {isLoading && (
        <SafeAreaView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-white/40 text-[13px] mt-4">Loading stream...</Text>
        </SafeAreaView>
      )}

      {isError && (
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <View className="w-14 h-14 rounded-full bg-red-500/20 items-center justify-center mb-4">
            <Text className="text-red-400 text-2xl">!</Text>
          </View>
          <Text className="text-white text-[18px] font-bold mb-1">Playback Error</Text>
          <Text className="text-white/40 text-[13px] text-center mb-6">
            {error?.message ?? 'Could not load this stream.'}
          </Text>
          <TouchableOpacity
            className="bg-violet-600 rounded-xl px-6 py-3"
            onPress={() => refetch()}
            activeOpacity={0.85}
          >
            <Text className="text-white text-[14px] font-semibold">Try Again</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {!isLoading && !isError && streamUrl && (
        <View className="flex-1">
          <VideoView
            player={player}
            className="flex-1"
            contentFit="contain"
            nativeControls
          />

          <SafeAreaView className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center px-4 pt-2 pb-3">
              <TouchableOpacity
                className="w-9 h-9 rounded-full bg-white/10 items-center justify-center"
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Text className="text-white text-[16px]">←</Text>
              </TouchableOpacity>
              <Text
                className="text-white text-[15px] font-semibold ml-3 flex-1"
                numberOfLines={1}
              >
                {channelName}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}
