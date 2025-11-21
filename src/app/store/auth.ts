import { create } from "zustand";
import type { User } from "@/entities/user";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  setUser: (u?: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
      setUser: (u) => set({ user: u }),
    }),
    {
      name: "me",
    },
  ),
);

const ACCESS = "access_token";
const REFRESH = "refresh_token";
export const authStore = {
  getAccess: () => localStorage.getItem(ACCESS),
  setAccess: (t: string) => localStorage.setItem(ACCESS, t),
  removeAccess: () => localStorage.removeItem(ACCESS),

  getRefresh: () => localStorage.getItem(REFRESH),
  setRefresh: (t: string) => localStorage.setItem(REFRESH, t),
  removeRefresh: () => localStorage.removeItem(REFRESH),

  clearAll: () => {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};

