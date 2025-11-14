import type { ProfileRes } from "@/schema/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user?: ProfileRes;
  setUser: (u?: ProfileRes) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

