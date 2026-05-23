import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  user: string | null;
  isLoading: boolean;
  setUser: (user: string | null) => void;
  loadUser: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  loadUser: async () => {
    set({ isLoading: true });
    try {
      const userData = await AsyncStorage.getItem("user");
      set({ user: userData, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));