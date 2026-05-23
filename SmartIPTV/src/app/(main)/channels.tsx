import { useState, useCallback } from 'react';
import { View,  StatusBar } from 'react-native';
import { useChannels } from '../../hooks/useChannels';
import ChannelsHeader    from '../../components/channels/ChannelsHeader';
import SubscriptionBadge from '../../components/channels/SubscriptionBadge';
import SearchBar         from '../../components/channels/SearchBar';
import CategoryFilter    from '../../components/channels/CategoryFilter';
import ChannelList       from '../../components/channels/ChannelList';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChannelsScreen() {
  const [searchQuery,       setSearchQuery]= useState('');
  // const [selectedCategory,  setSelectedCategory]  = useState(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isRefetching,
    isError,
    error,
    refetch,
  } = useChannels();

  const channels   = data?.channels   ?? [];
  const categories = data?.categories ?? [];

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#080810]">
      <StatusBar barStyle="light-content" backgroundColor="#080810" />

      {/* ── Fixed header section (does not scroll) ── */}
      <View>
        <ChannelsHeader />
        <SubscriptionBadge />
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search channels..."
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* ── Scrollable channel list ── */}
      <View className="flex-1">
        <ChannelList
          channels={channels}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isError={isError}
          error={error}
          onRefetch={refetch}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onClearFilters={handleClearFilters}
        />
      </View>
    </SafeAreaView>
  );
}
