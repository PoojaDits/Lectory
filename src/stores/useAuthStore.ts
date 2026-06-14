import { create } from "zustand";
import type { AuthUser } from "@/types";

const STORAGE_KEY = "lectory-auth-user";

const readStoredUser = (): AuthUser | null => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
    }
};

const initialUser = readStoredUser();

interface AuthStore {
    currentUser: AuthUser | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    currentUser: initialUser,
    isAuthenticated: Boolean(initialUser),

    setUser: (user) => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        set({ currentUser: user, isAuthenticated: true });
    },

    logout: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        set({ currentUser: null, isAuthenticated: false });
    },
}));
