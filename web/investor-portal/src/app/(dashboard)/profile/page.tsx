'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [accreditation, setAccreditation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (user && accessToken) {
      loadProfileData();
    }
  }, [user, accessToken]);

  const loadProfileData = async () => {
    if (!user || !accessToken) return;

    try {
      const [profileData, kycData, accreditationData] = await Promise.all([
        apiClient.getProfile(user.id, accessToken).catch(() => null),
        apiClient.getKycStatus(user.id, accessToken).catch(() => null),
        apiClient.getAccreditationStatus(user.id, accessToken).catch(() => null),
      ]);

      setProfile(profileData);
      setKycStatus(kycData);
      setAccreditation(accreditationData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartKyc = async (checkType: string) => {
    if (!user || !accessToken) return;

    try {
      await apiClient.startKycCheck(user.id, checkType, accessToken);
      await loadProfileData();
    } catch (error) {
      console.error('Failed to start KYC check:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          {profile && (
            <span
              className={
                profile.profileComplete
                  ? 'px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800'
                  : 'px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800'
              }
            >
              {profile.profileComplete ? 'Complete' : 'Incomplete'}
            </span>
          )}
        </div>

        {profile ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">
                {profile.street && profile.city
                  ? profile.street + ', ' + profile.city + ', ' + profile.state + ' ' + profile.zipCode
                  : 'Not provided'}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No profile information found. Please contact support to create your profile.</p>
        )}
      </div>

      {/* KYC Status */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">KYC Verification</h2>
        
        {kycStatus ? (
          <div>
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Overall Status: </span>
              <span
                className={
                  kycStatus.overallStatus === 'APPROVED'
                    ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                    : kycStatus.overallStatus === 'PENDING'
                    ? 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
                    : 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
                }
              >
                {kycStatus.overallStatus || 'Not Started'}
              </span>
            </div>

            {kycStatus.checks && kycStatus.checks.length > 0 ? (
              <div className="space-y-3">
                {kycStatus.checks.map((check: any) => (
                  <div key={check.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{check.checkType.replace(/_/g, ' ')}</p>
                      {check.completedAt && (
                        <p className="text-xs text-gray-500">
                          Completed: {new Date(check.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={
                        check.status === 'APPROVED'
                          ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                          : check.status === 'PENDING'
                          ? 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
                          : 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'
                      }
                    >
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No KYC checks completed yet.</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">KYC verification not started.</p>
        )}

        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleStartKyc('IDENTITY_VERIFICATION')}
            className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Start Identity Verification
          </button>
          <button
            onClick={() => handleStartKyc('ADDRESS_VERIFICATION')}
            className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Start Address Verification
          </button>
        </div>
      </div>

      {/* Accreditation Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Accreditation Status</h2>
        
        {accreditation ? (
          <div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Verification Type:</span>
                <span className="text-sm text-gray-900">{accreditation.verificationType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span
                  className={
                    accreditation.status === 'VERIFIED'
                      ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                      : 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
                  }
                >
                  {accreditation.status}
                </span>
              </div>
              {accreditation.verifiedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Verified On:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(accreditation.verifiedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {accreditation.expiresAt && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Expires On:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(accreditation.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Not yet accredited. Complete KYC verification first.</p>
        )}
      </div>
    </div>
  );
}
