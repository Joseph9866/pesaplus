import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChallengeCard } from '../components/features/ChallengeCard';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChallengeWithProgress, Referral } from '../types';
import { Users, Gift, Share2, Copy, Check, TrendingUp, Wallet, Target, Activity } from 'lucide-react';
import { useFormattedCurrency } from '../utils/currency';

export const Social = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'challenges' | 'referrals'>('challenges');
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [challengesResult, referralsResult] = await Promise.all([
        supabase
          .from('challenges')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false }),
        supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user?.id)
          .order('created_at', { ascending: false }),
      ]);

      if (challengesResult.error) throw challengesResult.error;
      if (referralsResult.error) throw referralsResult.error;

      const challengesWithProgress = challengesResult.data?.map((challenge) => ({
        ...challenge,
        progress_percentage: 0,
        participants_count: 0,
      })) || [];

      setChallenges(challengesWithProgress);
      setReferrals(referralsResult.data || []);
    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareReferral = async () => {
    const shareData = {
      title: 'Join PesaPlus',
      text: `Use my referral code ${user?.referral_code} and get bonus entries!`,
      url: `https://pesaplus.com/signup?ref=${user?.referral_code}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  // Mock data for savings overview
  const totalSavings = 45000;
  const activeChallenges = challenges.filter(c => c.participant).length;
  const totalRewards = referrals.length * 3;

  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'challenge', text: 'Joined "Save for Holiday"', time: '2 hours ago' },
    { id: 2, type: 'referral', text: 'Friend joined via your code', time: '1 day ago' },
    { id: 3, type: 'reward', text: 'Earned 3 lottery entries', time: '2 days ago' },
    { id: 4, type: 'challenge', text: 'Completed "Monthly Saver"', time: '3 days ago' },
  ];

  // Mock referral trends data
  const referralTrends = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 7 },
    { month: 'May', count: 4 },
    { month: 'Jun', count: referrals.length },
  ];

  const formattedSavings = useFormattedCurrency(totalSavings);

  if (loading) {
    return (
      <Layout title="Social Savings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FA774]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Social Savings">
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Tab Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 h-12 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 font-inter ${
                activeTab === 'challenges'
                  ? 'bg-[#1FA774] text-white shadow-md'
                  : 'bg-white border border-[#E2E8F0] text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Users size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Challenges</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`flex-1 h-12 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 font-inter ${
                activeTab === 'referrals'
                  ? 'bg-[#1FA774] text-white shadow-md'
                  : 'bg-white border border-[#E2E8F0] text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <Gift size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Referral Program</span>
              </div>
            </button>
          </div>

          {/* Challenges Tab Content */}
          {activeTab === 'challenges' && (
            <div>
              {/* Savings Overview Widget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-[#64748B] mb-1 font-inter">Total Savings</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900 font-inter">{formattedSavings}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wallet className="text-[#1FA774]" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-[#64748B] mb-1 font-inter">Active Challenges</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900 font-inter">{activeChallenges}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="text-blue-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-[#64748B] mb-1 font-inter">Lottery Entries</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900 font-inter">{totalRewards}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Gift className="text-[#F4B400]" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges Section */}
              <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-inter">Join Savings Challenges</h2>

                {challenges.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {challenges.map((challenge) => (
                      <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        onJoin={() => console.log('Join challenge:', challenge.id)}
                        onView={() => console.log('View challenge:', challenge.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Users size={40} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-inter">No Active Challenges</h3>
                    <p className="text-xs sm:text-sm text-[#64748B] font-inter">
                      Check back soon for new savings challenges!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Referral Program Tab Content */}
          {activeTab === 'referrals' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
              {/* Left Column - Invite Friends */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                {/* Invite Friends Card */}
                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-inter">Invite Friends & Earn</h2>

                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Gift className="text-[#F4B400]" size={28} />
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 font-inter">
                      Earn Rewards
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] mb-3 sm:mb-4 font-inter px-4">
                      Get 3 bonus lottery entries for each friend who joins!
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-md p-3 sm:p-4 mb-3 sm:mb-4">
                    <p className="text-xs text-[#64748B] mb-2 text-center font-inter">Your Referral Code</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center font-inter">
                      {user?.referral_code}
                    </p>
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <button
                        onClick={handleCopyReferralCode}
                        className="flex items-center justify-center gap-2 sm:gap-3 h-10 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 border border-[#E2E8F0] text-gray-700 hover:border-gray-400 hover:shadow-md font-inter text-sm sm:text-base"
                      >
                        {copied ? (
                          <>
                            <Check size={16} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleShareReferral}
                        className="flex items-center justify-center gap-2 sm:gap-3 h-10 px-4 sm:px-6 rounded-md font-medium transition-all duration-150 bg-[#1FA774] text-white hover:bg-[#1a8c62] hover:shadow-md font-inter text-sm sm:text-base"
                      >
                        <Share2 size={16} />
                        <span>Share Link</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-md p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 text-xs sm:text-sm font-inter">How It Works</h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#1FA774] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          1
                        </div>
                        <p className="text-xs text-gray-700 font-inter">
                          Share your unique referral code
                        </p>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#1FA774] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          2
                        </div>
                        <p className="text-xs text-gray-700 font-inter">
                          Friends sign up using your code
                        </p>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-[#1FA774] rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                        <p className="text-xs text-gray-700 font-inter">
                          You both get 3 bonus entries!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Referral Stats */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Referral Trends Card */}
                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-inter">Referral Trends</h2>

                  <div className="space-y-3 sm:space-y-4">
                    {referralTrends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm text-[#64748B] w-10 sm:w-12 font-inter">{trend.month}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-7 sm:h-8 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#1FA774] to-[#15804f] h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${Math.max((trend.count / 10) * 100, 10)}%` }}
                          >
                            <span className="text-xs text-white font-medium font-inter">{trend.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-[#64748B] font-inter">Total Referrals</span>
                      <span className="text-xl sm:text-2xl font-semibold text-[#1FA774] font-inter">{referrals.length}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Referrals List */}
                <div className="bg-white rounded-md border border-[#E2E8F0] shadow-sm p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 font-inter">Recent Referrals</h2>

                  {referrals.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                      {referrals.map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1FA774] rounded-full flex items-center justify-center">
                              <Users className="text-white" size={16} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-xs sm:text-sm font-inter">Friend Joined</p>
                              <p className="text-xs text-[#64748B] font-inter">
                                {new Date(referral.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={referral.reward_claimed ? 'success' : 'warning'}>
                            {referral.reward_claimed ? 'Claimed' : 'Pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <Users size={40} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-xs sm:text-sm text-[#64748B] font-inter">No referrals yet</p>
                      <p className="text-xs text-[#64748B] mt-1 font-inter">
                        Start inviting friends to earn rewards!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
