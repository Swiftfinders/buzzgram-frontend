import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { BusinessOwnerProvider } from './contexts/BusinessOwnerContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import BusinessDetail from './pages/BusinessDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import BusinessOwnerDashboard from './pages/BusinessOwnerDashboard';
import UserDashboard from './pages/UserDashboard';
import SettingsPage from './pages/SettingsPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import BusinessOwnerSignup from './pages/BusinessOwnerSignup';
import BusinessOwnerLogin from './pages/BusinessOwnerLogin';
import NewBusinessOwnerDashboard from './pages/NewBusinessOwnerDashboard';
import BusinessOwnerClaim from './pages/BusinessOwnerClaim';
import BusinessOwnerCreate from './pages/BusinessOwnerCreate';
import BusinessOwnerEdit from './pages/BusinessOwnerEdit';
import AdminApprovals from './pages/AdminApprovals';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BusinessOwnerProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/city/:cityId" element={<CityPage />} />
                    <Route path="/business/:id" element={<BusinessDetail />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin/approvals"
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminApprovals />
                        </ProtectedRoute>
                      }
                    />

                    {/* Business Owner Routes */}
                    <Route path="/business-owner/signup" element={<BusinessOwnerSignup />} />
                    <Route path="/business-owner/login" element={<BusinessOwnerLogin />} />
                    <Route
                      path="/business-owner/dashboard"
                      element={
                        <ProtectedRoute requireBusinessOwner>
                          <NewBusinessOwnerDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/business-owner/claim"
                      element={
                        <ProtectedRoute requireBusinessOwner>
                          <BusinessOwnerClaim />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/business-owner/create"
                      element={
                        <ProtectedRoute requireBusinessOwner>
                          <BusinessOwnerCreate />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/business-owner/business/:businessId/edit"
                      element={
                        <ProtectedRoute requireBusinessOwner>
                          <BusinessOwnerEdit />
                        </ProtectedRoute>
                      }
                    />

                    {/* Legacy business dashboard route */}
                    <Route
                      path="/business-dashboard"
                      element={
                        <ProtectedRoute requireBusinessOwner>
                          <BusinessOwnerDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* User Routes */}
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
          </BusinessOwnerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
