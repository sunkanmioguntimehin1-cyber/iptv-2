import { useCallback, useMemo } from 'react';
import { FlatList, View, Text, RefreshControl } from 'react-native';
import ChannelCardSkeleton from './ChannelCardSkeleton';
import EmptyState          from './EmptyState';
import ErrorState          from './ErrorState';
import ChannelCard from './ChannelCard';

// ─── Section header (rendered as a FlatList item) ─────────────────────────────
function SectionLabel({ title, count }:any) {
  return (
    <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
      <Text className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">
        {title}
      </Text>
      <Text className="text-white/20 text-[11px]">{count}</Text>
    </View>
  );
}

export default function ChannelList({
  channels = [],
  isLoading,
  isRefetching,
  isError,
  error,
  onRefetch,
  searchQuery,
  selectedCategory,
  onClearFilters,
}:any) {
  // ─── Filter channels locally ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = channels;

    if (selectedCategory) {
      result = result.filter(
        (ch:any) => ch.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((ch:any) => ch.name?.toLowerCase().includes(q));
    }

    return result;
  }, [channels, selectedCategory, searchQuery]);

  // ─── Build list data with a section header item injected ──────────────────
  const listData = useMemo(() => {
    if (filtered.length === 0) return [];
    const label = selectedCategory
      ? `${selectedCategory} (${filtered.length})`
      : searchQuery
      ? `Results (${filtered.length})`
      : `All channels (${filtered.length})`;
    return [{ type: 'header', label, count: filtered.length }, ...filtered];
  }, [filtered, selectedCategory, searchQuery]);

  // ─── keyExtractor ──────────────────────────────────────────────────────────
  const keyExtractor = useCallback(
    (item:any) => (item.type === 'header' ? 'section-header' : String(item.id ?? item.num)),
    []
  );

  // ─── renderItem ───────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }:any) => {
    if (item.type === 'header') {
      return <SectionLabel title={item.label} count={item.count} />;
    }
    return <ChannelCard channel={item} />;
  }, []);

  // ─── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return <ChannelCardSkeleton count={12} />;
  }

  // ─── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return <ErrorState message={error?.message} onRetry={onRefetch} />;
  }

  // ─── Empty state ───────────────────────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <EmptyState
        query={searchQuery}
        category={selectedCategory}
        onClear={onClearFilters}
      />
    );
  }

  return (
    <FlatList
      data={listData}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerClassName="pb-24"
      showsVerticalScrollIndicator={false}
      initialNumToRender={15}
      maxToRenderPerBatch={20}
      windowSize={10}
      removeClippedSubviews
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefetch}
          tintColor="rgba(139,92,246,0.8)"
          colors={['#7c3aed']}
        />
      }
      getItemLayout={(data, index) => ({
        length: 68,       // ChannelCard height = py-3.5 (14×2) + content (40) = 68
        offset: 68 * index,
        index,
      })}
    />
  );
}
