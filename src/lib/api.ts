import axios from 'axios';
import type { City, Category, Subcategory, Business, BusinessSearchParams } from '../types';

// Use Railway URL in production, localhost in development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://backend-production-f30d.up.railway.app'
  : 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const getCities = async (): Promise<City[]> => {
  const { data } = await api.get<{ success: boolean; data: City[] }>('/cities');
  return data.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<{ success: boolean; data: Category[] }>('/categories');
  return data.data;
};

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const { data } = await api.get<{ success: boolean; data: Subcategory[] }>('/subcategories');
  return data.data;
};

export const getBusinesses = async (params: BusinessSearchParams): Promise<Business[]> => {
  const { data } = await api.get<{ success: boolean; data: Business[] }>('/businesses', { params });
  return data.data;
};

export const getBusiness = async (id: number): Promise<Business> => {
  const { data } = await api.get<{ success: boolean; data: Business }>(`/businesses/${id}`);
  return data.data;
};

export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const { data } = await api.get('/health');
  return data;
};

// Favorites
export const getFavorites = async () => {
  const { data } = await api.get('/favorites');
  return data.data;
};

export const addFavorite = async (businessId: number) => {
  const { data } = await api.post(`/favorites/${businessId}`);
  return data;
};

export const removeFavorite = async (businessId: number) => {
  const { data } = await api.delete(`/favorites/${businessId}`);
  return data;
};

export const checkFavorite = async (businessId: number): Promise<boolean> => {
  const { data} = await api.get(`/favorites/check/${businessId}`);
  return data.data.isFavorited;
};

// Business Owner API functions
export const businessOwnerAuth = {
  signup: async (email: string, password: string, firstName: string, lastName: string) => {
    const { data } = await api.post('/auth/business-owner/signup', { email, password, firstName, lastName });
    return data;
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/business-owner/login', { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get('/auth/business-owner/me');
    return data;
  },
  logout: async () => {
    const { data } = await api.post('/auth/business-owner/logout');
    return data;
  },
};

export const businessOwner = {
  claimBusiness: async (claimData: {
    businessId: number;
    ownerName: string;
    ownerEmail: string;
    verificationMessage?: string;
  }) => {
    const { data } = await api.post('/owner/claim-business', claimData);
    return data;
  },
  createBusiness: async (businessData: {
    name: string;
    cityId: number;
    categoryId: number;
    subcategoryId?: number;
    instagramHandle?: string;
    description: string;
    email?: string;
    phone?: string;
  }) => {
    const { data } = await api.post('/owner/create-business', businessData);
    return data;
  },
  getMyBusinesses: async () => {
    const { data } = await api.get('/owner/my-businesses');
    return data;
  },
  getMyBusiness: async (id: number) => {
    const { data } = await api.get(`/owner/businesses/${id}`);
    return data;
  },
  updateBusiness: async (id: number, updateData: {
    name?: string;
    cityId?: number;
    description?: string;
    instagramHandle?: string;
    categoryId?: number;
    subcategoryId?: number;
    email?: string;
    phone?: string;
  }) => {
    const { data } = await api.put(`/owner/businesses/${id}`, updateData);
    return data;
  },
  searchBusinesses: async (name: string, cityId?: number) => {
    const { data } = await api.get('/owner/search-businesses', {
      params: { name, cityId },
    });
    return data;
  },
};

// Admin Approval API functions
export const adminApprovals = {
  getApprovals: async (status: string = 'pending', limit: number = 10, offset: number = 0) => {
    const { data } = await api.get('/admin/approvals', {
      params: { status, limit, offset },
    });
    return data;
  },
  getApprovalDetails: async (id: string) => {
    const { data } = await api.get(`/admin/approvals/${id}`);
    return data;
  },
  approve: async (id: string, notes?: string) => {
    const { data } = await api.post(`/admin/approvals/${id}/approve`, { notes });
    return data;
  },
  reject: async (id: string, notes: string) => {
    const { data } = await api.post(`/admin/approvals/${id}/reject`, { notes });
    return data;
  },
};
