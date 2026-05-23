import { View, Text, TouchableOpacity } from 'react-native';

export default function EmptyState({ query, category, onClear }) {
  const isSearch = !!query;

  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      {/* Icon */}
      <View className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 items-center justify-center mb-5">
        {/* TV shape */}
        <View className="w-9 h-7 rounded-md border-2 border-white/20 items-center justify-center">
          <View className="w-5 h-3 rounded-sm bg-white/10" />
        </View>
        <View className="w-4 h-1 bg-white/10 rounded-full mt-1" />
      </View>

      <Text className="text-white text-[16px] font-semibold text-center mb-2">
        {isSearch ? `No results for "${query}"` : 'No channels found'}
      </Text>

      <Text className="text-white/30 text-[13px] text-center leading-relaxed mb-6">
        {isSearch
          ? 'Try a different search term or browse by category'
          : category
          ? 'No channels in this category yet'
          : 'Your channel list is empty — try refreshing'}
      </Text>

      {(isSearch || category) && (
        <TouchableOpacity
          className="h-10 px-5 bg-violet-600/20 border border-violet-500/30 rounded-xl items-center justify-center"
          onPress={onClear}
          activeOpacity={0.8}
        >
          <Text className="text-violet-400 text-[13px] font-semibold">Clear filter</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
