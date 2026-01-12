import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the hash fragment for ID token (implicit flow)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const idToken = params.get('id_token');
        const state = params.get('state');

        if (!idToken) {
          throw new Error('No ID token received from Google');
        }

        // Parse state to get userType
        let userType: 'customer' | 'business_owner' | undefined;
        if (state) {
          try {
            const stateData = JSON.parse(decodeURIComponent(state));
            userType = stateData.userType;
          } catch (e) {
            // State parsing failed, continue without userType
          }
        }

        // Authenticate with backend
        await googleLogin(idToken, userType);

        // Redirect to home
        navigate('/');
      } catch (err: any) {
        console.error('Google callback error:', err);
        setError(err.message || 'Authentication failed');
      }
    };

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
        <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Authentication Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing Google Sign-In...
        </p>
      </div>
    </div>
  );
}
