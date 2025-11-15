'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [positionSummary, setPositionSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accessToken) {
      loadDashboardData();
    }
  }, [user, accessToken]);

  const loadDashboardData = async () => {
    if (!user || !accessToken) return;

    try {
      const [profileData, summaryData] = await Promise.all([
        apiClient.getProfile(user.id, accessToken).catch(() => null),
        apiClient.getPositionSummary(user.id, accessToken).catch(() => null),
      ]);

      setProfile(profileData);
      setPositionSummary(summaryData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome, {user?.firstName || user?.email}
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">💼</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Positions</dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {positionSummary?.totalPositions || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">🏢</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Companies</dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {positionSummary?.totalCompanies || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-3xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Invested</dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {positionSummary?.totalInvested 
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(positionSummary.totalInvested)
                      : '$0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Status</h2>
          {profile ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Completion</span>
                <span
                  className={
                    profile.profileComplete
                      ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                      : 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
                  }
                >
                  {profile.profileComplete ? 'Complete' : 'Incomplete'}
                </span>
              </div>
              <Link
                href="/profile"
                className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Profile
              </Link>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p className="mb-4">No profile found. Complete your profile to start investing.</p>
              <Link
                href="/profile"
                className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Profile
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/holdings"
              className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Holdings
            </Link>
            <Link
              href="/companies"
              className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse Companies
            </Link>
            <Link
              href="/profile"
              className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Start KYC Verification
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
