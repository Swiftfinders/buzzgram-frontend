import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'business_owner' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'user' | 'business_owner') => Promise<void>;
  googleLogin: (credential: string, userType?: 'customer' | 'business_owner', businessName?: string, instagramHandle?: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBusinessOwner: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up API interceptor to include token in requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.data);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem('token', data.data.token);
  };

  const register = async (email: string, password: string, name: string, role: 'user' | 'business_owner' = 'user') => {
    const { data } = await api.post('/auth/register', { email, password, name, role });
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem('token', data.data.token);
  };

  const googleLogin = async (credential: string, userType?: 'customer' | 'business_owner', businessName?: string, instagramHandle?: string, phone?: string) => {
    const { data } = await api.post('/auth/google', {
      credential,
      userType,
      businessName,
      instagramHandle,
      phone,
    });
    setUser(data.data.user);
    setToken(data.data.token);
    localStorage.setItem('token', data.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');

    // Clear Google session to prevent auto-select
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isBusinessOwner: user?.role === 'business_owner' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
