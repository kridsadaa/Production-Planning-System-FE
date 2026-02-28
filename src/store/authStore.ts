import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  passwordChangeRequired: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setAuth: (user, accessToken) => {
        set({ user, accessToken });
        localStorage.setItem("accessToken", accessToken);
      },
      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      },
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    {
      name: "auth-storage",
    }
  )
);
