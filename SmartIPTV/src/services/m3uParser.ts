export interface M3UChannel {
  id: string;
  num: number;
  name: string;
  logo: string | null;
  cmd: string;
  category: string | null;
  isLive: boolean;
}

export const parseM3U = (text: string) => {
  const lines = text.split('\n');
  const channels: M3UChannel[] = [];
  let current: Partial<M3UChannel> | null = null;
  let index = 0;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const tvgId   = line.match(/tvg-id="([^"]*)"/)?.[1] ?? '';
      const tvgLogo = line.match(/tvg-logo="([^"]*)"/)?.[1] ?? '';
      const group   = line.match(/group-title="([^"]*)"/)?.[1] ?? '';
      const name    = line.split(',').pop()?.trim() ?? 'Unknown';

      current = {
        id: tvgId || String(++index),
        name,
        logo: tvgLogo || null,
        category: group || null,
        isLive: true,
      };
    } else if (!line.startsWith('#') && current) {
      current.cmd = line;
      current.num = channels.length + 1;
      channels.push(current as M3UChannel);
      current = null;
    }
  }

  const seen = new Set<string>();
  const categories = channels
    .map(c => c.category)
    .filter((c): c is string => !!c && !seen.has(c) && !!seen.add(c))
    .map(name => ({ id: name, name }));

  return { channels, categories };
};
