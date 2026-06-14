import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthState {
  token: string | null;
  role: 'customer' | 'seller' | 'admin' | null;
  userId: number | null;
}

const AuthContext = createContext<{ auth: AuthState; setAuth: (a: AuthState) => void; logout: () => void }>(
  {
    auth: { token: null, role: null, userId: null },
    setAuth: () => { },
    logout: () => { },
  }
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ token: null, role: null, userId: null });

  // Load persisted auth on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try { setAuth(JSON.parse(stored)); } catch { }
    }
  }, []);

  // Persist auth changes
  useEffect(() => {
    if (auth.token) localStorage.setItem('auth', JSON.stringify(auth));
    else localStorage.removeItem('auth');
  }, [auth]);

  const logout = () => setAuth({ token: null, role: null, userId: null });

  return <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
