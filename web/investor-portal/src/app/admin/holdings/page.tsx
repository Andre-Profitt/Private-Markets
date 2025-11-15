'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Holding {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  company: string;
  shareType: string;
  quantity: number;
  grantDate: string;
  proofDocUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function AdminHoldingsPage() {
  // Mock data - will be replaced with API calls
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      id: '1',
      userId: 'user1',
      userEmail: 'john.smith@email.com',
      userName: 'John Smith',
      company: 'Acme Corp',
      shareType: 'COMMON',
      quantity: 10000,
      grantDate: '2020-01-15',
      proofDocUrl: '/docs/proof1.pdf',
      verified: false,
      createdAt: '2024-11-14',
    },
    {
      id: '2',
      userId: 'user2',
      userEmail: 'sarah.jones@email.com',
      userName: 'Sarah Jones',
      company: 'Acme Corp',
      shareType: 'OPTIONS',
      quantity: 5000,
      grantDate: '2019-06-01',
      proofDocUrl: '/docs/proof2.pdf',
      verified: true,
      verifiedBy: 'admin@platform.com',
      verifiedAt: '2024-11-13',
      createdAt: '2024-11-12',
    },
    {
      id: '3',
      userId: 'user3',
      userEmail: 'mike.chen@email.com',
      userName: 'Mike Chen',
      company: 'Acme Corp',
      shareType: 'PREFERRED_A',
      quantity: 25000,
      grantDate: '2018-03-10',
      proofDocUrl: '/docs/proof3.pdf',
      verified: false,
      createdAt: '2024-11-15',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified'>('all');

  const filteredHoldings = holdings.filter(holding => {
    if (filterStatus === 'pending') return !holding.verified;
    if (filterStatus === 'verified') return holding.verified;
    return true;
  });

  const handleVerify = (holdingId: string) => {
    setHoldings(prev =>
      prev.map(holding =>
        holding.id === holdingId
          ? {
              ...holding,
              verified: true,
              verifiedBy: 'admin@platform.com',
              verifiedAt: new Date().toISOString(),
            }
          : holding
      )
    );
  };

  const handleReject = (holdingId: string) => {
    // In real app, this would call API and potentially delete the holding
    console.log('Rejecting holding:', holdingId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Holdings Review</h1>
              <p className="mt-1 text-sm text-gray-600">
                Review and verify user holdings
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterStatus === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({holdings.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Pending ({holdings.filter(h => !h.verified).length})
              </button>
              <button
                onClick={() => setFilterStatus('verified')}
                className={`px-3 py-1 text-sm rounded-md ${
                  filterStatus === 'verified'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Verified ({holdings.filter(h => h.verified).length})
              </button>
            </div>
            <div className="ml-auto">
              <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-500">
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grant Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoldings.map((holding) => (
                <tr key={holding.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{holding.userName}</div>
                    <div className="text-xs text-gray-500">{holding.userEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {holding.company}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {holding.shareType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {holding.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(holding.grantDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {holding.proofDocUrl ? (
                      <a
                        href={holding.proofDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-500"
                      >
                        View Doc
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">No doc</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {holding.verified ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                        {holding.verifiedBy && (
                          <div className="text-xs text-gray-500 mt-1">
                            by {holding.verifiedBy}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!holding.verified ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerify(holding.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(holding.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReject(holding.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHoldings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No holdings found
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900">Verification Guidelines</h3>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Review proof documents carefully - ensure they show ownership</li>
            <li>Verify grant dates match the documentation</li>
            <li>Check share quantities are reasonable and match docs</li>
            <li>For options, ensure vesting schedule is documented</li>
            <li>Contact user if additional documentation is needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}