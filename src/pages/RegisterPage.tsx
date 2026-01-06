import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { RegisterInput } from '../types';

export default function RegisterPage() {
  // User type selection (first step)
  const [userType, setUserType] = useState<'customer' | 'business_owner' | ''>('');

  // Form fields
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!userType) {
      setError('Please select whether you are a customer or business owner');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (userType === 'business_owner') {
      if (!businessName) {
        setError('Business name is required for business owners');
        return;
      }
      if (!phone) {
        setError('Phone number is required for business owners');
        return;
      }
    }

    setLoading(true);

    try {
      const registerData: RegisterInput = {
        email,
        password,
        confirmPassword,
        name,
        userType: userType as 'customer' | 'business_owner',
      };

      // Add business owner specific fields
      if (userType === 'business_owner') {
        registerData.businessName = businessName;
        registerData.instagramHandle = instagramHandle || undefined;
        registerData.phone = phone;
      }

      await api.post('/auth/register', registerData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success state - show email verification message
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We've sent a verification link to <strong className="text-gray-900 dark:text-white">{email}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please click the link in the email to verify your account before logging in.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* STEP 1: User Type Selection (FIRST) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              I am... <span className="text-orange-600">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`relative flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all ${
                  userType === 'customer'
                    ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-300 dark:border-dark-border hover:border-orange-400 dark:hover:border-orange-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">👤</div>
                  <span className={`text-sm font-medium ${
                    userType === 'customer'
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Customer
                  </span>
                </div>
                {userType === 'customer' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setUserType('business_owner')}
                className={`relative flex items-center justify-center px-4 py-3 border-2 rounded-lg transition-all ${
                  userType === 'business_owner'
                    ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-300 dark:border-dark-border hover:border-orange-400 dark:hover:border-orange-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💼</div>
                  <span className={`text-sm font-medium ${
                    userType === 'business_owner'
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Business Owner
                  </span>
                </div>
                {userType === 'business_owner' && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Conditional Fields - Only show after user type is selected */}
          {userType && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name <span className="text-orange-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Business Owner Specific Fields */}
              {userType === 'business_owner' && (
                <>
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Business Name <span className="text-orange-600">*</span>
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="My Business Inc."
                    />
                  </div>

                  <div>
                    <label htmlFor="instagramHandle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instagram Handle
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                        @
                      </span>
                      <input
                        id="instagramHandle"
                        name="instagramHandle"
                        type="text"
                        value={instagramHandle}
                        onChange={(e) => setInstagramHandle(e.target.value)}
                        className="appearance-none rounded-lg relative block w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="yourbusiness"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email <span className="text-orange-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Phone (Business Owner Only) */}
              {userType === 'business_owner' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number <span className="text-orange-600">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password <span className="text-orange-600">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password <span className="text-orange-600">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-dark-border placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
