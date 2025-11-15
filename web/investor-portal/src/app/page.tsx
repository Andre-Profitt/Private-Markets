import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Private Assets Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Invest in private market opportunities. Access exclusive deals, manage your portfolio, and track your investments all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600">
                Bank-level security with full KYC/AML compliance and accreditation verification.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Management</h3>
              <p className="text-gray-600">
                Track your private market investments with real-time portfolio analytics and reporting.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Access</h3>
              <p className="text-gray-600">
                Access pre-IPO companies and private market opportunities not available elsewhere.
              </p>
            </div>
          </div>
        </div>

        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of investors already using our platform.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
