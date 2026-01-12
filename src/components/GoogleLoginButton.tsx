import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface GoogleLoginButtonProps {
  userType?: 'customer' | 'business_owner';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({ userType, onSuccess, onError }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    // Disable auto-select to prevent showing specific account
    window.google.accounts.id.disableAutoSelect();

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth,
        text: 'signin_with',
        shape: 'rectangular',
      });
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      await googleLogin(response.credential, userType);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        // Default navigation based on user role
        // Note: user will be updated after googleLogin completes
        // We need to get the role from somewhere, so let's navigate to home
        // and let the app handle the redirect based on the updated user state
        navigate('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Google authentication failed';
      if (onError) {
        onError(errorMessage);
      } else {
        console.error('Google auth error:', errorMessage);
      }
    }
  };

  return <div ref={googleButtonRef} />;
}
