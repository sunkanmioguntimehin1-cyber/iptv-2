import { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

const ALL_CATEGORY = { id: 'all', name: 'All' };

export default function CategoryFilter({ categories = [], selected, onSelect }: {
  categories?: { id: string; name: string }[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const allCategories = [ALL_CATEGORY, ...categories];

  const handleSelect = (cat: { id: string; name: string }, index: number) => {
    onSelect(cat.id === 'all' ? null : cat.id);
    // Auto-scroll selected pill into view
    scrollRef.current?.scrollTo({ x: Math.max(0, index * 92 - 40), animated: true });
  };

  if (categories.length === 0) return null;

  return (
    <View className="mb-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 gap-2"
        className="flex-grow-0"
        bounces={false}
      >
        {allCategories.map((cat, index) => {
          const isActive =
            (cat.id === 'all' && !selected) ||
            (cat.id !== 'all' && cat.id === selected);

          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleSelect(cat, index)}
              activeOpacity={0.7}
              className={`h-8 px-4 rounded-full border items-center justify-center ${
                isActive
                  ? 'bg-violet-600 border-violet-600'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text
                className={`text-[12px] font-semibold ${
                  isActive ? 'text-white' : 'text-white/40'
                }`}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
