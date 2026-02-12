import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle, TrendingUp, Trophy, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Higher Savings Limits',
    description: 'Save up to KES 1,000,000 per month',
  },
  {
    icon: Trophy,
    title: 'Exclusive Rewards',
    description: 'Get 5x more lottery entries',
  },
  {
    icon: Gift,
    title: 'Premium Features',
    description: 'Access to exclusive challenges and bonuses',
  },
];

export const KYCComplete = () => {
  const navigate = useNavigate();

  return (
    <Layout showBack={false} showNotifications={false} title="Verification Complete">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center bg-gradient-to-br from-secondary/10 to-secondary/5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={48} className="text-white" />
              </motion.div>
              <Badge variant="success" className="mb-4">
                Verified Account
              </Badge>
              <h2 className="text-2xl font-bold text-text mb-3">
                Verification Successful!
              </h2>
              <p className="text-text-secondary max-w-md mx-auto">
                Congratulations! Your identity has been verified. You now have access to all premium features and benefits.
              </p>
            </Card>
          </motion.div>

          <Card>
            <h3 className="font-semibold text-text mb-4 text-center">
              Your New Benefits
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="bg-background">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                          <Icon size={24} className="text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-text mb-1">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-text-secondary">
                            {benefit.description}
                          </p>
                        </div>
                        <CheckCircle size={20} className="text-secondary" />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-accent/20 to-accent/10">
            <div className="flex items-center gap-3">
              <Gift size={32} className="text-accent" />
              <div className="flex-1">
                <h4 className="font-semibold text-text mb-1">
                  Welcome Bonus
                </h4>
                <p className="text-sm text-text-secondary">
                  You've received 10 bonus lottery entries as a welcome gift!
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/rewards')}
              className="flex-1"
            >
              View Rewards
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
};
