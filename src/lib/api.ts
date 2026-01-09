import axios from 'axios';
import type { City, Category, Subcategory, Business, BusinessSearchParams, GeneralQuote } from '../types';

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

// Quote Requests
export const submitQuoteRequest = async (quoteData: {
  businessId: number;
  name: string;
  email: string;
  phone?: string;
  categoryId: number;
  subcategoryId?: number;
  availability: string;
  message?: string;
}) => {
  const { data } = await api.post('/quote-requests', quoteData);
  return data;
};

// General Quotes (Admin only)
export const getGeneralQuotes = async (): Promise<GeneralQuote[]> => {
  const { data } = await api.get<{ success: boolean; data: GeneralQuote[] }>('/general-quotes');
  return data.data;
};

// Get current user's all quotes (general + business)
export const getMyQuotes = async () => {
  const { data } = await api.get('/general-quotes/my-quotes');
  return data.data;
};

// Delete a general quote
export const deleteGeneralQuote = async (quoteId: number) => {
  const { data } = await api.delete(`/general-quotes/${quoteId}`);
  return data;
};

// Delete a business quote
export const deleteBusinessQuote = async (quoteId: number) => {
  const { data } = await api.delete(`/quote-requests/${quoteId}`);
  return data;
};

// Admin: Get dashboard statistics
export const getAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data;
};

// Admin: Get all users
export const getAllUsers = async () => {
  const { data } = await api.get('/admin/users');
  return data.data;
};

// Admin: Get all business quote requests
export const getAllBusinessQuotes = async () => {
  const { data } = await api.get('/quote-requests');
  return data.data;
};

// Admin: Delete a business
export const deleteBusiness = async (businessId: number) => {
  const { data } = await api.delete(`/admin/businesses/${businessId}`);
  return data;
};

// Admin: Update business status (pause/unpause)
export const updateBusinessStatus = async (businessId: number, status: string) => {
  const { data } = await api.put(`/admin/businesses/${businessId}`, { status });
  return data;
};

// Admin: Delete a user
export const deleteUser = async (userId: number) => {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
};

// Admin: Update user status (pause/unpause)
export const updateUserStatus = async (userId: number, status: string) => {
  const { data } = await api.put(`/admin/users/${userId}/status`, { status });
  return data;
};

// Business Claims
export const submitBusinessClaim = async (claimData: {
  businessId: number;
  name: string;
  email: string;
  phone: string;
}) => {
  const { data } = await api.post('/business-claims', claimData);
  return data;
};

// Admin: Get all business claims
export const getBusinessClaims = async () => {
  const { data } = await api.get('/business-claims/admin/claims');
  return data.data;
};

// Admin: Approve business claim
export const approveBusinessClaim = async (claimId: number) => {
  const { data } = await api.put(`/business-claims/admin/claims/${claimId}/approve`);
  return data;
};

// Admin: Reject business claim
export const rejectBusinessClaim = async (claimId: number) => {
  const { data } = await api.put(`/business-claims/admin/claims/${claimId}/reject`);
  return data;
};

// Business Owner: Get owned businesses
export const getOwnedBusinesses = async () => {
  const { data } = await api.get('/owner/businesses');
  return data.data;
};

// User: Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
  return data;
};

// User: Delete own account
export const deleteOwnAccount = async (password: string) => {
  const { data } = await api.delete('/auth/delete-account', { data: { password } });
  return data;
};
