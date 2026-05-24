import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { getChannels, getStreamUrl, getM3UChannels, getM3UStreamUrl } from "../services/channels";

const USE_M3U = true;

export function useChannels() {
  if (USE_M3U) {
    return useQuery({
      queryKey: ["m3u-channels"],
      queryFn: getM3UChannels,
      staleTime: 1000 * 60 * 30,
      retry: 2,
      select: (data) => ({
        channels:   data.channels   ?? [],
        categories: data.categories ?? [],
      }),
    });
  }

  const { iptvUsername, iptvPassword, portalUrl } = useAuthStore();

  return useQuery({
    queryKey: ["channels", portalUrl],
    queryFn: () => getChannels({ portalUrl: portalUrl!, iptvUsername: iptvUsername!, iptvPassword: iptvPassword! }),
    enabled: !!portalUrl && !!iptvUsername && !!iptvPassword,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    select: (data) => ({
      channels:   data.channels   ?? [],
      categories: data.categories ?? [],
    }),
  });
}

export function useStreamUrl(channel: any) {
  if (USE_M3U) {
    return useQuery({
      queryKey: ["m3u-stream", channel?.id],
      queryFn: () => getM3UStreamUrl({ cmd: channel.cmd }),
      enabled: !!channel?.cmd,
      staleTime: Infinity,
      retry: 1,
    });
  }

  const { iptvUsername, iptvPassword, portalUrl } = useAuthStore();

  return useQuery({
    queryKey: ["stream", channel?.id],
    queryFn: () =>
      getStreamUrl({
        portalUrl:    portalUrl!,
        iptvUsername: iptvUsername!,
        iptvPassword: iptvPassword!,
        cmd:          channel.cmd,
      }),
    enabled: !!channel?.cmd && !!portalUrl && !!iptvUsername && !!iptvPassword,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
