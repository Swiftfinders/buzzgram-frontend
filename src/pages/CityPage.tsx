import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBusinesses, getCategories, getCities, getSubcategories } from '../lib/api';
import BusinessCard from '../components/BusinessCard';
import CategoryFilter from '../components/CategoryFilter';
import SubcategoryFilter from '../components/SubcategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CityPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);

  // Get search term from URL params
  const searchTerm = searchParams.get('search') || '';

  useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
    select: (cities) => cities.find((c) => c.id === Number(cityId)),
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: subcategories } = useQuery({
    queryKey: ['subcategories'],
    queryFn: getSubcategories,
  });

  const { data: businesses, isLoading: businessesLoading, error } = useQuery({
    queryKey: ['businesses', cityId],
    queryFn: () => getBusinesses({ cityId: Number(cityId) }),
    enabled: !!cityId,
  });

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  // Filter subcategories based on selected category
  const filteredSubcategories = useMemo(() => {
    if (!subcategories || !selectedCategory) return [];
    return subcategories.filter((subcategory) => subcategory.categoryId === selectedCategory);
  }, [subcategories, selectedCategory]);

  const filteredBusinesses = useMemo(() => {
    if (!businesses) return [];

    return businesses.filter((business) => {
      const matchesCategory = !selectedCategory || business.categoryId === selectedCategory;
      const matchesSubcategory = !selectedSubcategory || business.subcategoryId === selectedSubcategory;
      const matchesSearch =
        !searchTerm ||
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [businesses, selectedCategory, selectedSubcategory, searchTerm]);

  if (businessesLoading || categoriesLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Error Loading Businesses
          </h2>
          <p className="text-red-600 dark:text-red-300">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Filters */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Category Pills */}
            {categories && (
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            )}

            {/* Subcategory Pills */}
            {selectedCategory && filteredSubcategories.length > 0 && (
              <SubcategoryFilter
                subcategories={filteredSubcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={setSelectedSubcategory}
              />
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              No businesses found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {searchTerm || selectedCategory || selectedSubcategory
                ? 'Try adjusting your search or filters'
                : 'No businesses are available in this city yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
