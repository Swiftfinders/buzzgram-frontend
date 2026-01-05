import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { getCities, getCategories, getSubcategories } from '../lib/api';
import { api } from '../lib/api';

export default function QuoteLandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch data
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: subcategories } = useQuery({
    queryKey: ['subcategories'],
    queryFn: getSubcategories,
  });

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories?.filter(
    (sub) => sub.categoryId === parseInt(selectedCategoryId)
  );

  // Submit quote mutation
  const submitQuoteMutation = useMutation({
    mutationFn: async (quoteData: any) => {
      const { data } = await api.post('/general-quotes', quoteData);
      return data;
    },
    onSuccess: () => {
      setFormSuccess(true);
      setFormError('');
      // Reset form
      setSelectedCategoryId('');
      setSelectedSubcategoryId('');
      setServiceDescription('');
      setBudget('');
      if (!user) {
        setName('');
        setEmail('');
        setPhone('');
      }
      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error: any) => {
      setFormError(error.response?.data?.message || 'Failed to submit quote request. Please try again.');
      setFormSuccess(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedCategoryId || !selectedSubcategoryId) {
      setFormError('Please select both category and subcategory');
      return;
    }

    submitQuoteMutation.mutate({
      categoryId: parseInt(selectedCategoryId),
      subcategoryId: parseInt(selectedSubcategoryId),
      name,
      email,
      phone: phone || undefined,
      message: `${serviceDescription}${budget ? `\n\nBudget: ${budget}` : ''}`,
    });
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryCardClick = (categoryName: string) => {
    const category = categories?.find(c => c.name === categoryName);
    if (category) {
      setSelectedCategoryId(category.id.toString());
      scrollToForm();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Section 1: Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Find Multiple Service Providers <br className="hidden sm:block" />
              <span className="text-[#ff6b35]">in One Quote</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Beauty, Food & Events specialists in your city. Compare quotes and find the perfect fit.
            </p>

            {/* City Selector */}
            <div className="flex justify-center">
              <div className="inline-block">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Your City
                </label>
                <select
                  value={selectedCityId || ''}
                  onChange={(e) => setSelectedCityId(Number(e.target.value))}
                  className="px-6 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent min-w-[200px]"
                >
                  <option value="">Choose a city</option>
                  {cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Category Showcase */}
      <div className="bg-slate-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beauty Card */}
            <button
              onClick={() => handleCategoryCardClick('Beauty')}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#ff6b35]/20 hover:-translate-y-2 transition-all duration-300 text-left group"
            >
              <div className="text-6xl mb-4">💄</div>
              <h3 className="text-2xl font-bold text-[#ff6b35] mb-4">Beauty</h3>
              <p className="text-gray-300 text-sm mb-6">
                Nails • Lashes • Makeup • Hair
              </p>
              <div className="flex items-center text-white group-hover:text-[#ff6b35] transition-colors">
                <span className="font-medium">Get Beauty Quotes</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>

            {/* Food Card */}
            <button
              onClick={() => handleCategoryCardClick('Food')}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#ff6b35]/20 hover:-translate-y-2 transition-all duration-300 text-left group"
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-[#ff6b35] mb-4">Food</h3>
              <p className="text-gray-300 text-sm mb-6">
                Bakery • Catering • Chef
              </p>
              <div className="flex items-center text-white group-hover:text-[#ff6b35] transition-colors">
                <span className="font-medium">Get Food Quotes</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>

            {/* Events Card */}
            <button
              onClick={() => handleCategoryCardClick('Events')}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:shadow-2xl hover:shadow-[#ff6b35]/20 hover:-translate-y-2 transition-all duration-300 text-left group"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#ff6b35] mb-4">Events</h3>
              <p className="text-gray-300 text-sm mb-6">
                Decor • Planning • Photography
              </p>
              <div className="flex items-center text-white group-hover:text-[#ff6b35] transition-colors">
                <span className="font-medium">Get Events Quotes</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Why BuzzGram */}
      <div className="bg-slate-950 py-16 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Why <span className="text-[#ff6b35]">BuzzGram</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">One Form, Multiple Quotes</h3>
              <p className="text-gray-400">
                Fill out one simple form and get responses from multiple service providers in your area.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Compare & Choose</h3>
              <p className="text-gray-400">
                Review quotes, check provider profiles, and choose the best fit for your needs and budget.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Responses</h3>
              <p className="text-gray-400">
                Most providers respond within 24 hours. Get your project started quickly and efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: How It Works */}
      <div className="bg-slate-900 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            How It <span className="text-[#ff6b35]">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                1
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Select Your Service</h3>
              <p className="text-gray-400 text-lg">
                Choose the category and type of service you need from our wide range of options.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                2
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Describe Your Needs</h3>
              <p className="text-gray-400 text-lg">
                Tell us what you're looking for, your timeline, and any specific requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ff6b35] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                3
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Get Quotes</h3>
              <p className="text-gray-400 text-lg">
                Receive quotes from qualified providers and choose the one that's right for you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Quote Form */}
      <div id="quote-form" className="bg-slate-950 py-16 sm:py-20 border-y border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Request Your <span className="text-[#ff6b35]">Quote</span>
          </h2>
          <p className="text-gray-400 text-center mb-10">
            Fill out the form below and we'll connect you with the best service providers in your area.
          </p>

          {formSuccess ? (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
              <p className="text-gray-300 text-lg">
                Your quote request has been submitted. Providers will contact you shortly.
              </p>
              <button
                onClick={() => setFormSuccess(false)}
                className="mt-6 text-[#ff6b35] hover:underline font-medium"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-200">{formError}</p>
                </div>
              )}

              {/* Service Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Service Category <span className="text-[#ff6b35]">*</span>
                </label>
                <select
                  id="category"
                  required
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setSelectedSubcategoryId('');
                  }}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {selectedCategoryId && (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-300 mb-2">
                    Subcategory <span className="text-[#ff6b35]">*</span>
                  </label>
                  <select
                    id="subcategory"
                    required
                    value={selectedSubcategoryId}
                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  >
                    <option value="">Select a subcategory</option>
                    {filteredSubcategories?.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name <span className="text-[#ff6b35]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-[#ff6b35]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Service Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Tell Us What You Need <span className="text-[#ff6b35]">*</span>
                </label>
                <textarea
                  id="description"
                  required
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent resize-none"
                  placeholder="Describe your project, timeline, and any specific requirements..."
                />
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                  Budget (Optional)
                </label>
                <input
                  id="budget"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6b35] focus:border-transparent"
                  placeholder="e.g., $500-$1000"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitQuoteMutation.isPending}
                className="w-full py-4 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitQuoteMutation.isPending ? 'Submitting...' : 'Request Quotes'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Section 6: Social Proof */}
      <div className="bg-slate-950 py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="text-5xl font-bold text-[#ff6b35] mb-2">2,500+</div>
              <p className="text-gray-400 text-lg">Quotes Submitted</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="text-5xl font-bold text-[#ff6b35] mb-2">950+</div>
              <p className="text-gray-400 text-lg">Vetted Providers</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="text-5xl font-bold text-[#ff6b35] mb-2">4.8★</div>
              <p className="text-gray-400 text-lg">Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7: Business Owner CTA */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Are You a <span className="text-[#ff6b35]">Service Provider</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join BuzzGram and connect with customers looking for your services. Create your free business profile today.
          </p>
          <Link
            to="/business-signup"
            className="inline-block px-8 py-4 bg-[#ff6b35] hover:bg-[#ff5722] text-white font-bold text-lg rounded-lg transition-colors"
          >
            List Your Business (Free)
          </Link>
        </div>
      </div>
    </div>
  );
}
