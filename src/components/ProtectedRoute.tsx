import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  const { user, loading, isAdmin, isBusinessOwner } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireBusinessOwner && !isBusinessOwner) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
