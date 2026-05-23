export const getChannels = async ({ portalUrl, iptvUsername, iptvPassword }) => {
  const url = `${portalUrl}/player_api.php?username=${iptvUsername}&password=${iptvPassword}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Xtream API error: ${res.status}`);

  const data = await res.json();

  const categories = (data.categories ?? [])
    .filter((c: any) => c.category_id)
    .map((c: any) => ({ id: c.category_id, name: c.category_name }));

  const channels = (data.live ?? []).map((ch: any) => ({
    id:       String(ch.stream_id),
    num:      ch.num,
    name:     ch.name,
    logo:     ch.stream_icon ?? null,
    cmd:      String(ch.stream_id),
    category: categories.find((c: any) => c.id === ch.category_id)?.name ?? null,
    isLive:   true,
  }));

  return { channels, categories };
};

export const getStreamUrl = ({ portalUrl, iptvUsername, iptvPassword, cmd }) => {
  return `${portalUrl}/live/${iptvUsername}/${iptvPassword}/${cmd}.ts`;
};
