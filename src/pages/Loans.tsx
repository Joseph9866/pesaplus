import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Loan } from '../types';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export const Loans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    // TODO: Fetch loans from API
    // For now, using mock data
    const mockLoans: Loan[] = [
      {
        id: '1',
        user_id: user?.id || '',
        amount: 50000,
        interest_rate: 12,
        duration_months: 12,
        monthly_payment: 4442,
        total_repayment: 53304,
        amount_paid: 22210,
        status: 'active',
        purpose: 'Business expansion',
        application_date: new Date(Date.now() - 15552000000).toISOString(),
        approval_date: new Date(Date.now() - 15379200000).toISOString(),
        due_date: new Date(Date.now() + 15552000000).toISOString(),
        created_at: new Date(Date.now() - 15552000000).toISOString(),
      },
      {
        id: '2',
        user_id: user?.id || '',
        amount: 30000,
        interest_rate: 10,
        duration_months: 6,
        monthly_payment: 5165,
        total_repayment: 30990,
        amount_paid: 30990,
        status: 'completed',
        purpose: 'Emergency medical',
        application_date: new Date(Date.now() - 31104000000).toISOString(),
        approval_date: new Date(Date.now() - 30931200000).toISOString(),
        due_date: new Date(Date.now() - 15552000000).toISOString(),
        created_at: new Date(Date.now() - 31104000000).toISOString(),
      },
    ];

    setTimeout(() => {
      setLoans(mockLoans);
      setLoading(false);
    }, 500);
  }, [user]);

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="text-blue-600" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'rejected':
      case 'defaulted':
        return <XCircle className="text-red-600" size={20} />;
    }
  };

  const getStatusBadge = (status: Loan['status']) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      defaulted: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]} flex items-center gap-1`}>
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const totalBorrowed = activeLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalRepayment = activeLoans.reduce((sum, l) => sum + l.total_repayment, 0);
  const totalPaid = activeLoans.reduce((sum, l) => sum + l.amount_paid, 0);
  const remainingBalance = totalRepayment - totalPaid;

  return (
    <Layout title="Loans" showBack backPath="/dashboard">
      <Container>
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 py-3 sm:py-4 px-3 sm:px-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-none">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-white/80 text-xs sm:text-sm">Total Borrowed</p>
                <DollarSign className="text-white/60" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                KES {totalBorrowed.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-br from-[#F4B400] to-[#E5A800] border-none">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-white/90 text-xs sm:text-sm">Total Paid</p>
                <CheckCircle className="text-white/80" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                KES {totalPaid.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-red-700 text-xs sm:text-sm">Remaining</p>
                <AlertCircle className="text-red-600" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-red-700 text-lg sm:text-xl md:text-2xl font-bold">
                KES {remainingBalance.toLocaleString()}
              </h3>
            </Card>

            <Card className="p-4 sm:p-5 md:p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <p className="text-gray-600 text-xs sm:text-sm">Active Loans</p>
                <TrendingUp className="text-gray-600" size={16} className="sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-gray-900 text-lg sm:text-xl md:text-2xl font-bold">
                {activeLoans.length}
              </h3>
            </Card>
          </div>

          {/* Apply for Loan Button */}
          <Card className="p-4 sm:p-5 md:p-6 bg-gradient-to-r from-[#F4B400]/10 to-[#E5A800]/10 border-2 border-[#F4B400]/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h3 className="text-[#0F2A44] font-semibold text-base sm:text-lg mb-1">Need a Loan?</h3>
                <p className="text-gray-700 text-xs sm:text-sm">Apply for a loan with competitive interest rates</p>
              </div>
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="bg-[#F4B400] hover:bg-[#E5A800] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus size={16} className="sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                Apply Now
              </Button>
            </div>
          </Card>

          {/* Loans List */}
          <Card className="p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 sm:h-8 bg-[#F4B400] rounded-full"></div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F2A44]">My Loans</h2>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#0F2A44] mx-auto"></div>
                <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Loading loans...</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <DollarSign className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} className="sm:w-12 sm:h-12" />
                <p className="text-gray-600 text-base sm:text-lg">No loans yet</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">Apply for your first loan to get started</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 hover:border-[#F4B400] hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{loan.purpose}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Applied: {new Date(loan.application_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      {getStatusBadge(loan.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Loan Amount</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">KES {loan.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Interest Rate</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{loan.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Monthly Payment</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">KES {loan.monthly_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{loan.duration_months} months</p>
                      </div>
                    </div>

                    {loan.status === 'active' && (
                      <>
                        <div className="mb-1 sm:mb-2">
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600">Repayment Progress</span>
                            <span className="font-semibold text-gray-900">
                              {Math.round((loan.amount_paid / loan.total_repayment) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-gradient-to-r from-[#F4B400] to-[#E5A800] h-1.5 sm:h-2 rounded-full transition-all"
                              style={{ width: `${(loan.amount_paid / loan.total_repayment) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">
                            Paid: KES {loan.amount_paid.toLocaleString()}
                          </span>
                          <span className="text-gray-600">
                            Remaining: KES {(loan.total_repayment - loan.amount_paid).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}

                    {loan.status === 'completed' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="text-green-700 text-xs sm:text-sm font-medium">
                          Loan fully repaid on {loan.due_date && new Date(loan.due_date).toLocaleDateString()}
                        </span>
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
