import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBusinessOwner } from '../hooks/useBusinessOwner';
import { businessOwner, getCities } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function BusinessOwnerClaim() {
  const navigate = useNavigate();
  const { owner } = useBusinessOwner();
  const [searchName, setSearchName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [claimForm, setClaimForm] = useState({
    ownerName: `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim(),
    ownerEmail: owner?.email || '',
    verificationMessage: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleSearch = async () => {
    if (!searchName.trim()) {
      setError('Please enter a business name');
      return;
    }

    setSearching(true);
    setError('');

    try {
      const result = await businessOwner.searchBusinesses(searchName, selectedCityId || undefined);
      setSearchResults(result.data || []);
      if (result.data.length === 0) {
        setError('No businesses found. Try a different search or create a new business instead.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleClaimSubmit = async () => {
    if (!selectedBusiness) return;

    setSubmitting(true);
    setError('');

    try {
      await businessOwner.claimBusiness({
        businessId: selectedBusiness.id,
        ownerName: claimForm.ownerName,
        ownerEmail: claimForm.ownerEmail,
        verificationMessage: claimForm.verificationMessage,
      });

      // Success - redirect to dashboard
      navigate('/business-owner/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Claim submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cities) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Claim Your Business</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Search for your business and submit a claim request
          </p>
        </div>

        {/* Search Section */}
        {!selectedBusiness && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search for Your Business</h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter business name..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City (Optional)
                </label>
                <select
                  value={selectedCityId || ''}
                  onChange={(e) => setSelectedCityId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSearch}
                disabled={searching}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!selectedBusiness && searchResults.length > 0 && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map(business => (
                <div key={business.id} className="border border-gray-200 dark:border-dark-border rounded-lg p-4 hover:border-orange-500 dark:hover:border-orange-500 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {business.city?.name} • {business.category?.icon} {business.category?.name}
                        {business.subcategory && ` → ${business.subcategory.name}`}
                      </p>
                      {business.instagramHandle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {business.instagramHandle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedBusiness(business)}
                      className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      Claim This Business
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claim Form Modal */}
        {selectedBusiness && (
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Claim Business</h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Selected Business Info */}
            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedBusiness.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedBusiness.city?.name} • {selectedBusiness.category?.icon} {selectedBusiness.category?.name}
                {selectedBusiness.subcategory && ` → ${selectedBusiness.subcategory.name}`}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={claimForm.ownerName}
                  onChange={(e) => setClaimForm({ ...claimForm, ownerName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={claimForm.ownerEmail}
                  onChange={(e) => setClaimForm({ ...claimForm, ownerEmail: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Why do you own this business? (Optional)
                </label>
                <textarea
                  value={claimForm.verificationMessage}
                  onChange={(e) => setClaimForm({ ...claimForm, verificationMessage: e.target.value })}
                  rows={4}
                  placeholder="Provide any information that helps verify your ownership..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBusiness(null)}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClaimSubmit}
                disabled={submitting || !claimForm.ownerName || !claimForm.ownerEmail}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
