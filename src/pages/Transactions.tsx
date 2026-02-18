import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  Filter,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Fetch transactions from API
    // For now, using mock data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        user_id: user?.id || '',
        goal_id: 'goal-1',
        amount: 5000,
        type: 'deposit',
        description: 'Monthly savings deposit',
        status: 'completed',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: user?.id || '',
        goal_id: null,
        amount: 2000,
        type: 'withdrawal',
        description: 'Emergency withdrawal',
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        user_id: user?.id || '',
        goal_id: 'goal-2',
        amount: 3000,
        type: 'transfer',
        description: 'Transfer to vacation fund',
        status: 'completed',
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  }, [user]);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-green-600" size={24} />;
      case 'withdrawal':
        return <ArrowUpRight className="text-red-600" size={24} />;
      case 'transfer':
        return <ArrowLeftRight className="text-blue-600" size={24} />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'text-green-600';
      case 'withdrawal':
        return 'text-red-600';
      case 'transfer':
        return 'text-blue-600';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout title="Transactions" showBack backPath="/dashboard">
      <Container>
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 py-3 sm:py-4 px-3 sm:px-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-1">Total Deposits</p>
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                    KES {totalDeposits.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2 sm:p-3 bg-white/10 rounded-lg">
                  <TrendingUp className="text-green-400" size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#F4B400] to-[#E5A800] border-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90 text-xs sm:text-sm mb-1">Total Withdrawals</p>
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                    KES {totalWithdrawals.toLocaleString()}
                  </h3>
                </div>
                <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
                  <TrendingDown className="text-white" size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-1">Net Flow</p>
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${totalDeposits - totalWithdrawals >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    KES {(totalDeposits - totalWithdrawals).toLocaleString()}
                  </h3>
                </div>
                <div className="p-2 sm:p-3 bg-gray-100 rounded-lg">
                  <ArrowLeftRight className="text-gray-600" size={20} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex-shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 flex-wrap w-full md:w-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-[#0F2A44] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('deposit')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                    filter === 'deposit'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Deposits
                </button>
                <button
                  onClick={() => setFilter('withdrawal')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                    filter === 'withdrawal'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Withdrawals
                </button>
                <button
                  onClick={() => setFilter('transfer')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                    filter === 'transfer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Transfers
                </button>
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-[#F4B400] rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F2A44]">Transaction History</h2>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#0F2A44] mx-auto"></div>
                <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} className="sm:w-12 sm:h-12" />
                <p className="text-gray-600 text-base sm:text-lg">No transactions found</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-[#F4B400] hover:shadow-md transition-all gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-lg flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{transaction.description}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {getStatusBadge(transaction.status)}
                      <div className="text-right">
                        <p className={`text-base sm:text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </Layout>
  );
};
