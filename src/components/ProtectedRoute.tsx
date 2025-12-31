import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBusinessOwner } from '../hooks/useBusinessOwner';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireBusinessOwner?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requireBusinessOwner = false,
}: ProtectedRouteProps) {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { owner, loading: businessOwnerLoading, isAuthenticated: isBusinessOwnerAuthenticated } = useBusinessOwner();

  // For business owner routes
  if (requireBusinessOwner) {
    if (businessOwnerLoading) {
      return <LoadingSpinner />;
    }

    if (!isBusinessOwnerAuthenticated || !owner) {
      return <Navigate to="/business-owner/login" replace />;
    }

    return <>{children}</>;
  }

  // For admin and regular user routes
  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
