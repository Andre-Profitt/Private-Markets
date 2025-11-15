'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function BuyerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.firstName || user?.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Investor Type</div>
            <div className="mt-2 text-lg font-semibold text-gray-900">
              {user?.investorType === 'INDIVIDUAL' && 'Individual'}
              {user?.investorType === 'FAMILY_OFFICE' && 'Family Office'}
              {user?.investorType === 'FUND' && 'Fund'}
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Accreditation</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Active Commitments</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">0</div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Invested</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">$0</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Opportunities */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Available Opportunities</h2>
              <Link
                href="/deals"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Q4 2024 Liquidity Program</h3>
                <p className="text-sm text-gray-500 mt-1">Acme Corp</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">Min Investment: $25,000</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Open
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* My Commitments */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">My Commitments</h2>
              <Link
                href="/buyer/commitments"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All →
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <p>No active commitments.</p>
              <p className="mt-2">Browse available deals to make your first investment.</p>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="text-sm font-medium text-gray-500">Total Deal Volume</div>
              <div className="mt-1 text-xl font-bold text-gray-900">$5.2M</div>
              <div className="text-xs text-gray-500 mt-1">This Quarter</div>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-sm font-medium text-gray-500">Active Companies</div>
              <div className="mt-1 text-xl font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-500 mt-1">Currently Trading</div>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <div className="text-sm font-medium text-gray-500">Avg. Deal Size</div>
              <div className="mt-1 text-xl font-bold text-gray-900">$250K</div>
              <div className="text-xs text-gray-500 mt-1">Per Investor</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">New deal opened: Acme Corp Q4 2024 Program</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">Your accreditation has been verified</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900">Investment Tips</h3>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Review all deal documents carefully before committing</li>
            <li>Consider diversification across multiple companies and vintages</li>
            <li>Understand the lock-up periods and liquidity constraints</li>
            <li>Consult with your tax and financial advisors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}