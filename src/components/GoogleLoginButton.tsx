import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface GoogleLoginButtonProps {
  userType?: 'customer' | 'business_owner';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleLoginButton({ userType, onSuccess, onError }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();

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
      const result = await googleAuth(response.credential, userType);

      // Store token
      localStorage.setItem('token', result.data.token);

      // Update auth context
      setUser(result.data.user);
      setIsAuthenticated(true);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        // Default navigation
        if (result.data.user.role === 'admin') {
          navigate('/admin');
        } else if (result.data.user.role === 'business_owner') {
          navigate('/business-dashboard');
        } else {
          navigate('/');
        }
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
