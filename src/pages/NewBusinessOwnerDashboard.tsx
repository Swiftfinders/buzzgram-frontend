import { Link } from 'react-router-dom';
import { useBusinessOwner } from '../hooks/useBusinessOwner';

export default function NewBusinessOwnerDashboard() {
  const { owner, myBusinesses, logout } = useBusinessOwner();

  const pendingBusinesses = myBusinesses.filter(b => b.status === 'pending' || b.status === 'claimed_pending');
  const activeBusinesses = myBusinesses.filter(b => b.status === 'active');
  const rejectedBusinesses = myBusinesses.filter(b => b.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Businesses Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Welcome back, {owner?.firstName || owner?.email}!
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Logout
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/business-owner/claim"
            className="flex items-center justify-center gap-3 bg-white dark:bg-dark-card border-2 border-orange-500 rounded-xl p-6 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Claim Business</span>
          </Link>

          <Link
            to="/business-owner/create"
            className="flex items-center justify-center gap-3 bg-orange-500 rounded-xl p-6 hover:bg-orange-600 transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg font-semibold text-white">Create New Business</span>
          </Link>
        </div>

        {/* Pending Approvals Section */}
        {pendingBusinesses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pending Approvals</h2>
            <div className="grid grid-cols-1 gap-4">
              {pendingBusinesses.map(business => (
                <div key={business.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {business.city?.name} • {business.category?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Submitted: {new Date(business.createdAt).toLocaleDateString()} at {new Date(business.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                      Under Review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Businesses Section */}
        {activeBusinesses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBusinesses.map(business => (
                <div key={business.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {business.city?.name} • {business.category?.icon} {business.category?.name}
                        {business.subcategory && ` → ${business.subcategory.name}`}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Live
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      to={`/city/${business.cityId}/business/${business.id}`}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center text-sm font-medium"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/business-owner/business/${business.id}/edit`}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Businesses Section */}
        {rejectedBusinesses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rejected</h2>
            <div className="grid grid-cols-1 gap-4">
              {rejectedBusinesses.map(business => (
                <div key={business.id} className="bg-white dark:bg-dark-card rounded-xl border border-red-200 dark:border-red-800 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {business.city?.name} • {business.category?.name}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full text-sm font-medium">
                      Rejected
                    </span>
                  </div>
                  {business.approvalNotes && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Feedback:</p>
                      <p className="text-sm text-red-700 dark:text-red-400">{business.approvalNotes}</p>
                    </div>
                  )}
                  <Link
                    to={`/business-owner/business/${business.id}/edit`}
                    className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Edit & Resubmit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myBusinesses.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto w-24 h-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No businesses yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by claiming an existing business or creating a new one</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/business-owner/claim"
                className="px-6 py-3 bg-white dark:bg-dark-card border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors font-medium"
              >
                Claim Business
              </Link>
              <Link
                to="/business-owner/create"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Create New Business
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
