import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import UserDropdown from './UserDropdown';
import CitySelector from './CitySelector';
import GeneralQuoteModal from './GeneralQuoteModal';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
    <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="group">
              <div className="flex items-center space-x-2">
                {/* Modern Text Logo */}
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-gray-900 dark:text-white">Buzz</span>
                  <span className="text-orange-500">Gram</span>
                </h1>
                {/* Accent Mark */}
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 tracking-wide">
                Discover Local Businesses
              </p>
            </Link>

            {/* City Selector */}
            <CitySelector />
          </div>

          <div className="flex items-center space-x-3">
            {/* Get Quote Button - Visible to everyone */}
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              Get Quote
            </button>

            {user ? (
              <>
                {/* User Dropdown */}
                <UserDropdown />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* General Quote Modal - Outside header for proper z-index */}
    <GeneralQuoteModal
      isOpen={isQuoteModalOpen}
      onClose={() => setIsQuoteModalOpen(false)}
    />
    </>
  );
}
