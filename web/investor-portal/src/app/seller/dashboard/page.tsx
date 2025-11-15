'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function SellerDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.firstName || user?.email}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Company</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{user?.company || 'Not Set'}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Holdings Status</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending Verification
              </span>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Active Deals</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">0</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Holdings */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">My Holdings</h2>
              <Link
                href="/seller/holdings"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Manage →
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <p>No holdings added yet.</p>
              <Link
                href="/seller/holdings/add"
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Holdings
              </Link>
            </div>
          </div>

          {/* Available Deals */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Available Deals</h2>
              <Link
                href="/deals"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View All →
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <p>No active deals available at this time.</p>
              <p className="mt-2">Check back soon for liquidity opportunities.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="border-t border-gray-200">
            <div className="py-4">
              <div className="text-sm text-gray-500">
                <p>Account created - Welcome to the platform!</p>
                <p className="text-xs text-gray-400 mt-1">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900">Next Steps</h3>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Add your share holdings to participate in deals</li>
            <li>Upload proof of ownership documentation</li>
            <li>Wait for admin verification</li>
            <li>Once verified, you can participate in liquidity programs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}