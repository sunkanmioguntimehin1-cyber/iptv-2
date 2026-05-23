import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE =
  (Constants.expoConfig?.extra as Record<string, unknown>)?.apiBaseUrl ??
  'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE as string,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@iptv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const REFRESH_ENDPOINT = '/auth/refresh';

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success === true && response.data?.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_ENDPOINT
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@iptv_refresh');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}${REFRESH_ENDPOINT}`,
          { refreshToken }
        );

        const unwrapped = data?.data ?? data;
        const newToken = unwrapped.accessToken;
        const newRefresh = unwrapped.refreshToken;

        await AsyncStorage.setItem('@iptv_token', newToken);
        await AsyncStorage.setItem('@iptv_refresh', newRefresh);

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await AsyncStorage.multiRemove(['@iptv_token', '@iptv_refresh', '@iptv_creds', '@iptv_user']);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
      error.errors = error.response.data.errors;
    }

    return Promise.reject(error);
  }
);
