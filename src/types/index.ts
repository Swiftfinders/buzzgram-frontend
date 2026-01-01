export interface City {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  createdAt: string;
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  categoryId: number;
  createdAt: string;
  category?: Category;
}

export interface Business {
  id: number;
  name: string;
  description: string | null;
  cityId: number;
  categoryId: number;
  subcategoryId: number | null;
  instagramHandle: string | null;
  instagramUrl: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  city?: City;
  category?: Category;
  subcategory?: Subcategory;
}

export interface BusinessSearchParams {
  cityId?: number;
  categoryId?: number;
  subcategoryId?: number;
  search?: string;
}
