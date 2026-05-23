interface XtreamCredentials {
  portalUrl: string;
  iptvUsername: string;
  iptvPassword: string;
}

const xtreamFetch = async (credentials: XtreamCredentials, action: string) => {
  const { portalUrl, iptvUsername, iptvPassword } = credentials;

  const actionParam = action ? `&action=${action}` : '';
  const url = `${portalUrl}/player_api.php?username=${iptvUsername}&password=${iptvPassword}${actionParam}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Invalid IPTV credentials — please contact support');
    }
    throw new Error(`IPTV server error: ${res.status}`);
  }

  return res.json();
};

let _streamBaseUrl: string | null = null;

const getStreamBaseUrl = async (creds: XtreamCredentials): Promise<string> => {
  if (_streamBaseUrl) return _streamBaseUrl;

  try {
    const data = await xtreamFetch(creds, '');
    const si = data?.server_info ?? {};
    const protocol = si.server_protocol || 'http';
    const host = si.url || new URL(creds.portalUrl).hostname;
    const port = si.port || new URL(creds.portalUrl).port || '80';
    _streamBaseUrl = `${protocol}://${host}:${port}`;
  } catch {
    _streamBaseUrl = creds.portalUrl;
  }

  return _streamBaseUrl;
};

export const getChannels = async ({
  portalUrl,
  iptvUsername,
  iptvPassword,
}: XtreamCredentials) => {
  const creds = { portalUrl, iptvUsername, iptvPassword };

  const [rawCategories, rawStreams] = await Promise.all([
    xtreamFetch(creds, 'get_live_categories'),
    xtreamFetch(creds, 'get_live_streams'),
  ]);

  const categories: { id: string; name: string }[] = (
    Array.isArray(rawCategories) ? rawCategories : []
  )
    .filter((c: any) => c.category_id && c.category_name)
    .map((c: any) => ({
      id: String(c.category_id),
      name: String(c.category_name),
    }));

  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const channels = (Array.isArray(rawStreams) ? rawStreams : []).map((ch: any) => ({
    id: String(ch.stream_id),
    num: ch.num ?? 0,
    name: ch.name ?? 'Unknown Channel',
    logo: ch.stream_icon || null,
    cmd: String(ch.stream_id),
    category: ch.category_id ? (catMap.get(String(ch.category_id)) ?? null) : null,
    isLive: true,
  }));

  return { channels, categories };
};

export const getStreamUrl = async ({
  portalUrl,
  iptvUsername,
  iptvPassword,
  cmd,
}: XtreamCredentials & { cmd: string }): Promise<string> => {
  const baseUrl = await getStreamBaseUrl({ portalUrl, iptvUsername, iptvPassword });
  return `${baseUrl}/live/${iptvUsername}/${iptvPassword}/${cmd}.ts`;
};
