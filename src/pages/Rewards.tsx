import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LotteryEntry } from '../types';
import { Trophy, Ticket, Clock, Gift, Sparkles, Target, Star, Lock, HelpCircle, Crown, Medal, Gem, Flame, Rocket, Shield, Heart, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { useFormattedCurrency } from '../utils/currency';

type TabType = 'badges' | 'leaderboard' | 'lottery';

export const Rewards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('badges');
  const [entries, setEntries] = useState<LotteryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Format leaderboard amounts using the currency hook
  const leaderboardAmount1 = useFormattedCurrency(125000, 'KES');
  const leaderboardAmount2 = useFormattedCurrency(98500, 'KES');
  const leaderboardAmount3 = useFormattedCurrency(87200, 'KES');
  const leaderboardAmount4 = useFormattedCurrency(76800, 'KES');
  const leaderboardAmount5 = useFormattedCurrency(65400, 'KES');

  // Format prize amounts using the currency hook
  const prize1st = useFormattedCurrency(100000, 'KES');
  const prize2nd = useFormattedCurrency(50000, 'KES');
  const prize3rd = useFormattedCurrency(25000, 'KES');

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
    { icon: Trophy, name: 'First Saver', unlocked: true, date: 'Jan 15, 2024' },
    { icon: Target, name: 'Goal Crusher', unlocked: true, date: 'Jan 20, 2024' },
    { icon: Star, name: 'Streak Master', unlocked: true, date: 'Feb 1, 2024' },
    { icon: Crown, name: 'VIP Member', unlocked: false, date: null },
    { icon: Medal, name: 'Top Performer', unlocked: false, date: null },
    { icon: Gem, name: 'Diamond Saver', unlocked: false, date: null },
    { icon: Flame, name: 'Hot Streak', unlocked: false, date: null },
    { icon: Rocket, name: 'Fast Starter', unlocked: false, date: null },
    { icon: Shield, name: 'Protected', unlocked: false, date: null },
    { icon: Heart, name: 'Community Hero', unlocked: false, date: null },
    { icon: HelpCircle, name: 'Mystery Badge', unlocked: false, date: null },
    { icon: Award, name: 'Champion', unlocked: false, date: null },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Sarah M.', amount: leaderboardAmount1, avatar: '👩' },
    { rank: 2, name: 'John K.', amount: leaderboardAmount2, avatar: '👨' },
    { rank: 3, name: 'Mary W.', amount: leaderboardAmount3, avatar: '👩' },
    { rank: 4, name: 'David O.', amount: leaderboardAmount4, avatar: '👨' },
    { rank: 5, name: 'Grace N.', amount: leaderboardAmount5, avatar: '👩' },
  ];

  const recentActivity = [
    { action: 'Unlocked "Streak Master"', time: '2 days ago' },
    { action: 'Earned 5 lottery entries', time: '5 days ago' },
    { action: 'Unlocked "Goal Crusher"', time: '1 week ago' },
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FA774]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Rewards">
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Underline-style Tab Bar */}
          <div className="flex border-b border-gray-200 mb-4 sm:mb-6 md:mb-8">
            <button
              onClick={() => setActiveTab('badges')}
              className={`flex-1 pb-2 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors font-inter ${
                activeTab === 'badges'
                  ? 'text-[#1FA774] border-b-2 border-[#1FA774]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Badges
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 pb-2 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors font-inter ${
                activeTab === 'leaderboard'
                  ? 'text-[#1FA774] border-b-2 border-[#1FA774]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('lottery')}
              className={`flex-1 pb-2 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors font-inter ${
                activeTab === 'lottery'
                  ? 'text-[#1FA774] border-b-2 border-[#1FA774]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lottery
            </button>
          </div>
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 sm:gap-6">
            {/* Left Column (70%) - Main Content */}
            <div className="lg:col-span-7">
              {activeTab === 'badges' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                  {badges.map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className={`bg-white border border-[#E5E7EB] rounded-lg p-3 sm:p-4 flex flex-col items-center justify-center ${
                          !badge.unlocked ? 'opacity-40 grayscale' : ''
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                              badge.unlocked
                                ? 'bg-gradient-to-br from-[#1FA774] to-[#15804f]'
                                : 'bg-gray-300'
                            }`}
                          >
                            <Icon size={24} className="text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
                          </div>
                          {!badge.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock size={20} className="text-gray-600 sm:w-6 sm:h-6" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 text-center mt-2 sm:mt-3 font-inter">
                          {badge.name}
                        </p>
                        {badge.unlocked && badge.date && (
                          <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-0.5 sm:mt-1 font-inter">
                            {badge.date}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-2 sm:space-y-3">
                  {leaderboardData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="bg-white border border-[#E5E7EB] rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
                    >
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 text-gray-900 font-semibold text-xs sm:text-sm font-inter">
                        {item.rank}
                      </div>
                      <div className="text-xl sm:text-2xl">{item.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate font-inter">{item.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 font-inter">{item.amount}</p>
                      </div>
                      {item.rank <= 3 && (
                        <Trophy
                          size={18}
                          className={`sm:w-5 sm:h-5 flex-shrink-0 ${
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
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-br from-[#F4B400] to-[#E5A800] text-white rounded-lg p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div>
                        <p className="text-white/80 text-[10px] sm:text-xs mb-1 font-inter">Your Lottery Entries</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-inter">{user?.lottery_entries || 0}</h2>
                      </div>
                      <Trophy size={32} className="text-white/80 sm:w-10 sm:h-10" />
                    </div>
                    <div className="flex items-center gap-2 text-white/90 text-xs sm:text-sm font-inter">
                      <Clock size={14} className="sm:w-4 sm:h-4" />
                      <span>Next draw in {getDaysUntilDraw()} days</span>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <p className="text-xs sm:text-sm text-white/90 font-inter">
                        Draw Date: <strong className="text-white">{getNextDrawDate()}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 md:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 font-inter">Prize Pool</h3>
                      <span className="text-[10px] sm:text-xs bg-[#F4B400] text-white px-2 sm:px-3 py-1 rounded-full font-inter">This Month</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-[#F4B400]/10 rounded-lg">
                        <p className="text-base sm:text-lg md:text-xl font-bold text-[#F4B400] mb-1 font-inter">{prize1st}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-inter">1st Prize</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-100 rounded-lg">
                        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 font-inter">{prize2nd}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-inter">2nd Prize</p>
                      </div>
                      <div className="text-center p-2 sm:p-3 md:p-4 bg-gray-100 rounded-lg">
                        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 font-inter">{prize3rd}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 font-inter">3rd Prize</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5 md:p-6">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 font-inter">
                      How to Earn More Entries
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Gift size={16} className="text-gray-900 sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 truncate font-inter">Complete savings goals</span>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 font-inter">+5</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Trophy size={16} className="text-gray-900 sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 truncate font-inter">Join savings challenges</span>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 font-inter">+10</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Sparkles size={16} className="text-gray-900 sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 truncate font-inter">Refer friends</span>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 font-inter">+3</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Ticket size={16} className="text-gray-900 sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900 truncate font-inter">Maintain savings streak</span>
                        </div>
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-900 px-2 sm:px-3 py-1 rounded-full flex-shrink-0 font-inter">+2/week</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (30%) - Rewards Summary Sidebar */}
            <div className="lg:col-span-3 space-y-3 sm:space-y-4 order-first lg:order-last">
              {/* Total Points Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 font-inter">Total Points</h3>
                  <TrendingUp size={16} className="text-[#1FA774] sm:w-[18px] sm:h-[18px]" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 font-inter">1,250</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-inter">+150 this month</p>
              </div>

              {/* Next Achievement Progress */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 font-inter">Next Achievement</h3>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1FA774] to-[#15804f] rounded-full flex items-center justify-center opacity-40">
                    <Crown size={20} className="text-white sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 font-inter">VIP Member</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 font-inter">75% complete</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div className="bg-[#1FA774] h-1.5 sm:h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 font-inter">Save 250 more to unlock</p>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 font-inter">Recent Activity</h3>
                <div className="space-y-2 sm:space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-2 sm:gap-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1FA774] rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-900 font-inter">{activity.action}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-inter">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
