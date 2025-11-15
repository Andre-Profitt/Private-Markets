'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Mock data for now - will be replaced with API calls
  const [stats, setStats] = useState({
    totalUsers: 23,
    totalSellers: 12,
    totalBuyers: 8,
    totalAdmins: 3,
    activeDeals: 1,
    pendingVerifications: 5,
    totalDealVolume: 5200000,
    pendingAllocations: 3,
  });

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      description: 'New seller registered: john.smith@email.com',
      timestamp: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'holding_submitted',
      description: 'Holdings submitted: 10,000 shares (Acme Corp)',
      timestamp: '4 hours ago',
      status: 'pending',
    },
    {
      id: 3,
      type: 'buyer_commitment',
      description: 'Commitment submitted: $250,000',
      timestamp: '5 hours ago',
      status: 'approved',
    },
    {
      id: 4,
      type: 'holding_verified',
      description: 'Holdings verified: sarah.jones@email.com',
      timestamp: '1 day ago',
      status: 'completed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Platform overview and management tools
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Admin Access
              </span>
              <span className="text-sm text-gray-500">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="ml-2 text-xs text-gray-500">
                ({stats.totalSellers} sellers, {stats.totalBuyers} buyers)
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Active Deals</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{stats.activeDeals}</div>
            <Link href="/admin/deals" className="text-xs text-blue-600 hover:text-blue-500">
              Manage →
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Pending Verifications</div>
            <div className="mt-2 text-2xl font-bold text-orange-600">{stats.pendingVerifications}</div>
            <Link href="/admin/holdings" className="text-xs text-blue-600 hover:text-blue-500">
              Review →
            </Link>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Deal Volume</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">
              ${(stats.totalDealVolume / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/holdings"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Verify Holdings</p>
                  <p className="text-xs text-gray-500">{stats.pendingVerifications} pending</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/deals"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Manage Allocations</p>
                  <p className="text-xs text-gray-500">{stats.pendingAllocations} pending</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Manage Users</p>
                  <p className="text-xs text-gray-500">{stats.totalUsers} total</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between border-b pb-4 last:border-b-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {activity.status === 'pending' && (
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    {activity.status === 'approved' && (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {activity.status === 'completed' && (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Data Export</h3>
          <div className="flex space-x-4">
            <button className="text-sm text-blue-700 hover:text-blue-600">
              Export Users CSV
            </button>
            <button className="text-sm text-blue-700 hover:text-blue-600">
              Export Holdings CSV
            </button>
            <button className="text-sm text-blue-700 hover:text-blue-600">
              Export Deal Report
            </button>
            <button className="text-sm text-blue-700 hover:text-blue-600">
              Export Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}