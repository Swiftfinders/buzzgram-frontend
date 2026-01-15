import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import BusinessDetail from './pages/BusinessDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import BusinessOwnerDashboard from './pages/BusinessOwnerDashboard';
import EditBusinessPage from './pages/EditBusinessPage';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import QuoteLandingPage from './pages/QuoteLandingPage';
import BusinessSignupPage from './pages/BusinessSignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ClaimBusinessPage from './pages/ClaimBusinessPage';
import BlogListingPage from './pages/BlogListingPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/city/:cityId" element={<CityPage />} />
                  <Route path="/business/:id" element={<BusinessDetail />} />
                  <Route path="/blog" element={<BlogListingPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/quote" element={<QuoteLandingPage />} />
                  <Route path="/business-signup" element={<BusinessSignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-email" element={<EmailVerificationPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/business-dashboard"
                    element={
                      <ProtectedRoute requireBusinessOwner>
                        <BusinessOwnerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-business"
                    element={
                      <ProtectedRoute requireBusinessOwner>
                        <EditBusinessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/claim-business"
                    element={
                      <ProtectedRoute>
                        <ClaimBusinessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
