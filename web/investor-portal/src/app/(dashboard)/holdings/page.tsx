'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient } from '@/lib/api-client';

export default function HoldingsPage() {
  const { user, accessToken } = useAuth();
  const [positions, setPositions] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && accessToken) {
      loadHoldingsData();
    }
  }, [user, accessToken]);

  const loadHoldingsData = async () => {
    if (!user || !accessToken) return;

    try {
      const [positionsData, transactionsData] = await Promise.all([
        apiClient.getUserPositions(user.id, accessToken).catch(() => []),
        apiClient.getUserTransactions(user.id, accessToken, 10).catch(() => []),
      ]);

      setPositions(positionsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Failed to load holdings data:', error);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Holdings</h1>

      {/* Positions Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Positions</h2>
        
        {positions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {positions.map((position, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {position.companyId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {position.securityClassId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {position.totalShares.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(position.averageCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(position.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📊</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No positions yet</h3>
            <p className="text-sm text-gray-500">
              You do not have any holdings yet. Browse companies to start investing.
            </p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
        
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.transactionType.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.transactionDate).toLocaleDateString()} - {transaction.shares.toLocaleString()} shares
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.totalAmount
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.totalAmount)
                      : '-'}
                  </p>
                  <span
                    className={
                      transaction.status === 'SETTLED'
                        ? 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
                        : transaction.status === 'PENDING'
                        ? 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
                        : 'px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
                    }
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
