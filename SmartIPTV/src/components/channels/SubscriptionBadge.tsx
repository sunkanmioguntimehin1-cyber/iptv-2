import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

function formatExpiry(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const now   = new Date();
  const days  = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

  if (days < 0)  return { label: 'Expired',          urgency: 'expired'  };
  if (days === 0) return { label: 'Expires today',    urgency: 'critical' };
  if (days <= 3)  return { label: `${days}d left`,    urgency: 'warning'  };
  if (days <= 7)  return { label: `${days}d left`,    urgency: 'caution'  };
  return           { label: `${days} days left`,      urgency: 'ok'       };
}

const URGENCY_STYLES = {
  ok:       { wrap: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  caution:  { wrap: 'bg-violet-500/10  border-violet-500/20',  dot: 'bg-violet-400',  text: 'text-violet-400'  },
  warning:  { wrap: 'bg-amber-500/10   border-amber-500/20',   dot: 'bg-amber-400',   text: 'text-amber-400'   },
  critical: { wrap: 'bg-red-500/10     border-red-500/20',     dot: 'bg-red-400',     text: 'text-red-400'     },
  expired:  { wrap: 'bg-red-500/10     border-red-500/20',     dot: 'bg-red-400',     text: 'text-red-400'     },
};

export default function SubscriptionBadge() {
  const router   = useRouter();
  const { user } = useAuthStore();

  const expiry   = formatExpiry(user?.expiresAt);
  if (!expiry) return null;

  const styles   = URGENCY_STYLES[expiry.urgency] ?? URGENCY_STYLES.ok;
  const isRenew  = expiry.urgency === 'expired' || expiry.urgency === 'critical';

  return (
    <View className="mx-5 mb-3">
      <View className={`flex-row items-center justify-between px-3 py-2.5 rounded-xl border ${styles.wrap}`}>
        <View className="flex-row items-center gap-2">
          <View className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <Text className={`text-[12px] font-medium ${styles.text}`}>
            {user?.plan ?? 'Active plan'} · {expiry.label}
          </Text>
        </View>
        {isRenew && (
          <TouchableOpacity
            onPress={() => router.push('/(auth)/plans')}
            activeOpacity={0.7}
          >
            <Text className="text-violet-400 text-[11px] font-semibold">Renew →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
