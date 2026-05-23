import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../services/loginApi';
import { registerUser } from '../services/authApi';
import { getMe, logout as logoutApi } from '../services/userApi';
import { useAuthStore } from '../store/authStore';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setIptvCredentials = useAuthStore((s) => s.setIptvCredentials);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: ({ user, accessToken, refreshToken, iptvCredentials }) => {
      console.log("user", user)
      setUser(user);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      if (iptvCredentials) {
        setIptvCredentials(iptvCredentials);
      }
    },
  });
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setIptvCredentials = useAuthStore((s) => s.setIptvCredentials);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: ({ user, accessToken, refreshToken, iptvCredentials }) => {
      setUser(user);
      setToken(accessToken);
      setRefreshToken(refreshToken);
      if (iptvCredentials) {
        setIptvCredentials(iptvCredentials);
      }
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      queryClient.clear();
      logout();
    },
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const setIptvCredentials = useAuthStore((s) => s.setIptvCredentials);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await getMe();
      if (data.user) {
        setUser({
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          plan: data.subscription?.plan?.name,
          subscriptionStatus: data.subscription?.status ?? null,
          planSlug: data.subscription?.plan?.slug ?? null,
          expiresAt: data.subscription?.endDate,
        });
      }
      if (data.iptvCredentials) {
        setIptvCredentials(data.iptvCredentials);
      }
      return data;
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
