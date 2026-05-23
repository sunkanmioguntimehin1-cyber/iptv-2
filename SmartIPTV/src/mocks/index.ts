export const MOCK_USER = {
  id: "mock-001",
  name: "Sunkanmi Adeyemi",
  email: "sunkanmi@example.com",
  plan: "Yearly",
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  role: "subscriber",
};

export const MOCK_IPTV_CREDENTIALS = {
  portalUrl: "http://opplex.rw:8080",
  iptvUsername: "kings117987",
  iptvPassword: "505050",
  expiresAt: MOCK_USER.expiresAt,
};

export const MOCK_PLANS = [
  {
    id: "plan-monthly",
    name: "Monthly",
    slug: "monthly",
    price: 12,
    currency: "USD",
    durationDays: 30,
    maxConnections: 2,
    popular: true,
    savings: null as string | null,
    features: [
      "All 10,000+ channels",
      "Full VOD library",
      "4K streams",
      "2 devices at once",
      "Cancel anytime",
    ],
  },
  {
    id: "plan-yearly",
    name: "Yearly",
    slug: "yearly",
    price: 79,
    currency: "USD",
    durationDays: 365,
    maxConnections: 4,
    popular: false,
    savings: "45%",
    features: [
      "Everything in Monthly",
      "4 devices at once",
      "Priority support",
      "Early access to new channels",
      "Save 45% vs monthly",
    ],
  },
];

export const MOCK_CHANNELS = [
  {
    id: "1",
    num: 1,
    name: "BBC News",
    category: "News",
    isLive: true,
    logo: null,
    cmd: "http://demo/bbc",
  },
  {
    id: "2",
    num: 2,
    name: "CNN International",
    category: "News",
    isLive: true,
    logo: null,
    cmd: "http://demo/cnn",
  },
  {
    id: "3",
    num: 3,
    name: "Al Jazeera",
    category: "News",
    isLive: true,
    logo: null,
    cmd: "http://demo/alj",
  },
  {
    id: "4",
    num: 4,
    name: "Sky Sports",
    category: "Sports",
    isLive: true,
    logo: null,
    cmd: "http://demo/sky",
  },
  {
    id: "5",
    num: 5,
    name: "ESPN",
    category: "Sports",
    isLive: true,
    logo: null,
    cmd: "http://demo/espn",
  },
  {
    id: "6",
    num: 6,
    name: "beIN Sports",
    category: "Sports",
    isLive: true,
    logo: null,
    cmd: "http://demo/bein",
  },
  {
    id: "7",
    num: 7,
    name: "SuperSport",
    category: "Sports",
    isLive: true,
    logo: null,
    cmd: "http://demo/ss",
  },
  {
    id: "8",
    num: 8,
    name: "Comedy Central",
    category: "Entertainment",
    isLive: true,
    logo: null,
    cmd: "http://demo/cc",
  },
  {
    id: "9",
    num: 9,
    name: "E! Entertainment",
    category: "Entertainment",
    isLive: true,
    logo: null,
    cmd: "http://demo/e",
  },
  {
    id: "10",
    num: 10,
    name: "MTV Base",
    category: "Music",
    isLive: true,
    logo: null,
    cmd: "http://demo/mtv",
  },
  {
    id: "11",
    num: 11,
    name: "Trace Urban",
    category: "Music",
    isLive: true,
    logo: null,
    cmd: "http://demo/trace",
  },
  {
    id: "12",
    num: 12,
    name: "Cartoon Network",
    category: "Kids",
    isLive: true,
    logo: null,
    cmd: "http://demo/cn",
  },
  {
    id: "13",
    num: 13,
    name: "Disney Channel",
    category: "Kids",
    isLive: false,
    logo: null,
    cmd: "http://demo/disney",
  },
  {
    id: "14",
    num: 14,
    name: "Nickelodeon",
    category: "Kids",
    isLive: true,
    logo: null,
    cmd: "http://demo/nick",
  },
  {
    id: "15",
    num: 15,
    name: "National Geographic",
    category: "Documentary",
    isLive: true,
    logo: null,
    cmd: "http://demo/natgeo",
  },
  {
    id: "16",
    num: 16,
    name: "Discovery Channel",
    category: "Documentary",
    isLive: true,
    logo: null,
    cmd: "http://demo/disc",
  },
  {
    id: "17",
    num: 17,
    name: "History Channel",
    category: "Documentary",
    isLive: false,
    logo: null,
    cmd: "http://demo/hist",
  },
  {
    id: "18",
    num: 18,
    name: "HBO",
    category: "Movies",
    isLive: true,
    logo: null,
    cmd: "http://demo/hbo",
  },
  {
    id: "19",
    num: 19,
    name: "Showtime",
    category: "Movies",
    isLive: true,
    logo: null,
    cmd: "http://demo/show",
  },
  {
    id: "20",
    num: 20,
    name: "Africa Magic",
    category: "Entertainment",
    isLive: true,
    logo: null,
    cmd: "http://demo/am",
  },
  {
    id: "21",
    num: 21,
    name: "Channels TV",
    category: "News",
    isLive: true,
    logo: null,
    cmd: "http://demo/ctv",
  },
  {
    id: "22",
    num: 22,
    name: "NTA News 24",
    category: "News",
    isLive: true,
    logo: null,
    cmd: "http://demo/nta",
  },
  {
    id: "23",
    num: 23,
    name: "Food Network",
    category: "Lifestyle",
    isLive: false,
    logo: null,
    cmd: "http://demo/food",
  },
  {
    id: "24",
    num: 24,
    name: "Travel Channel",
    category: "Lifestyle",
    isLive: true,
    logo: null,
    cmd: "http://demo/travel",
  },
];

export const MOCK_CATEGORIES = Array.from(
  new Map(
    MOCK_CHANNELS.map((ch) => [
      ch.category,
      { id: ch.category, name: ch.category },
    ]),
  ).values(),
);

const mockDelay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

export const mockRegister = async (p: {
  name: string;
  email: string;
  password: string;
}) => {
  await mockDelay(1200);
  return {
    user: { ...MOCK_USER, name: p.name, email: p.email },
    accessToken: "mock-jwt-" + Date.now(),
  };
};

export const mockLogin = async (p: { email: string; password: string }) => {
  await mockDelay(1000);
  if (p.password === "wrong") throw new Error("Invalid credentials");
  return {
    user: { ...MOCK_USER, email: p.email },
    accessToken: "mock-jwt-" + Date.now(),
    iptvCredentials: MOCK_IPTV_CREDENTIALS,
  };
};

export const mockGetChannels = async () => {
  await mockDelay(1500);
  return { channels: MOCK_CHANNELS, categories: MOCK_CATEGORIES };
};
