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
  const { data } = await api.get(`/favorites/check/${businessId}`);
  return data.data.isFavorited;
};
