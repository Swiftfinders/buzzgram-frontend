import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAdminStats, getAllUsers, getGeneralQuotes, getAllBusinessQuotes, getBusinesses, deleteBusiness, updateBusinessStatus, deleteUser, updateUserStatus, getBusinessClaims, approveBusinessClaim, rejectBusinessClaim } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showBusinesses, setShowBusinesses] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  const [showClaims, setShowClaims] = useState(false);
  const [businessSearch, setBusinessSearch] = useState('');
  const [deletingBusinessId, setDeletingBusinessId] = useState<number | null>(null);
  const [togglingBusinessId, setTogglingBusinessId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [processingClaimId, setProcessingClaimId] = useState<number | null>(null);

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

  const { data: businessClaims } = useQuery({
    queryKey: ['businessClaims'],
    queryFn: getBusinessClaims,
    enabled: showClaims,
  });

  // Search businesses query - only fetch when search is not empty
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['businessSearch', businessSearch],
    queryFn: () => getBusinesses({ search: businessSearch }),
    enabled: showBusinesses && businessSearch.length >= 2,
  });

  // Delete business mutation
  const deleteBusinessMutation = useMutation({
    mutationFn: deleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['businessSearch'] });
      setDeletingBusinessId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete business');
      setDeletingBusinessId(null);
    },
  });

  // Toggle business status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ businessId, status }: { businessId: number; status: string }) =>
      updateBusinessStatus(businessId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['businessSearch'] });
      setTogglingBusinessId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update business status');
      setTogglingBusinessId(null);
    },
  });

  const handleDeleteBusiness = (businessId: number, businessName: string) => {
    if (window.confirm(`Are you sure you want to delete "${businessName}"? This action cannot be undone.`)) {
      setDeletingBusinessId(businessId);
      deleteBusinessMutation.mutate(businessId);
    }
  };

  const handleToggleStatus = (businessId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    setTogglingBusinessId(businessId);
    toggleStatusMutation.mutate({ businessId, status: newStatus });
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setDeletingUserId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete user');
      setDeletingUserId(null);
    },
  });

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: string }) =>
      updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setTogglingUserId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update user status');
      setTogglingUserId(null);
    },
  });

  const handleDeleteUser = (userId: number, userName: string, userEmail: string) => {
    if (window.confirm(`Are you sure you want to delete "${userName}" (${userEmail})? This action cannot be undone.`)) {
      setDeletingUserId(userId);
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleUserStatus = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    setTogglingUserId(userId);
    toggleUserStatusMutation.mutate({ userId, status: newStatus });
  };

  // Approve claim mutation
  const approveClaimMutation = useMutation({
    mutationFn: approveBusinessClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessClaims'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setProcessingClaimId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to approve claim');
      setProcessingClaimId(null);
    },
  });

  // Reject claim mutation
  const rejectClaimMutation = useMutation({
    mutationFn: rejectBusinessClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessClaims'] });
      setProcessingClaimId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to reject claim');
      setProcessingClaimId(null);
    },
  });

  const handleApproveClaim = (claimId: number, businessName: string) => {
    if (window.confirm(`Approve claim for "${businessName}"? This will link the business to the claiming user.`)) {
      setProcessingClaimId(claimId);
      approveClaimMutation.mutate(claimId);
    }
  };

  const handleRejectClaim = (claimId: number, businessName: string) => {
    if (window.confirm(`Reject claim for "${businessName}"? The user will be notified.`)) {
      setProcessingClaimId(claimId);
      rejectClaimMutation.mutate(claimId);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <button
            onClick={() => setShowClaims(!showClaims)}
            className="w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Business Claims</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {businessClaims?.filter((c: any) => c.status === 'pending').length || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Pending review
                  </p>
                </div>
              </div>
              <svg className={`w-5 h-5 text-gray-400 transition-transform ${showClaims ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Expandable Businesses Breakdown */}
        {showBusinesses && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

            {/* Search Bar */}
            <div className="border-t border-gray-200 dark:border-dark-border pt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Search & Manage Businesses
              </h4>
              <div className="relative">
                <input
                  type="text"
                  value={businessSearch}
                  onChange={(e) => setBusinessSearch(e.target.value)}
                  placeholder="Search for a business by name..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Search Results */}
              {businessSearch.length >= 2 && (
                <div className="mt-4">
                  {isSearching ? (
                    <div className="text-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Found {searchResults.length} business{searchResults.length !== 1 ? 'es' : ''}
                      </p>
                      {searchResults.map((business: any) => (
                        <div
                          key={business.id}
                          className="p-4 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                {business.name}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {business.city?.name} • {business.category?.name}
                              </p>
                              {business.status && (
                                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                                  business.status === 'active'
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                    : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                                }`}>
                                  {business.status}
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 ml-4">
                              {/* Pause/Unpause Button */}
                              <button
                                onClick={() => handleToggleStatus(business.id, business.status || 'active')}
                                disabled={togglingBusinessId === business.id}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  business.status === 'active'
                                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                                    : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                title={business.status === 'active' ? 'Pause business' : 'Activate business'}
                              >
                                {togglingBusinessId === business.id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                ) : business.status === 'active' ? (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteBusiness(business.id, business.name)}
                                disabled={deletingBusinessId === business.id}
                                className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete business"
                              >
                                {deletingBusinessId === business.id ? (
                                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No businesses found matching "{businessSearch}"
                    </p>
                  )}
                </div>
              )}

              {businessSearch.length > 0 && businessSearch.length < 2 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Type at least 2 characters to search...
                </p>
              )}
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
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
                            : user.role === 'business_owner'
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                        }`}>
                          {user.role === 'business_owner' ? 'Business Owner' : user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {/* Pause/Unpause Button */}
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.status || 'active')}
                            disabled={togglingUserId === user.id || user.role === 'admin'}
                            className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                              user.status === 'active'
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                                : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={user.role === 'admin' ? 'Cannot pause admin users' : (user.status === 'active' ? 'Pause user' : 'Activate user')}
                          >
                            {togglingUserId === user.id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : user.status === 'active' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name, user.email)}
                            disabled={deletingUserId === user.id || user.role === 'admin'}
                            className="p-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                          >
                            {deletingUserId === user.id ? (
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
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

        {/* Expandable Business Claims */}
        {showClaims && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Business Claims ({businessClaims?.length || 0})
            </h3>

            {businessClaims && businessClaims.length > 0 ? (
              <div className="space-y-4">
                {businessClaims.map((claim: any) => (
                  <div
                    key={claim.id}
                    className={`p-5 rounded-lg border-2 ${
                      claim.status === 'pending'
                        ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10'
                        : claim.status === 'approved'
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {claim.business?.name || 'Unknown Business'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {claim.business?.city?.name} • {claim.business?.category?.name}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          claim.status === 'pending'
                            ? 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                            : claim.status === 'approved'
                            ? 'bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-red-200 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="bg-white dark:bg-dark-bg rounded p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Claimant</p>
                        <p className="font-medium text-gray-900 dark:text-white">{claim.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.phone}</p>
                      </div>

                      <div className="bg-white dark:bg-dark-bg rounded p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User Account</p>
                        <p className="font-medium text-gray-900 dark:text-white">{claim.user?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{claim.user?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>Submitted: {new Date(claim.createdAt).toLocaleString()}</span>
                      {claim.status !== 'pending' && claim.reviewedAt && (
                        <span>
                          {claim.status === 'approved' ? 'Approved' : 'Rejected'}: {new Date(claim.reviewedAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {claim.status === 'pending' && (
                      <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-dark-border">
                        <button
                          onClick={() => handleApproveClaim(claim.id, claim.business?.name)}
                          disabled={processingClaimId === claim.id}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processingClaimId === claim.id ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve Claim
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectClaim(claim.id, claim.business?.name)}
                          disabled={processingClaimId === claim.id}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {processingClaimId === claim.id ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject Claim
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {claim.status !== 'pending' && claim.reviewer && (
                      <div className="pt-3 border-t border-gray-200 dark:border-dark-border">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Reviewed by: {claim.reviewer.name} ({claim.reviewer.email})
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Business Claims
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  There are no business claims to review at the moment.
                </p>
              </div>
            )}
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
