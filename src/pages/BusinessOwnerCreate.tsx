import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useBusinessOwner } from '../hooks/useBusinessOwner';
import { businessOwner, getCities, getCategories } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';

type Step = 1 | 2 | 3;

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

export default function BusinessOwnerCreate() {
  const navigate = useNavigate();
  const { refreshMyBusinesses } = useBusinessOwner();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

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

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const selectedCategory = categories?.find(c => c.id === formData.categoryId);
  const selectedSubcategory = selectedCategory?.subcategories?.find(s => s.id === formData.subcategoryId);
  const selectedCity = cities?.find(c => c.id === formData.cityId);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData({ ...formData, categoryId, subcategoryId: null });
    setError('');
  };

  const validateStep1 = () => {
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
    return true;
  };

  const validateStep2 = () => {
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

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
    setError('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      await businessOwner.createBusiness({
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
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (citiesLoading || categoriesLoading) return <LoadingSpinner />;

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Business Submitted for Review!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your business has been submitted and is pending admin approval. We'll notify you once it's reviewed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate('/business-owner/dashboard')}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    name: '',
                    cityId: null,
                    categoryId: null,
                    subcategoryId: null,
                    instagramHandle: '',
                    description: '',
                    email: '',
                    phone: '',
                  });
                }}
                className="px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Business</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Submit a new business for approval
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep >= step
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step === 1 && 'Basic Info'}
                      {step === 2 && 'Details'}
                      {step === 3 && 'Review'}
                    </p>
                  </div>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6 mb-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
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
                >
                  <option value="">Select a city</option>
                  {cities?.map(city => (
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
                >
                  <option value="">Select a category</option>
                  {categories?.map(category => (
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
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Business Details</h2>

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
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter without the @ symbol
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your business, what makes it unique, services offered, etc."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
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
                  placeholder="business@example.com"
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
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Review Your Business</h2>
              </div>

              <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{formData.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCity?.name} • {selectedCategory?.icon} {selectedCategory?.name}
                    {selectedSubcategory && ` → ${selectedSubcategory.name}`}
                  </p>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </div>

                {(formData.instagramHandle || formData.email || formData.phone) && (
                  <div className="border-t border-gray-200 dark:border-dark-border pt-4 space-y-2">
                    {formData.instagramHandle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Instagram:</span> @{formData.instagramHandle}
                      </p>
                    )}
                    {formData.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Email:</span> {formData.email}
                      </p>
                    )}
                    {formData.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Phone:</span> {formData.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Edit Basic Info
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Edit Details
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your business will be reviewed by our admin team. You'll receive an email notification once it's approved.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium"
            >
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
