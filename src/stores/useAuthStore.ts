import { create } from "zustand";
import type { AuthUser } from "@/types";

const STORAGE_KEY = "lectory-auth-user";
const IMPERSONATOR_KEY = "lectory-impersonator";
const ACCESS_TOKEN_KEY = "lectory-access-token";
const REFRESH_TOKEN_KEY = "lectory-refresh-token";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

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

const readStoredText = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
};

const initialUser = readStored<AuthUser>(STORAGE_KEY);
const initialImpersonator = readStored<AuthUser>(IMPERSONATOR_KEY);
const initialAccessToken = readStoredText(ACCESS_TOKEN_KEY);
const initialRefreshToken = readStoredText(REFRESH_TOKEN_KEY);

interface AuthStore {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  /** The original admin while impersonating someone else (null otherwise). */
  impersonator: AuthUser | null;
  isImpersonating: boolean;
  /**
   * Set to true at the start of `impersonate` / `stopImpersonating` so
   * that any ProtectedRoute evaluating the in-flight render(s) before
   * the navigation commits suppresses its "permission denied" toast.
   * Cleared by App.tsx after the navigation lands.
   */
  isRoleTransitioning: boolean;

  /** Used after real backend login: stores user + JWT tokens. */
  setSession: (user: AuthUser, tokens: AuthTokens) => void;
  /** Used by profile updates/impersonation when only the user object changes. */
  setUser: (user: AuthUser) => void;
  logout: () => void;

  /** Admin starts acting as another user (customer or seller). */
  impersonate: (user: AuthUser) => void;
  /** Return to the original admin account. */
  stopImpersonating: () => void;
  /** Internal: mark a role change in progress. */
  beginRoleTransition: () => void;
  /** Internal: clear the role-change flag once navigation has landed. */
  endRoleTransition: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser && initialAccessToken),
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  impersonator: initialImpersonator,
  isImpersonating: Boolean(initialImpersonator),
  isRoleTransitioning: false,

  setSession: (user, tokens) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    // A fresh login clears any impersonation session.
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    set({
      currentUser: user,
      isAuthenticated: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      impersonator: null,
      isImpersonating: false,
      isRoleTransitioning: false,
    });
  },

  setUser: (user) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({
      currentUser: user,
      isAuthenticated: Boolean(get().accessToken),
      isRoleTransitioning: false,
    });
  },

  logout: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({
      currentUser: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      impersonator: null,
      isImpersonating: false,
      isRoleTransitioning: false,
    });
  },

  beginRoleTransition: () => set({ isRoleTransitioning: true }),
  endRoleTransition: () => set({ isRoleTransitioning: false }),

  impersonate: (user) => {
    const { currentUser, impersonator } = get();
    // Only an admin (who is not already impersonating) may start a session.
    if (!currentUser || currentUser.role !== "admin" || impersonator) return;

    // Note: the JWT token remains the real admin token. Impersonation is a
    // frontend-only view switch until backend impersonation APIs are added.
    set({ isRoleTransitioning: true });

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

    set({ isRoleTransitioning: true });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(impersonator));
    window.localStorage.removeItem(IMPERSONATOR_KEY);
    set({
      currentUser: impersonator,
      impersonator: null,
      isImpersonating: false,
      isAuthenticated: Boolean(get().accessToken),
    });
  },
}));
