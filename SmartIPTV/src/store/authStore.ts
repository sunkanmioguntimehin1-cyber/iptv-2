import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  plan?: string;
  subscriptionStatus?: string | null;
  planSlug?: string | null;
  expiresAt?: string | null;
  role?: string;
}

export interface IptvCredentials {
  portalUrl: string;
  iptvUsername: string;
  iptvPassword: string;
  expiresAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  portalUrl: string | null;
  iptvUsername: string | null;
  iptvPassword: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  setRefreshToken: (token: string | null) => Promise<void>;
  setIptvCredentials: (creds: IptvCredentials) => void;
  clearCredentials: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  portalUrl: null,
  iptvUsername: null,
  iptvPassword: null,

  setUser: (user) => {
    if (user) AsyncStorage.setItem('@iptv_user', JSON.stringify(user));
    else AsyncStorage.removeItem('@iptv_user');
    set({ user });
  },

  setToken: async (token) => {
    if (token) await AsyncStorage.setItem('@iptv_token', token);
    else await AsyncStorage.removeItem('@iptv_token');
    set({ accessToken: token });
  },

  setRefreshToken: async (token) => {
    if (token) await AsyncStorage.setItem('@iptv_refresh', token);
    else await AsyncStorage.removeItem('@iptv_refresh');
    set({ refreshToken: token });
  },

  setIptvCredentials: (creds) => {
    AsyncStorage.setItem('@iptv_creds', JSON.stringify(creds));
    set({
      portalUrl: creds.portalUrl,
      iptvUsername: creds.iptvUsername,
      iptvPassword: creds.iptvPassword,
    });
  },

  clearCredentials: async () => {
    await AsyncStorage.multiRemove(['@iptv_token', '@iptv_refresh', '@iptv_creds', '@iptv_user']);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      portalUrl: null,
      iptvUsername: null,
      iptvPassword: null,
    });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['@iptv_token', '@iptv_refresh', '@iptv_creds', '@iptv_user']);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      portalUrl: null,
      iptvUsername: null,
      iptvPassword: null,
    });
  },

  hydrate: async () => {
    try {
      const [[, token], [, refresh], [, credsRaw], [, userRaw]] =
        await AsyncStorage.multiGet([
          '@iptv_token',
          '@iptv_refresh',
          '@iptv_creds',
          '@iptv_user',
        ]);
      const creds = credsRaw ? JSON.parse(credsRaw) : null;
      const user = userRaw ? JSON.parse(userRaw) : null;
      set({
        accessToken: token ?? null,
        refreshToken: refresh ?? null,
        user,
        portalUrl: creds?.portalUrl ?? null,
        iptvUsername: creds?.iptvUsername ?? null,
        iptvPassword: creds?.iptvPassword ?? null,
      });
    } catch {
      /* silent fail */
    }
  },
}));
