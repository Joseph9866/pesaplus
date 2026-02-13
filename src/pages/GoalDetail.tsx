import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { CircularProgress } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Goal, Transaction } from '../types';
import { Calendar, TrendingUp, History, Plus, Settings } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useFormattedCurrency } from '../utils/currency';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency } from '../utils/currency';

const TransactionItem = ({ transaction, formatDate }: { transaction: Transaction; formatDate: (date: string) => string }) => {
  const formattedAmount = useFormattedCurrency(transaction.amount);
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div>
        <p className="font-medium text-text">{transaction.description}</p>
        <p className="text-sm text-text-secondary">
          {formatDate(transaction.created_at)}
        </p>
      </div>
      <p className="font-semibold text-secondary">
        +{formattedAmount}
      </p>
    </div>
  );
};

export const GoalDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const { currency, exchangeRate } = useCurrency();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    if (id) {
      fetchGoalData();
    }
  }, [id]);

  const fetchGoalData = async () => {
    try {
      const [goalResult, transactionsResult] = await Promise.all([
        supabase.from('goals').select('*').eq('id', id).maybeSingle(),
        supabase
          .from('transactions')
          .select('*')
          .eq('goal_id', id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (goalResult.error) throw goalResult.error;
      if (transactionsResult.error) throw transactionsResult.error;

      setGoal(goalResult.data);
      setTransactions(transactionsResult.data || []);
    } catch (error) {
      console.error('Error fetching goal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !goal || parseFloat(depositAmount) <= 0) return;

    try {
      // Convert the entered amount from user's currency to KES (base currency)
      const amountInUserCurrency = parseFloat(depositAmount);
      const amountInKES = convertCurrency(amountInUserCurrency, currency, 'KES', exchangeRate);

      await supabase
        .from('goals')
        .update({
          current_amount: goal.current_amount + amountInKES,
        })
        .eq('id', goal.id);

      await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          goal_id: goal.id,
          amount: amountInKES,
          type: 'deposit',
          description: `Deposit to ${goal.title}`,
        });

      await supabase
        .from('user_profiles')
        .update({
          total_balance: (user?.total_balance || 0) + amountInKES,
          total_saved: (user?.total_saved || 0) + amountInKES,
        })
        .eq('id', user?.id);

      await refreshUser();
      await fetchGoalData();
      setShowDepositModal(false);
      setDepositAmount('');
    } catch (error) {
      console.error('Error depositing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (!goal) return 0;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Layout showBack>
        <Container>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        </Container>
      </Layout>
    );
  }

  if (!goal) {
    return (
      <Layout showBack>
        <Container>
          <div className="text-center py-12">
            <p className="text-text-secondary">Goal not found</p>
          </div>
        </Container>
      </Layout>
    );
  }

  const percentage = (goal.current_amount / goal.target_amount) * 100;
  const IconComponent = (Icons[goal.icon as keyof typeof Icons] || Icons.Target) as LucideIcon;
  
  // Format currency amounts using the hook
  const formattedCurrentAmount = useFormattedCurrency(goal.current_amount);
  const formattedTargetAmount = useFormattedCurrency(goal.target_amount);
  const formattedRemainingAmount = useFormattedCurrency(goal.target_amount - goal.current_amount);
  
  // Quick-add amounts in user's current currency
  const quickAddAmounts = [100, 500, 1000].map(kesAmount => 
    convertCurrency(kesAmount, 'KES', currency, exchangeRate)
  );

  return (
    <Layout showBack title={goal.title}>
      <Container>
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col items-center text-center">
              <CircularProgress
                percentage={percentage}
                color={goal.color}
                size={160}
                strokeWidth={12}
              />
              <div className="mt-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  <IconComponent size={32} style={{ color: goal.color }} />
                </div>
                <h2 className="text-2xl font-bold text-text mb-2">{goal.title}</h2>
                <p className="text-lg text-text-secondary mb-4">
                  {formattedCurrentAmount} of {formattedTargetAmount}
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="info">
                    {getDaysRemaining()} days left
                  </Badge>
                  <Badge variant={goal.status === 'active' ? 'success' : 'warning'}>
                    {goal.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-1">Deadline</p>
              <p className="font-semibold text-text">{formatDate(goal.deadline)}</p>
            </Card>
            <Card className="text-center">
              <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-1">Remaining</p>
              <p className="font-semibold text-text">
                {formattedRemainingAmount}
              </p>
            </Card>
            <Card className="text-center">
              <Settings className="w-8 h-8 text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-1">Auto-Save</p>
              <p className="font-semibold text-text">
                {goal.auto_save_enabled ? 'Enabled' : 'Disabled'}
              </p>
            </Card>
          </div>

          <Button onClick={() => setShowDepositModal(true)} fullWidth>
            <Plus size={20} className="mr-2" />
            Add Money to Goal
          </Button>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <History size={20} className="text-text-secondary" />
              <h3 className="font-semibold text-text">Recent Transactions</h3>
            </div>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id}
                    transaction={transaction}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-4">No transactions yet</p>
            )}
          </Card>
        </div>
      </Container>

      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Add Money"
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount to deposit"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-2">
            {quickAddAmounts.map((amount, index) => (
              <Button
                key={index}
                variant="secondary"
                onClick={() => setDepositAmount(amount.toString())}
              >
                +{Math.round(amount)}
              </Button>
            ))}
          </div>
          <Button onClick={handleDeposit} fullWidth>
            Deposit
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
