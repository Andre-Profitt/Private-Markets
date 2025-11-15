'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Deal {
  id: string;
  name: string;
  company: string;
  status: string;
  targetSize: number;
  minTicket: number;
  pricePerShare?: number;
  openDate: string;
  commitDeadline: string;
  closeDate: string;
  totalSupply: number;
  totalDemand: number;
  sellerCount: number;
  buyerCount: number;
}

export default function AdminDealsPage() {
  // Mock data - will be replaced with API calls
  const [deals] = useState<Deal[]>([
    {
      id: 'deal-1',
      name: 'Q4 2024 Liquidity Program',
      company: 'Acme Corp',
      status: 'OPEN',
      targetSize: 5000000,
      minTicket: 25000,
      pricePerShare: 12.50,
      openDate: '2024-11-01',
      commitDeadline: '2024-11-30',
      closeDate: '2024-12-15',
      totalSupply: 18000,
      totalDemand: 850000,
      sellerCount: 3,
      buyerCount: 3,
    },
    {
      id: 'deal-2',
      name: 'Q1 2025 Secondary Offering',
      company: 'TechCo',
      status: 'DRAFT',
      targetSize: 10000000,
      minTicket: 50000,
      openDate: '2025-01-15',
      commitDeadline: '2025-02-15',
      closeDate: '2025-03-01',
      totalSupply: 0,
      totalDemand: 0,
      sellerCount: 0,
      buyerCount: 0,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'ALLOCATING':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deal Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage all liquidity programs and secondary offerings
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/admin"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to Dashboard
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                Create New Deal
              </button>
            </div>
          </div>
        </div>

        {/* Deals Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Share
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supply/Demand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deal.name}</div>
                    <div className="text-xs text-gray-500">{deal.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(deal.targetSize / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {deal.pricePerShare ? `$${deal.pricePerShare}` : 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {deal.totalSupply.toLocaleString()} shares
                    </div>
                    <div className="text-xs text-gray-500">
                      ${(deal.totalDemand / 1000000).toFixed(2)}M demand
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {deal.sellerCount} sellers
                    </div>
                    <div className="text-xs text-gray-500">
                      {deal.buyerCount} buyers
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(deal.commitDeadline).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Commit by
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/deals/${deal.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Manage
                      </Link>
                      <button className="text-gray-400 hover:text-gray-600">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {deals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No deals found. Create your first deal to get started.
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Deals</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {deals.filter(d => d.status === 'OPEN').length}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Currently accepting participations
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${(deals.reduce((sum, d) => sum + d.totalDemand, 0) / 1000000).toFixed(1)}M
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Across all deals
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Deal Size</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              ${(deals.reduce((sum, d) => sum + d.targetSize, 0) / deals.length / 1000000).toFixed(1)}M
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Target size per deal
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900">Deal Management Process</h3>
          <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Create deal with target size and timeline</li>
            <li>Open deal for seller participations and buyer commitments</li>
            <li>Review and verify holdings</li>
            <li>Set allocations based on supply and demand</li>
            <li>Lock allocations and send documentation</li>
            <li>Track payments and close deal</li>
          </ol>
        </div>
      </div>
    </div>
  );
}