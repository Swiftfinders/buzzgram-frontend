import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAdminStats, getAllUsers, getGeneralQuotes, getAllBusinessQuotes } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [showBusinesses, setShowBusinesses] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: getAdminStats,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });

  const { data: users } = useQuery({
    queryKey: ['allUsers'],
    queryFn: getAllUsers,
    enabled: showUsers,
  });

  const { data: generalQuotes } = useQuery({
    queryKey: ['allGeneralQuotes'],
    queryFn: getGeneralQuotes,
    enabled: showQuotes,
  });

  const { data: businessQuotes } = useQuery({
    queryKey: ['allBusinessQuotes'],
    queryFn: getAllBusinessQuotes,
    enabled: showQuotes,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowBusinesses(!showBusinesses)}
            className="w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Businesses</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalBusinesses || 0}</p>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showBusinesses ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setShowUsers(!showUsers)}
            className="w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showUsers ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setShowQuotes(!showQuotes)}
            className="w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 hover:border-green-500 dark:hover:border-green-500 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quotes Received</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats?.totalQuotes || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stats?.generalQuotes || 0} general · {stats?.businessQuotes || 0} business
                  </p>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showQuotes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Expandable Businesses Breakdown */}
        {showBusinesses && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* By City */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">By City</h4>
                <div className="space-y-2">
                  {stats?.businessesByCity?.map((item: any) => (
                    <div key={item.cityId} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-dark-bg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.cityName}</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* By Category */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">By Category</h4>
                <div className="space-y-2">
                  {stats?.businessesByCategory?.map((item: any) => (
                    <div key={item.categoryId} className="flex justify-between items-center p-2 rounded bg-gray-50 dark:bg-dark-bg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item.categoryName}</span>
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expandable Users List */}
        {showUsers && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Users ({users?.length || 0})
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                  {users?.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expandable Quotes List */}
        {showQuotes && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              All Quote Requests
            </h3>

            {/* General Quotes */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                General Quotes ({generalQuotes?.length || 0})
              </h4>
              <div className="space-y-3">
                {generalQuotes?.map((quote: any) => (
                  <div key={quote.id} className="p-4 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{quote.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{quote.email}</p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {quote.message && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{quote.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Quotes */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Business-Specific Quotes ({businessQuotes?.length || 0})
              </h4>
              <div className="space-y-3">
                {businessQuotes?.map((quote: any) => (
                  <div key={quote.id} className="p-4 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{quote.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{quote.email}</p>
                        {quote.business && (
                          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                            For: {quote.business.name}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {quote.message && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{quote.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Add New Business</span>
            </Link>

            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">Manage Users</span>
            </Link>

            <Link
              to="/"
              className="flex items-center p-4 border border-gray-200 dark:border-dark-border rounded-lg hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">View Admin Logs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
