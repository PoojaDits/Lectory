import { create } from "zustand";
import type { AuthUser } from "@/types";

const STORAGE_KEY = "lectory-auth-user";
const IMPERSONATOR_KEY = "lectory-impersonator";

const readStored = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
};

const initialUser = readStored<AuthUser>(STORAGE_KEY);
const initialImpersonator = readStored<AuthUser>(IMPERSONATOR_KEY);

interface AuthStore {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  /** The original admin while impersonating someone else (null otherwise). */
  impersonator: AuthUser | null;
  isImpersonating: boolean;

  setUser: (user: AuthUser) => void;
  logout: () => void;

  /** Admin starts acting as another user (customer or seller). */
  impersonate: (user: AuthUser) => void;
  /** Return to the original admin account. */
  stopImpersonating: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  impersonator: initialImpersonator,
  isImpersonating: Boolean(initialImpersonator),

  setUser: (user) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    // A fresh login clears any impersonation session.
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    set({
      currentUser: user,
      isAuthenticated: true,
      impersonator: null,
      isImpersonating: false,
    });
  },

  logout: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    set({
      currentUser: null,
      isAuthenticated: false,
      impersonator: null,
      isImpersonating: false,
    });
  },

  impersonate: (user) => {
    const { currentUser, impersonator } = get();
    // Only an admin (who is not already impersonating) may start a session.
    if (!currentUser || currentUser.role !== "admin" || impersonator) return;

    window.localStorage.setItem(IMPERSONATOR_KEY, JSON.stringify(currentUser));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({
      impersonator: currentUser,
      currentUser: user,
      isAuthenticated: true,
      isImpersonating: true,
    });
  },

  stopImpersonating: () => {
    const { impersonator } = get();
    if (!impersonator) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(impersonator));
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    set({
      currentUser: impersonator,
      impersonator: null,
      isImpersonating: false,
      isAuthenticated: true,
    });
  },
}));
