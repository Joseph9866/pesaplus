import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Investment } from '../types';
import { 
  TrendingUp, 
  PieChart,
  Calendar,
  DollarSign,
  Plus,
  BarChart3,
  Target,
  Wallet
} from 'lucide-react';

export const Investments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Investment['investment_type']>('all');

  useEffect(() => {
    // TODO: Fetch investments from API
    // For now, using mock data
    const mockInvestments: Investment[] = [
      {
        id: '1',
        user_id: user?.id || '',
        investment_type: 'fixed_deposit',
        amount: 100000,
        current_value: 108000,
        interest_rate: 8,
        duration_months: 12,
        maturity_date: new Date(Date.now() + 15552000000).toISOString(),
        status: 'active',
        returns: 8000,
        created_at: new Date(Date.now() - 15552000000).toISOString(),
      },
      {
        id: '2',
        user_id: user?.id || '',
        investment_type: 'mutual_fund',
        amount: 50000,
        current_value: 56500,
        interest_rate: 13,
        duration_months: 12,
        maturity_date: new Date(Date.now() + 10368000000).toISOString(),
        status: 'active',
        returns: 6500,
        created_at: new Date(Date.now() - 20736000000).toISOString(),
      },
      {
        id: '3',
        user_id: user?.id || '',
        investment_type: 'bonds',
        amount: 75000,
        current_value: 75000,
        interest_rate: 10,
        duration_months: 24,
        maturity_date: new Date(Date.now() - 2592000000).toISOString(),
        status: 'matured',
        returns: 15000,
        created_at: new Date(Date.now() - 62208000000).toISOString(),
      },
    ];

    setTimeout(() => {
      setInvestments(mockInvestments);
      setLoading(false);
    }, 500);
  }, [user]);

  const getInvestmentIcon = (type: Investment['investment_type']) => {
    switch (type) {
      case 'fixed_deposit':
        return <Wallet className="text-blue-600" size={24} />;
      case 'mutual_fund':
        return <PieChart className="text-purple-600" size={24} />;
      case 'bonds':
        return <BarChart3 className="text-green-600" size={24} />;
      case 'stocks':
        return <TrendingUp className="text-orange-600" size={24} />;
    }
  };

  const getInvestmentColor = (type: Investment['investment_type']) => {
    switch (type) {
      case 'fixed_deposit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mutual_fund':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bonds':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'stocks':
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getStatusBadge = (status: Investment['status']) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      matured: 'bg-green-100 text-green-800 border-green-200',
      withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredInvestments = investments.filter(inv => 
    filter === 'all' || inv.investment_type === filter
  );

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const currentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + inv.returns, 0);
  const activeInvestments = investments.filter(inv => inv.status === 'active').length;

  return (
    <Layout title="Investments" showBack backPath="/dashboard">
      <Container>
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 py-3 sm:py-4 px-3 sm:px-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-none">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-white/80 text-xs sm:text-sm">Total Invested</p>
                <DollarSign className="text-white/60" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                KES {totalInvested.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#F4B400] to-[#E5A800] border-none">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-white/90 text-xs sm:text-sm">Current Value</p>
                <TrendingUp className="text-white/80" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                KES {currentValue.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 border-2 border-green-200 bg-green-50">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-green-700 text-xs sm:text-sm">Total Returns</p>
                <Target className="text-green-600" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-green-700 text-lg sm:text-xl md:text-2xl font-bold">
                +KES {totalReturns.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-gray-600 text-xs sm:text-sm">Active</p>
                <PieChart className="text-gray-600" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold">
                {activeInvestments}
              </h3>
            </Card>
          </div>

          {/* New Investment Button */}
          <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#F4B400]/10 to-[#E5A800]/10 border-2 border-[#F4B400]/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-[#0F2A44] font-semibold text-base sm:text-lg mb-1">Start Investing Today</h3>
                <p className="text-gray-700 text-xs sm:text-sm">Grow your wealth with our investment options</p>
              </div>
              <Button
                className="bg-[#F4B400] hover:bg-[#E5A800] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus size={16} className="sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                New Investment
              </Button>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#0F2A44] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Investments
              </button>
              <button
                onClick={() => setFilter('fixed_deposit')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  filter === 'fixed_deposit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fixed Deposits
              </button>
              <button
                onClick={() => setFilter('mutual_fund')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  filter === 'mutual_fund'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mutual Funds
              </button>
              <button
                onClick={() => setFilter('bonds')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  filter === 'bonds'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bonds
              </button>
              <button
                onClick={() => setFilter('stocks')}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-all ${
                  filter === 'stocks'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Stocks
              </button>
            </div>
          </Card>

          {/* Investments List */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-[#F4B400] rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F2A44]">My Investments</h2>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#0F2A44] mx-auto"></div>
                <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading investments...</p>
              </div>
            ) : filteredInvestments.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <PieChart className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} className="sm:w-12 sm:h-12" />
                <p className="text-gray-600 text-base sm:text-lg">No investments found</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">Start investing to grow your wealth</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredInvestments.map((investment) => (
                  <div
                    key={investment.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 hover:border-[#F4B400] hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg flex-shrink-0">
                          {getInvestmentIcon(investment.investment_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 capitalize text-sm sm:text-base truncate">
                            {investment.investment_type.replace('_', ' ')}
                          </h3>
                          <span className={`inline-block text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full border mt-1 ${getInvestmentColor(investment.investment_type)}`}>
                            {investment.interest_rate}% p.a.
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-full sm:w-auto">
                        {getStatusBadge(investment.status)}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Initial Investment</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm text-right truncate">
                          KES {investment.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Current Value</span>
                        <span className="font-semibold text-[#F4B400] text-xs sm:text-sm text-right truncate">
                          KES {investment.current_value.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Returns</span>
                        <span className="font-semibold text-green-600 text-xs sm:text-sm text-right">
                          +KES {investment.returns.toLocaleString()} ({((investment.returns / investment.amount) * 100).toFixed(2)}%)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                          <Calendar size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap">Maturity Date</span>
                        </div>
                        <span className="font-medium text-gray-900 text-right sm:text-left">
                          {new Date(investment.maturity_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {investment.status === 'active' && (
                      <div className="mt-3 sm:mt-4">
                        <Button
                          variant="secondary"
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base"
                        >
                          View Details
                        </Button>
                      </div>
                    )}

                    {investment.status === 'matured' && (
                      <div className="mt-3 sm:mt-4">
                        <Button
                          className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white font-semibold text-sm sm:text-base"
                        >
                          Withdraw Funds
                        </Button>
                      </div>
                    )}
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
