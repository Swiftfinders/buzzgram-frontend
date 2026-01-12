import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface GoogleLoginButtonProps {
  userType?: 'customer' | 'business_owner';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({ userType, onSuccess, onError }: GoogleLoginButtonProps) {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Wait for Google API to load
    const checkGoogleLoaded = setInterval(() => {
      if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        clearInterval(checkGoogleLoaded);
        initializeGoogle();
      }
    }, 100);

    // Cleanup after 10 seconds if not loaded
    setTimeout(() => clearInterval(checkGoogleLoaded), 10000);

    return () => clearInterval(checkGoogleLoaded);
  }, []);

  const initializeGoogle = () => {
    if (!window.google || isInitialized) return;

    try {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google button
      if (buttonRef.current) {
        window.google.accounts.id.renderButton(
          buttonRef.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            width: buttonRef.current.offsetWidth,
            logo_alignment: 'left',
          }
        );
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      if (onError) {
        onError('Failed to load Google Sign-In. Please refresh the page.');
      }
    }
  };

  const handleCredentialResponse = async (response: any) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await googleLogin(response.credential, userType);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Google authentication failed';
      if (onError) {
        onError(errorMessage);
      } else {
        console.error('Google auth error:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Google button container */}
      <div
        ref={buttonRef}
        className="w-full"
        style={{ minHeight: '44px' }}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-dark-card bg-opacity-75 dark:bg-opacity-75 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Fallback if Google doesn't load */}
      {!isInitialized && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Loading Google Sign-In...
        </div>
      )}
    </div>
  );
}
