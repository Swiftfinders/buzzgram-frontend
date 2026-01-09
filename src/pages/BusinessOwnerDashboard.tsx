import { Link } from 'react-router-dom';

export default function BusinessOwnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Business Dashboard
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 sm:p-12">
          {/* No Business Linked Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Business Linked Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              You're signed in as a business owner, but you don't have a business linked to your account yet.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To start using your dashboard, you need to either:
            </p>
          </div>

          {/* Options */}
          <div className="space-y-6 mb-8">
            {/* Option 1: Claim Existing Business */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-dark-border">
              <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3">
                Option 1: Claim an Existing Business
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If your business is already listed on BuzzGram, claim it to get access to your dashboard and start managing reviews and quote requests.
              </p>
              <Link
                to="/claim-business"
                className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                Search for Your Business
              </Link>
            </div>

            {/* Option 2: Register Business */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-dark-border">
              <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-3">
                Option 2: Register Your Business
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If your business isn't listed on BuzzGram yet, register it now and our team will review it.
              </p>
              <Link
                to="/business-signup"
                className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
              >
                Register Business
              </Link>
            </div>
          </div>

          {/* Go Back Link */}
          <div className="text-center pt-6 border-t border-gray-200 dark:border-dark-border">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
