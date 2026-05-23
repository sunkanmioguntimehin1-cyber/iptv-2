import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

// ─── Single animated shimmer block ───────────────────────────────────────────
function Shimmer({ className, style }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[{ opacity, backgroundColor: 'rgba(255,255,255,0.08)' }, style]}
      className={className}
    />
  );
}

// ─── One skeleton row matching ChannelCard layout ─────────────────────────────
function SkeletonRow() {
  return (
    <View className="flex-row items-center gap-3 px-5 py-3.5 border-b border-white/5">
      {/* Logo placeholder */}
      <Shimmer className="rounded-xl" style={{ width: 48, height: 48 }} />
      {/* Text lines */}
      <View className="flex-1 gap-2">
        <Shimmer className="rounded-md" style={{ width: '55%', height: 14 }} />
        <Shimmer className="rounded-md" style={{ width: '35%', height: 11 }} />
      </View>
      {/* Chevron placeholder */}
      <Shimmer className="rounded-full" style={{ width: 28, height: 28 }} />
    </View>
  );
}

// ─── Exported skeleton list — renders N rows ─────────────────────────────────
export default function ChannelCardSkeleton({ count = 10 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  );
}
