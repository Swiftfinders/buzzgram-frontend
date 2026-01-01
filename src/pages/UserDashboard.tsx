import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { getFavorites, getMyQuotes } from '../lib/api';
import BusinessCard from '../components/BusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UserDashboard() {
  const { user } = useAuth();

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    enabled: !!user,
  });

  const { data: myQuotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['myQuotes'],
    queryFn: getMyQuotes,
    enabled: !!user,
  });

  if (favoritesLoading || quotesLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Favorites</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{favorites?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quote Requests</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{myQuotes?.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cities Explored</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote History Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quote History
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {myQuotes?.total || 0} total quotes
            </div>
          </div>

          {myQuotes && myQuotes.quotes && myQuotes.quotes.length > 0 ? (
            <div className="space-y-4">
              {myQuotes.quotes.map((quote: any) => (
                <div
                  key={`${quote.type}-${quote.id}`}
                  className="border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        quote.type === 'general'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                      }`}>
                        {quote.type === 'general' ? 'General Quote' : 'Business Quote'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        quote.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                          : quote.status === 'viewed'
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                      }`}>
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {quote.businessName && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Business:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.businessName}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.category?.name}</span>
                    </div>
                    {quote.subcategory && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Subcategory:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.subcategory.name}</span>
                      </div>
                    )}
                    {quote.budget && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Budget:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.budget}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Contact:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.email}</span>
                    </div>
                    {quote.phone && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{quote.phone}</span>
                      </div>
                    )}
                  </div>

                  {quote.message && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                      <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Message:</span>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{quote.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No quote requests yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Submit a quote request to get started
              </p>
            </div>
          )}
        </div>

        {/* Saved Favorites Section */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Saved Favorites
            </h2>
            <Link
              to="/"
              className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Browse Businesses
            </Link>
          </div>

          {favorites && favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite: any) => (
                <BusinessCard key={favorite.id} business={favorite.business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No favorites yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Start exploring and save your favorite businesses
              </p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Explore Businesses
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Discover Businesses</span>
            </Link>

            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Browse by City</span>
            </Link>

            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Browse by Category</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
