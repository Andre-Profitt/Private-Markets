'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface SellerParticipation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  holdingId: string;
  sharesToSell: number;
  minimumPrice?: number;
  status: string;
  approvedShares?: number;
}

interface BuyerCommitment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  commitmentAmount: number;
  status: string;
  allocatedAmount?: number;
  paymentStatus: string;
}

export default function AdminDealManagementPage() {
  const params = useParams();
  const dealId = params.id as string;

  // Mock deal data
  const [deal] = useState({
    id: dealId,
    name: 'Q4 2024 Liquidity Program',
    company: 'Acme Corp',
    status: 'OPEN',
    targetSize: 5000000,
    minTicket: 25000,
    pricePerShare: 12.50,
    openDate: '2024-11-01',
    commitDeadline: '2024-11-30',
    closeDate: '2024-12-15',
    totalSupply: 0,
    totalDemand: 0,
  });

  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');

  // Mock seller participations
  const [sellerParticipations, setSellerParticipations] = useState<SellerParticipation[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Smith',
      userEmail: 'john.smith@email.com',
      holdingId: 'holding1',
      sharesToSell: 5000,
      minimumPrice: 12.00,
      status: 'VERIFIED',
      approvedShares: 5000,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Jones',
      userEmail: 'sarah.jones@email.com',
      holdingId: 'holding2',
      sharesToSell: 3000,
      minimumPrice: 11.50,
      status: 'SUBMITTED',
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Chen',
      userEmail: 'mike.chen@email.com',
      holdingId: 'holding3',
      sharesToSell: 10000,
      minimumPrice: 12.50,
      status: 'VERIFIED',
      approvedShares: 8000,
    },
  ]);

  // Mock buyer commitments
  const [buyerCommitments, setBuyerCommitments] = useState<BuyerCommitment[]>([
    {
      id: '1',
      userId: 'buyer1',
      userName: 'Alice Johnson',
      userEmail: 'alice.j@fund.com',
      commitmentAmount: 250000,
      status: 'APPROVED',
      allocatedAmount: 200000,
      paymentStatus: 'PENDING',
    },
    {
      id: '2',
      userId: 'buyer2',
      userName: 'Bob Wilson',
      userEmail: 'bob@familyoffice.com',
      commitmentAmount: 500000,
      status: 'APPROVED',
      allocatedAmount: 350000,
      paymentStatus: 'PENDING',
    },
    {
      id: '3',
      userId: 'buyer3',
      userName: 'Carol Davis',
      userEmail: 'carol@investor.com',
      commitmentAmount: 100000,
      status: 'SUBMITTED',
      paymentStatus: 'PENDING',
    },
  ]);

  const handleApproveShares = (participationId: string, shares: number) => {
    setSellerParticipations(prev =>
      prev.map(p =>
        p.id === participationId
          ? { ...p, approvedShares: shares, status: 'APPROVED' }
          : p
      )
    );
  };

  const handleAllocateAmount = (commitmentId: string, amount: number) => {
    setBuyerCommitments(prev =>
      prev.map(c =>
        c.id === commitmentId
          ? { ...c, allocatedAmount: amount, status: 'ALLOCATED' }
          : c
      )
    );
  };

  const totalSharesOffered = sellerParticipations.reduce(
    (sum, p) => sum + (p.approvedShares || p.sharesToSell),
    0
  );

  const totalCommitments = buyerCommitments.reduce(
    (sum, c) => sum + c.commitmentAmount,
    0
  );

  const totalAllocated = buyerCommitments.reduce(
    (sum, c) => sum + (c.allocatedAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{deal.name}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {deal.company} • Deal ID: {deal.id}
              </p>
            </div>
            <Link
              href="/admin/deals"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to Deals
            </Link>
          </div>

          {/* Deal Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">Status</div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {deal.status}
                </span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">Price/Share</div>
              <div className="mt-1 text-lg font-semibold">${deal.pricePerShare}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Supply</div>
              <div className="mt-1 text-lg font-semibold">{totalSharesOffered.toLocaleString()} shares</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">Total Demand</div>
              <div className="mt-1 text-lg font-semibold">${(totalCommitments / 1000000).toFixed(2)}M</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('sellers')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'sellers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sellers ({sellerParticipations.length})
              </button>
              <button
                onClick={() => setActiveTab('buyers')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'buyers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Buyers ({buyerCommitments.length})
              </button>
            </nav>
          </div>

          {/* Sellers Tab */}
          {activeTab === 'sellers' && (
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shares Offered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approved Shares
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellerParticipations.map((participation) => (
                    <tr key={participation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{participation.userName}</div>
                        <div className="text-xs text-gray-500">{participation.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participation.sharesToSell.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${participation.minimumPrice || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          participation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          participation.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {participation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={participation.approvedShares || participation.sharesToSell}
                          onChange={(e) => handleApproveShares(participation.id, parseInt(e.target.value))}
                          className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApproveShares(participation.id, participation.approvedShares || participation.sharesToSell)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Buyers Tab */}
          {activeTab === 'buyers' && (
            <div className="p-6">
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium text-yellow-900">Allocation Summary</div>
                    <div className="text-xs text-yellow-700 mt-1">
                      Total Committed: ${(totalCommitments / 1000000).toFixed(2)}M |
                      Total Allocated: ${(totalAllocated / 1000000).toFixed(2)}M |
                      Remaining: ${((totalCommitments - totalAllocated) / 1000000).toFixed(2)}M
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                    Lock Allocations
                  </button>
                </div>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Committed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accredited
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buyerCommitments.map((commitment) => (
                    <tr key={commitment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{commitment.userName}</div>
                        <div className="text-xs text-gray-500">{commitment.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${commitment.commitmentAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Yes
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          commitment.status === 'ALLOCATED' ? 'bg-green-100 text-green-800' :
                          commitment.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {commitment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-500">$</span>
                          <input
                            type="number"
                            value={commitment.allocatedAmount || ''}
                            onChange={(e) => handleAllocateAmount(commitment.id, parseInt(e.target.value))}
                            placeholder="0"
                            className="w-28 px-2 py-1 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          commitment.paymentStatus === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          commitment.paymentStatus === 'WIRED' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {commitment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleAllocateAmount(commitment.id, commitment.allocatedAmount || 0)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Deal Actions</h3>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
              Send Doc Requests
            </button>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
              Send Wire Instructions
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">
              Export Deal Report
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700">
              Close Deal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}