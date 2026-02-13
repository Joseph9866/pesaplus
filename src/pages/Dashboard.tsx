import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { BalanceCard } from '../components/features/BalanceCard';
import { GoalCard } from '../components/features/GoalCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Goal } from '../types';
import { Plus, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormattedCurrency } from '../utils/currency';
import { useCurrency } from '../contexts/CurrencyContext';
import { convertCurrency, formatCurrency } from '../utils/currency';

const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  target_amount: z.string().min(1, 'Target amount is required'),
  deadline: z.string().min(1, 'Deadline is required'),
});

type GoalFormData = z.infer<typeof goalSchema>;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { currency, exchangeRate } = useCurrency();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);

  // Format currency values
  const formattedBalance = useFormattedCurrency(user?.total_balance || 0);
  const weeklyIncrease = (user?.total_saved || 0) * 0.1;
  const formattedWeeklyIncrease = useFormattedCurrency(weeklyIncrease);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (data: GoalFormData) => {
    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user?.id,
          title: data.title,
          target_amount: parseFloat(data.target_amount),
          deadline: data.deadline,
          icon: 'Target',
          color: '#1FA774',
        });

      if (error) throw error;

      await fetchGoals();
      setShowGoalModal(false);
      reset();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    try {
      const amount = parseFloat(depositAmount);

      if (depositGoalId) {
        const goal = goals.find(g => g.id === depositGoalId);
        if (!goal) return;

        await supabase
          .from('goals')
          .update({
            current_amount: goal.current_amount + amount,
          })
          .eq('id', depositGoalId);

        await supabase
          .from('transactions')
          .insert({
            user_id: user?.id,
            goal_id: depositGoalId,
            amount,
            type: 'deposit',
            description: `Deposit to ${goal.title}`,
          });
      }

      await supabase
        .from('user_profiles')
        .update({
          total_balance: (user?.total_balance || 0) + amount,
          total_saved: (user?.total_saved || 0) + amount,
        })
        .eq('id', user?.id);

      await refreshUser();
      await fetchGoals();
      setShowDepositModal(false);
      setDepositAmount('');
      setDepositGoalId(null);
    } catch (error) {
      console.error('Error depositing:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        </Container>
      </Layout>
    );
  }

  if (goals.length === 0) {
    return (
      <Layout>
        <div className="bg-neutral-100 min-h-[calc(100vh-8rem)] flex items-center justify-center px-6">
          <div className="text-center w-full max-w-md">
            <div className="flex justify-center mb-4">
              <svg className="w-[120px] h-[120px] text-[#8A8F98]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.5 7h-3.75l-1.5-2.25c-.375-.563-.938-.75-1.5-.75h-5.5c-.563 0-1.125.188-1.5.75L6.25 7H2.5C1.672 7 1 7.672 1 8.5v11c0 .828.672 1.5 1.5 1.5h18c.828 0 1.5-.672 1.5-1.5v-11c0-.828-.672-1.5-1.5-1.5zM12 18c-2.762 0-5-2.238-5-5s2.238-5 5-5 5 2.238 5 5-2.238 5-5 5zm0-8c-1.656 0-3 1.344-3 3s1.344 3 3 3 3-1.344 3-3-1.344-3-3-3z"/>
              </svg>
            </div>
            <h2 className="text-xl text-[#0F2A44] text-center mt-4 font-bold">
              Start Your Savings Journey
            </h2>
            <p className="text-sm text-[#8A8F98] text-center mt-2 leading-relaxed">
              Create your first goal to begin earning rewards
            </p>
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full h-14 bg-[#F4B400] text-white rounded-lg mt-6 hover:bg-[#E5A800] transition-colors font-semibold"
            >
              Create Goal
            </button>
          </div>
        </div>

        <Modal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          title="Create New Goal"
        >
          <form onSubmit={handleSubmit(handleCreateGoal)} className="space-y-4">
            <Input
              label="Goal Title"
              placeholder="e.g., Emergency Fund"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Target Amount"
              type="number"
              placeholder="Enter amount"
              error={errors.target_amount?.message}
              {...register('target_amount')}
            />
            <Input
              label="Deadline"
              type="date"
              error={errors.deadline?.message}
              {...register('deadline')}
            />
            <Button type="submit" fullWidth>
              Create Goal
            </Button>
          </form>
        </Modal>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 pb-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-4 relative">
          <div className="absolute top-4 left-4 text-2xl">💰</div>
          <div className="mt-8">
            <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">TOTAL BALANCE</p>
            <h2 className="text-neutral-600 text-3xl mb-1">
              {formattedBalance}
            </h2>
            <p className="text-neutral-500 text-xs flex items-center">
              <span className="mr-1">↗</span>
              <span>+{formattedWeeklyIncrease} this week</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setDepositGoalId(null);
              setShowDepositModal(true);
            }}
            className="flex-1 bg-neutral-500 text-white rounded-xl h-14 flex items-center justify-center hover:bg-neutral-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.5 7h-3.75l-1.5-2.25c-.375-.563-.938-.75-1.5-.75h-5.5c-.563 0-1.125.188-1.5.75L6.25 7H2.5C1.672 7 1 7.672 1 8.5v11c0 .828.672 1.5 1.5 1.5h18c.828 0 1.5-.672 1.5-1.5v-11c0-.828-.672-1.5-1.5-1.5z"/>
            </svg>
            Quick Save
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex-1 bg-white text-neutral-900 border-2 border-neutral-900 rounded-xl h-14 flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Goal
          </button>
        </div>

        {/* Active Goals */}
        <section className="mt-8">
          <h3 className="text-xl text-neutral-900 mb-4 font-semibold">Active Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const convertedCurrent = convertCurrency(goal.current_amount, 'KES', currency, exchangeRate);
              const convertedTarget = convertCurrency(goal.target_amount, 'KES', currency, exchangeRate);
              const formattedCurrent = formatCurrency(convertedCurrent, currency);
              const formattedTarget = formatCurrency(convertedTarget, currency);
              
              return (
                <div
                  key={goal.id}
                  onClick={() => navigate(`/goals/${goal.id}`)}
                  className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{goal.icon}</span>
                      <h4 className="text-base text-neutral-900 font-medium">{goal.title}</h4>
                    </div>
                    <span className="text-neutral-600 text-sm font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-neutral-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-neutral-600 text-sm">
                    {formattedCurrent} / {formattedTarget}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Streaks & Achievements */}
        <section className="mt-8 mb-6">
          <h3 className="text-xl text-neutral-900 mb-4 font-semibold">Streaks & Achievements</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <div className="bg-neutral-100 rounded-xl px-4 py-3 flex items-center whitespace-nowrap">
              <span className="text-2xl mr-2">🔥</span>
              <span className="text-sm text-neutral-900">7 Day Streak</span>
            </div>
            <div className="bg-neutral-100 rounded-xl px-4 py-3 flex items-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="bg-neutral-100 rounded-xl px-4 py-3 flex items-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="bg-neutral-100 rounded-xl px-4 py-3 flex items-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="Create New Goal"
      >
        <form onSubmit={handleSubmit(handleCreateGoal)} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g., Emergency Fund"
            error={errors.title?.message}
            {...register('title')}
          />
          <Input
            label="Target Amount"
            type="number"
            placeholder="Enter amount"
            error={errors.target_amount?.message}
            {...register('target_amount')}
          />
          <Input
            label="Deadline"
            type="date"
            error={errors.deadline?.message}
            {...register('deadline')}
          />
          <Button type="submit" fullWidth>
            Create Goal
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Make a Deposit"
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
            {[100, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="secondary"
                onClick={() => setDepositAmount(amount.toString())}
              >
                +{amount}
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
