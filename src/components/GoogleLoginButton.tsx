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
  const { googleLogin, user } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth,
        text: 'continue_with',
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
