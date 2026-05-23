import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

// ─── Derive a deterministic accent color from channel name ───────────────────
const ACCENTS = [
  'bg-violet-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-pink-600',
];
function accentFor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return ACCENTS[Math.abs(hash) % ACCENTS.length];
}

// ─── Channel logo — falls back to initials if image fails ────────────────────
function ChannelLogo({ uri, name }:any) {
  const initials = (name ?? '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  if (!uri) {
    return (
      <View className={`w-12 h-12 rounded-xl ${accentFor(name)} items-center justify-center`}>
        <Text className="text-white text-[13px] font-bold">{initials}</Text>
      </View>
    );
  }

  return (
    <View className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden items-center justify-center">
      <Image
        source={{ uri }}
        className="w-10 h-10"
        resizeMode="contain"
        onError={() => {}}
      />
    </View>
  );
}

// ─── Live badge ───────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <View className="flex-row items-center gap-1 bg-red-500/20 border border-red-500/30 rounded-full px-2 py-0.5">
      <View className="w-1.5 h-1.5 rounded-full bg-red-400" />
      <Text className="text-red-400 text-[9px] font-bold tracking-wider">LIVE</Text>
    </View>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export default function ChannelCard({ channel, onPress }:any) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress(channel);
    router.push({
      pathname: '/(main)/player',
      params:   { channelId: channel.id, channelName: channel.name },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      className="flex-row items-center gap-3 px-5 py-3.5 border-b border-white/5 active:bg-white/5"
    >
      {/* Logo */}
      <ChannelLogo uri={channel.logo} name={channel.name} />

      {/* Info */}
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2 mb-0.5">
          <Text
            className="text-white text-[14px] font-semibold flex-shrink"
            numberOfLines={1}
          >
            {channel.name}
          </Text>
          {channel.isLive && <LiveBadge />}
        </View>
        <View className="flex-row items-center gap-1.5">
          {channel.category && (
            <Text className="text-white/30 text-[11px]" numberOfLines={1}>
              {channel.category}
            </Text>
          )}
          {channel.category && channel.num && (
            <Text className="text-white/15 text-[11px]">·</Text>
          )}
          {channel.num && (
            <Text className="text-white/25 text-[11px]">Ch {channel.num}</Text>
          )}
        </View>
      </View>

      {/* Play chevron */}
      <View className="w-7 h-7 rounded-full bg-white/5 items-center justify-center">
        <View
          style={{
            width: 0, height: 0,
            borderLeftWidth: 7,
            borderLeftColor: 'rgba(255,255,255,0.4)',
            borderTopWidth: 4,
            borderTopColor: 'transparent',
            borderBottomWidth: 4,
            borderBottomColor: 'transparent',
            marginLeft: 2,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
