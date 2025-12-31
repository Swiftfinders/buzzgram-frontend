import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBusinessOwner } from '../hooks/useBusinessOwner';
import { businessOwner, getCities, getCategories } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface FormData {
  name: string;
  cityId: number | null;
  categoryId: number | null;
  subcategoryId: number | null;
  instagramHandle: string;
  description: string;
  email: string;
  phone: string;
}

export default function BusinessOwnerEdit() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { myBusinesses, refreshMyBusinesses } = useBusinessOwner();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cityId: null,
    categoryId: null,
    subcategoryId: null,
    instagramHandle: '',
    description: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const business = myBusinesses.find(b => b.id === parseInt(businessId || ''));

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const selectedCategory = categories?.find(c => c.id === formData.categoryId);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name,
        cityId: business.cityId,
        categoryId: business.categoryId,
        subcategoryId: business.subcategoryId || null,
        instagramHandle: business.instagramHandle || '',
        description: business.description || '',
        email: business.email || '',
        phone: business.phone || '',
      });
    }
  }, [business]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    setSuccess(false);
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData({ ...formData, categoryId, subcategoryId: null });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.cityId) {
      setError('Please select a city');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    if (formData.instagramHandle && !formData.instagramHandle.match(/^@?[\w.]+$/)) {
      setError('Invalid Instagram handle format');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Business description is required');
      return false;
    }
    if (formData.description.length < 50) {
      setError('Description must be at least 50 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      await businessOwner.updateBusiness(parseInt(businessId!), {
        name: formData.name,
        cityId: formData.cityId!,
        categoryId: formData.categoryId!,
        subcategoryId: formData.subcategoryId || undefined,
        instagramHandle: formData.instagramHandle || undefined,
        description: formData.description,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
      });

      await refreshMyBusinesses();
      setSuccess(true);

      setTimeout(() => {
        navigate('/business-owner/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Business not found or you don't have permission to edit it.</p>
            <button
              onClick={() => navigate('/business-owner/dashboard')}
              className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cities || !categories) return <LoadingSpinner />;

  const isRejected = business.status === 'rejected';
  const isPending = business.status === 'pending' || business.status === 'claimed_pending';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/business-owner/dashboard')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isRejected ? 'Edit & Resubmit Business' : 'Edit Business'}
            </h1>
          </div>
          <p className="ml-9 text-gray-600 dark:text-gray-300">
            {isRejected && 'Make changes based on feedback and resubmit for approval'}
            {isPending && 'Your business is pending approval. Changes will require re-review.'}
            {!isRejected && !isPending && 'Update your business information'}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isRejected ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
            isPending ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
            'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          }`}>
            {isRejected && 'Rejected'}
            {isPending && 'Under Review'}
            {!isRejected && !isPending && 'Active'}
          </span>
        </div>

        {/* Rejection Feedback */}
        {isRejected && business.approvalNotes && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-red-900 dark:text-red-300 mb-1">Admin Feedback:</p>
            <p className="text-sm text-red-700 dark:text-red-400">{business.approvalNotes}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
            Business updated successfully! Redirecting to dashboard...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Business Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <select
                value={formData.cityId || ''}
                onChange={(e) => handleInputChange('cityId', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => handleCategoryChange(e.target.value ? parseInt(e.target.value) : 0)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory (Optional)
                </label>
                <select
                  value={formData.subcategoryId || ''}
                  onChange={(e) => handleInputChange('subcategoryId', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategory.subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instagram Handle (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">@</span>
                <input
                  type="text"
                  value={formData.instagramHandle.replace('@', '')}
                  onChange={(e) => handleInputChange('instagramHandle', e.target.value.replace('@', ''))}
                  placeholder="yourbusiness"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                required
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Minimum 50 characters
                </p>
                <p className={`text-sm ${
                  formData.description.length < 50
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {formData.description.length} / 50
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/business-owner/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isRejected ? 'Resubmit for Approval' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
