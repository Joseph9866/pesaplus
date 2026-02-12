import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChallengeCard } from '../components/features/ChallengeCard';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ChallengeWithProgress, Referral } from '../types';
import { Users, Gift, Share2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

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

  if (loading) {
    return (
      <Layout title="Social">
        <Container>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Social">
      <Container>
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'challenges' ? 'primary' : 'text'}
              onClick={() => setActiveTab('challenges')}
              className="flex-1"
            >
              <Users size={18} className="mr-2" />
              Challenges
            </Button>
            <Button
              variant={activeTab === 'referrals' ? 'primary' : 'text'}
              onClick={() => setActiveTab('referrals')}
              className="flex-1"
            >
              <Gift size={18} className="mr-2" />
              Referrals
            </Button>
          </div>

          {activeTab === 'challenges' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5">
                <div className="flex items-start gap-4">
                  <Users size={32} className="text-secondary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text mb-2">
                      Join Savings Challenges
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Compete with other savers, achieve your goals together, and earn bonus rewards!
                    </p>
                  </div>
                </div>
              </Card>

              {challenges.length > 0 ? (
                <div className="space-y-4">
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
                <Card className="text-center py-12">
                  <Users size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="font-semibold text-text mb-2">No Active Challenges</h3>
                  <p className="text-text-secondary">
                    Check back soon for new savings challenges!
                  </p>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'referrals' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-br from-accent/20 to-accent/10">
                <div className="text-center">
                  <Gift size={48} className="text-accent mx-auto mb-4" />
                  <h3 className="font-semibold text-text mb-2">
                    Invite Friends & Earn Rewards
                  </h3>
                  <p className="text-sm text-text-secondary mb-6">
                    Share your referral code and get 3 bonus lottery entries for each friend who joins!
                  </p>
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <p className="text-xs text-text-secondary mb-2">Your Referral Code</p>
                    <p className="text-3xl font-bold text-text mb-4">
                      {user?.referral_code}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={handleCopyReferralCode}
                        className="flex-1"
                      >
                        {copied ? (
                          <>
                            <Check size={18} className="mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={18} className="mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                      <Button onClick={handleShareReferral} className="flex-1">
                        <Share2 size={18} className="mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text">Your Referrals</h3>
                  <Badge variant="secondary">{referrals.length}</Badge>
                </div>
                {referrals.length > 0 ? (
                  <div className="space-y-3">
                    {referrals.map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-3 bg-background rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-text">Friend Joined</p>
                          <p className="text-sm text-text-secondary">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={referral.reward_claimed ? 'success' : 'warning'}>
                          {referral.reward_claimed ? 'Claimed' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users size={48} className="text-text-secondary mx-auto mb-3" />
                    <p className="text-text-secondary">No referrals yet</p>
                    <p className="text-sm text-text-secondary mt-1">
                      Start inviting friends to earn rewards!
                    </p>
                  </div>
                )}
              </Card>

              <Card className="bg-secondary/5">
                <h4 className="font-semibold text-text mb-3">How It Works</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      1
                    </div>
                    <p className="text-sm text-text-secondary">
                      Share your unique referral code with friends
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      2
                    </div>
                    <p className="text-sm text-text-secondary">
                      They sign up using your code
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      3
                    </div>
                    <p className="text-sm text-text-secondary">
                      You both get 3 bonus lottery entries!
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </Container>
    </Layout>
  );
};
