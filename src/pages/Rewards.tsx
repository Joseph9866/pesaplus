import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LotteryEntry } from '../types';
import { Trophy, Ticket, Clock, Gift, Sparkles, Target, Star, Lock, HelpCircle, Crown, Medal, Gem, Flame, Rocket, Shield, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';

type TabType = 'badges' | 'leaderboard' | 'lottery';

export const Rewards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('badges');
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching lottery entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const badges = [
    { icon: Trophy, name: 'First Saver', unlocked: true, date: 'Jan 15' },
    { icon: Target, name: 'Goal Crusher', unlocked: true, date: 'Jan 20' },
    { icon: Star, name: 'Streak Master', unlocked: true, date: 'Feb 1' },
    { icon: Lock, name: 'Locked', unlocked: false },
    { icon: HelpCircle, name: 'Mystery Badge', unlocked: false },
    { icon: Crown, name: 'Locked', unlocked: false },
    { icon: Medal, name: 'Locked', unlocked: false },
    { icon: Gem, name: 'Locked', unlocked: false },
    { icon: Flame, name: 'Locked', unlocked: false },
    { icon: Rocket, name: 'Locked', unlocked: false },
    { icon: Shield, name: 'Locked', unlocked: false },
    { icon: Heart, name: 'Locked', unlocked: false },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Sarah M.', amount: 'KES 125,000', avatar: '👩' },
    { rank: 2, name: 'John K.', amount: 'KES 98,500', avatar: '👨' },
    { rank: 3, name: 'Mary W.', amount: 'KES 87,200', avatar: '👩' },
    { rank: 4, name: 'David O.', amount: 'KES 76,800', avatar: '👨' },
    { rank: 5, name: 'Grace N.', amount: 'KES 65,400', avatar: '👩' },
  ];

  const getNextDrawDate = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return nextMonth.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilDraw = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const diff = nextMonth.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <Layout title="Rewards">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Rewards">
      {/* Tab Navigation */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 w-full border-b border-neutral-200">
        <div className="flex max-w-7xl mx-auto">
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-5 sm:py-4 text-xs sm:text-sm ${
              activeTab === 'badges'
                ? 'text-neutral-900 border-b-2 border-neutral-900'
                : 'text-neutral-500'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm ${
              activeTab === 'leaderboard'
                ? 'text-neutral-900 border-b-2 border-neutral-900'
                : 'text-neutral-500'
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('lottery')}
            className={`flex-1 py-3 sm:py-4 text-xs sm:text-sm ${
              activeTab === 'lottery'
                ? 'text-neutral-900 border-b-2 border-neutral-900'
                : 'text-neutral-500'
            }`}
          >
            Lottery
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 px-4 pb-8 max-w-7xl mx-auto">
        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex flex-col items-center ${!badge.unlocked ? 'opacity-50' : ''}`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-neutral-800 shadow-lg'
                        : 'bg-neutral-400'
                    }`}
                  >
                    <Icon size={28} className="text-white sm:w-8 sm:h-8" />
                  </div>
                  <p className={`text-xs sm:text-sm text-center mt-2 ${badge.unlocked ? 'text-neutral-900' : 'text-neutral-600'}`}>
                    {badge.name}
                  </p>
                  {badge.unlocked && badge.date && (
                    <p className="text-[10px] sm:text-xs text-center text-neutral-500">
                      Unlocked {badge.date}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-3 max-w-2xl mx-auto">
            {leaderboardData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-100 text-neutral-900 font-semibold text-sm sm:text-base">
                  {item.rank}
                </div>
                <div className="text-xl sm:text-2xl">{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-neutral-900 truncate">{item.name}</p>
                  <p className="text-xs sm:text-sm text-neutral-500">{item.amount}</p>
                </div>
                {item.rank <= 3 && (
                  <Trophy
                    size={20}
                    className={`sm:w-6 sm:h-6 flex-shrink-0 ${
                      item.rank === 1
                        ? 'text-yellow-500'
                        : item.rank === 2
                        ? 'text-gray-400'
                        : 'text-orange-600'
                    }`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'lottery' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#F4B400] to-[#E5A800] text-white rounded-2xl p-5 sm:p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/80 text-xs sm:text-sm mb-1">Your Lottery Entries</p>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">{user?.lottery_entries || 0}</h2>
                </div>
                <Trophy size={40} className="text-white/80 sm:w-12 sm:h-12 md:w-14 md:h-14" />
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm">
                <Clock size={14} className="sm:w-4 sm:h-4" />
                <span>Next draw in {getDaysUntilDraw()} days</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs sm:text-sm text-white/90">
                  Draw Date: <strong className="text-white">{getNextDrawDate()}</strong>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900">Prize Pool</h3>
                <span className="text-[10px] sm:text-xs bg-[#F4B400] text-white px-2 sm:px-3 py-1 rounded-full">This Month</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <div className="text-center p-2 sm:p-3 md:p-4 bg-[#F4B400]/10 rounded-xl">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-[#F4B400] mb-1">KES 100K</p>
                  <p className="text-[10px] sm:text-xs text-neutral-600">1st Prize</p>
                </div>
                <div className="text-center p-2 sm:p-3 md:p-4 bg-neutral-100 rounded-xl">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 mb-1">KES 50K</p>
                  <p className="text-[10px] sm:text-xs text-neutral-600">2nd Prize</p>
                </div>
                <div className="text-center p-2 sm:p-3 md:p-4 bg-neutral-100 rounded-xl">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 mb-1">KES 25K</p>
                  <p className="text-[10px] sm:text-xs text-neutral-600">3rd Prize</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 mb-4">
                How to Earn More Entries
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Gift size={16} className="text-neutral-900 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-900 truncate">Complete savings goals</span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-neutral-100 text-neutral-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">+5</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Trophy size={16} className="text-neutral-900 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-900 truncate">Join savings challenges</span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-neutral-100 text-neutral-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">+10</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles size={16} className="text-neutral-900 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-900 truncate">Refer friends</span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-neutral-100 text-neutral-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">+3</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Ticket size={16} className="text-neutral-900 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-900 truncate">Maintain savings streak</span>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-neutral-100 text-neutral-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0">+2/week</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
