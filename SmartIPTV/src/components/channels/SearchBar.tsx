import { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

// ─── Simple debounce hook ─────────────────────────────────────────────────────
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Search icon (simple SVG-equivalent using View) ───────────────────────────
function SearchIcon() {
  return (
    <View className="w-4 h-4 items-center justify-center">
      <View className="w-3 h-3 rounded-full border border-white/30" />
      <View
        className="absolute bg-white/30"
        style={{
          width: 1.5,
          height: 5,
          bottom: 0,
          right: 1,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export default function SearchBar({ onSearch, placeholder = 'Search channels...' }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const debounced = useDebounce(text, 300);

  useEffect(() => {
    onSearch?.(debounced.trim());
  }, [debounced]);

  const clear = () => {
    setText('');
    onSearch?.('');
    inputRef.current?.blur();
  };

  return (
    <View className="mx-5 mb-3">
      <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-3 h-11 gap-2">
        <SearchIcon />
        <TextInput
          ref={inputRef}
          className="flex-1 text-white text-[14px] h-full"
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={text}
          onChangeText={setText}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {text.length > 0 && (
          <TouchableOpacity
            onPress={clear}
            activeOpacity={0.7}
            className="w-5 h-5 rounded-full bg-white/15 items-center justify-center"
          >
            <Text className="text-white/60 text-[11px] font-bold leading-none">✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
