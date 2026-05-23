import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getChannels, getStreamUrl } from "../services/channels";

export function useChannels() {
  const { iptvUsername, iptvPassword, portalUrl } = useAuthStore();

  return useQuery({
    queryKey: ["channels", portalUrl],
    queryFn: () => getChannels({ portalUrl, iptvUsername, iptvPassword }),
    enabled: !!portalUrl && !!iptvUsername,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    select: (data) => ({
      channels: data.channels ?? [],
      categories: data.categories ?? [],
    }),
  });
}

export function useStreamUrl(channel: any) {
  const { iptvUsername, iptvPassword, portalUrl } = useAuthStore();

  return useQuery({
    queryKey: ["stream", channel?.id],
    queryFn: () =>
      getStreamUrl({
        portalUrl,
        iptvUsername,
        iptvPassword,
        cmd: channel.cmd,
      }),
    enabled: !!channel?.cmd && !!portalUrl,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}