import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';

export interface BusinessOwner {
  id: string; // UUID
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: number;
  name: string;
  description: string | null;
  cityId: number;
  categoryId: number;
  subcategoryId: number | null;
  businessOwnerId: string | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  claimedAt: string | null;
  approvedAt: string | null;
  approvalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  city?: { id: number; name: string };
  category?: { id: number; name: string; icon: string };
  subcategory?: { id: number; name: string; icon: string };
}

interface BusinessOwnerContextType {
  owner: BusinessOwner | null;
  token: string | null;
  loading: boolean;
  myBusinesses: Business[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refreshMyBusinesses: () => Promise<void>;
  isAuthenticated: boolean;
}

export const BusinessOwnerContext = createContext<BusinessOwnerContextType | undefined>(undefined);

export function BusinessOwnerProvider({ children }: { children: ReactNode }) {
  const [owner, setOwner] = useState<BusinessOwner | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('businessOwnerToken'));
  const [loading, setLoading] = useState(true);
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);

  // Set up API interceptor to include token in requests
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load business owner on mount if token exists
  useEffect(() => {
    async function loadBusinessOwner() {
      if (token) {
        try {
          const { data } = await api.get('/auth/business-owner/me');
          setOwner(data.data);
          setMyBusinesses(data.data.myBusinesses || []);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('businessOwnerToken');
          setToken(null);
        }
      }
      setLoading(false);
    }
    loadBusinessOwner();
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/business-owner/login', { email, password });
    setOwner(data.data.owner);
    setToken(data.data.token);
    localStorage.setItem('businessOwnerToken', data.data.token);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data } = await api.post('/auth/business-owner/signup', {
      email,
      password,
      firstName,
      lastName,
    });
    setOwner(data.data.owner);
    setToken(data.data.token);
    localStorage.setItem('businessOwnerToken', data.data.token);
  };

  const logout = () => {
    setOwner(null);
    setToken(null);
    setMyBusinesses([]);
    localStorage.removeItem('businessOwnerToken');
  };

  const refreshMyBusinesses = async () => {
    if (token) {
      try {
        const { data } = await api.get('/owner/my-businesses');
        setMyBusinesses(data.data);
      } catch (error) {
        console.error('Failed to refresh businesses:', error);
      }
    }
  };

  const value = {
    owner,
    token,
    loading,
    myBusinesses,
    login,
    signup,
    logout,
    refreshMyBusinesses,
    isAuthenticated: !!owner,
  };

  return <BusinessOwnerContext.Provider value={value}>{children}</BusinessOwnerContext.Provider>;
}
