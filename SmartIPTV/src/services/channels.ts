// ─── Base headers that spoof a MAG STB device ────────────────────────────────
const buildHeaders = ({ portalUrl, iptvUsername, iptvPassword }) => ({
  'User-Agent':   'Mozilla/5.0 (QtEmbedded; U; Linux; C)',
  'X-User-Agent': 'Model: MAG254; Link: WiFi',
  'Referer':      `${portalUrl}/stalker_portal/c/`,
  'Cookie':       `mac=${iptvUsername}; stb_lang=en; timezone=Africa/Lagos`,
});

// ─── Base fetch wrapper with error handling ───────────────────────────────────
const portalFetch = async (url, headers) => {
  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new Error('Session expired — please reconnect');
    }
    throw new Error(`Portal error: ${res.status}`);
  }

  return res.json();
};

// ─── Step 1: Handshake — get session token ────────────────────────────────────
export const handshake = async ({ portalUrl, iptvUsername, iptvPassword }) => {
  const url = `${portalUrl}/stalker_portal/server/load.php` +
    `?type=stb&action=handshake&prehash=0&token=&JsHttpRequest=1-xml`;

  const data = await portalFetch(url, buildHeaders({ portalUrl, iptvUsername, iptvPassword }));
  return data?.js?.token ?? null;
};

// ─── Step 2: Auth profile ─────────────────────────────────────────────────────
export const getProfile = async ({ portalUrl, iptvUsername, iptvPassword, token }) => {
  const url = `${portalUrl}/stalker_portal/server/load.php` +
    `?type=stb&action=get_profile&hd=1&stb_type=MAG254&JsHttpRequest=1-xml`;

  const headers = {
    ...buildHeaders({ portalUrl, iptvUsername, iptvPassword }),
    Cookie: `mac=${iptvUsername}; stb_lang=en; timezone=Africa/Lagos; token=${token}`,
  };

  const data = await portalFetch(url, headers);
  return data?.js ?? null;
};

// ─── Step 3: Fetch all channels ───────────────────────────────────────────────
export const getChannels = async ({ portalUrl, iptvUsername, iptvPassword }) => {
  // First handshake to get token
  const token = await handshake({ portalUrl, iptvUsername, iptvPassword });
  if (!token) throw new Error('Handshake failed — could not get session token');

  await getProfile({ portalUrl, iptvUsername, iptvPassword, token });

  const url = `${portalUrl}/stalker_portal/server/load.php` +
    `?type=itv&action=get_all_channels&force_ch_link_check=&fav=0&sortby=number&hd=0&JsHttpRequest=1-xml`;

  const headers = {
    ...buildHeaders({ portalUrl, iptvUsername, iptvPassword }),
    Cookie: `mac=${iptvUsername}; stb_lang=en; token=${token}`,
  };

  const data = await portalFetch(url, headers);
  const raw  = data?.js?.data ?? [];

  // ─── Normalise channel objects ───────────────────────────────────────────
  const channels = raw.map((ch) => ({
    id:       ch.id,
    num:      ch.number,
    name:     ch.name,
    logo:     ch.logo?.startsWith('http') ? ch.logo : `${portalUrl}${ch.logo}`,
    cmd:      ch.cmd,                         // stream command — needed for getStreamUrl
    category: ch.tv_genre_id
      ? GENRE_MAP[ch.tv_genre_id] ?? `Genre ${ch.tv_genre_id}`
      : null,
    isLive:   true,
  }));

  // ─── Derive unique category list ─────────────────────────────────────────
  const categoryMap = new Map();
  channels.forEach((ch) => {
    if (ch.category && !categoryMap.has(ch.category)) {
      categoryMap.set(ch.category, { id: ch.category, name: ch.category });
    }
  });

  return {
    channels,
    categories: Array.from(categoryMap.values()),
    token,        // pass token through so stream URL requests can reuse it
  };
};

// ─── Step 4: Get playable stream URL for a channel ────────────────────────────
export const getStreamUrl = async ({ portalUrl, iptvUsername, iptvPassword, cmd }) => {
  const token = await handshake({ portalUrl, iptvUsername, iptvPassword });

  const encodedCmd = encodeURIComponent(cmd);
  const url = `${portalUrl}/stalker_portal/server/load.php` +
    `?type=itv&action=create_link&cmd=${encodedCmd}&series=&forced_storage=undefined&disable_ad=0&JsHttpRequest=1-xml`;

  const headers = {
    ...buildHeaders({ portalUrl, iptvUsername, iptvPassword }),
    Cookie: `mac=${iptvUsername}; stb_lang=en; token=${token}`,
  };

  const data = await portalFetch(url, headers);
  let streamUrl = data?.js?.cmd ?? null;

  if (!streamUrl) throw new Error('No stream URL returned from portal');

  // Strip the "ffmpeg " prefix some providers add
  if (streamUrl.startsWith('ffmpeg ')) {
    streamUrl = streamUrl.replace('ffmpeg ', '').trim();
  }

  return streamUrl;
};

// ─── Common genre ID → name mapping (XUI.ONE defaults) ───────────────────────
const GENRE_MAP = {
  1:  'News',
  2:  'Sports',
  3:  'Movies',
  4:  'Entertainment',
  5:  'Music',
  6:  'Kids',
  7:  'Documentary',
  8:  'Lifestyle',
  9:  'Comedy',
  10: 'Drama',
  11: 'Science',
  12: 'Travel',
  13: 'Food',
  14: 'Reality',
  15: 'Religion',
};
