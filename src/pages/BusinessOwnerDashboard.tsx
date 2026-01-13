import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOwnedBusinesses, getMyQuoteRequests } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BusinessOwnerDashboard() {
  const { user } = useAuth();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['ownedBusinesses'],
    queryFn: getOwnedBusinesses,
  });

  const { data: quoteRequests } = useQuery({
    queryKey: ['myQuoteRequests'],
    queryFn: getMyQuoteRequests,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const hasBusinesses = businesses && businesses.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Business Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>

        {hasBusinesses ? (
          /* Show Businesses */
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Businesses</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{businesses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">-</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quote Requests</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{quoteRequests?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Cards */}
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Businesses
              </h2>
              <div className="space-y-4">
                {businesses.map((business: any) => (
                  <div
                    key={business.id}
                    className="border border-gray-200 dark:border-dark-border rounded-lg p-6 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {business.city?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {business.category?.name}
                          </span>
                          {business.status && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                business.status === 'active'
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                              }`}
                            >
                              {business.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {business.description && (
                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {business.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/edit-business"
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Edit Business
                      </Link>
                      <Link
                        to={`/business/${business.id}`}
                        className="px-4 py-2 border border-gray-300 dark:border-dark-border hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                      >
                        View Listing
                      </Link>
                      {business.instagramUrl && (
                        <a
                          href={business.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-gray-300 dark:border-dark-border hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                      {business.website && (
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-gray-300 dark:border-dark-border hover:border-orange-500 dark:hover:border-orange-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Requests Section */}
            {quoteRequests && quoteRequests.length > 0 && (
              <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Quote Requests
                </h2>
                <div className="space-y-4">
                  {quoteRequests.map((quote: any) => (
                    <div
                      key={quote.id}
                      className="border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:border-orange-500 dark:hover:border-orange-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {quote.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            For: <span className="font-medium text-gray-900 dark:text-white">{quote.business.name}</span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                              : quote.status === 'viewed'
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <a href={`mailto:${quote.email}`} className="ml-2 text-orange-600 dark:text-orange-400 hover:underline">
                            {quote.email}
                          </a>
                        </div>
                        {quote.phone && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                            <a href={`tel:${quote.phone}`} className="ml-2 text-orange-600 dark:text-orange-400 hover:underline">
                              {quote.phone}
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Category:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {quote.category.name}
                            {quote.subcategory && ` • ${quote.subcategory.name}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {quote.message && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Message:</p>
                          <p className="text-sm text-gray-900 dark:text-white">{quote.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Show "No Business Linked Yet" */
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Business Linked Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                You're signed in as a business owner, but you don't have a business linked to your account yet.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                To start using your dashboard, you need to either:
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Option 1: Claim Existing Business */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3">
                  Option 1: Claim an Existing Business
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If your business is already listed on BuzzGram, claim it to get access to your dashboard and start managing reviews and quote requests.
                </p>
                <Link
                  to="/claim-business"
                  className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  Search for Your Business
                </Link>
              </div>

              {/* Option 2: Register Business */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3">
                  Option 2: Register Your Business
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  If your business isn't listed on BuzzGram yet, register it now and our team will review it.
                </p>
                <Link
                  to="/business-signup"
                  className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  Register Business
                </Link>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200 dark:border-dark-border">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
