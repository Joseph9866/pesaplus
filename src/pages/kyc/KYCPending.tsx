import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export const KYCPending = () => {
  const navigate = useNavigate();

  return (
    <Layout showBack={false} showNotifications={false} title="Verification Pending">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Clock size={48} className="text-accent" />
              </motion.div>
              <h2 className="text-2xl font-bold text-text mb-3">
                Verification in Progress
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Thank you for submitting your documents. Our team is reviewing your information and will notify you within 24 hours.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium text-sm">
                <Clock size={16} />
                <span>Usually completed within 24 hours</span>
              </div>
            </Card>
          </motion.div>

          <Card>
            <h3 className="font-semibold text-text mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-text">Document Review</p>
                  <p className="text-sm text-text-secondary">
                    Our team will verify your submitted documents
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-text">Email Notification</p>
                  <p className="text-sm text-text-secondary">
                    You'll receive an email once verification is complete
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="text-secondary font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-text">Account Upgrade</p>
                  <p className="text-sm text-text-secondary">
                    Access higher limits and exclusive rewards
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-secondary/5">
            <h3 className="font-semibold text-text mb-3">Need Help?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text">Email Support</p>
                  <p className="text-sm text-text-secondary">support@pesaplus.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text">Phone Support</p>
                  <p className="text-sm text-text-secondary">+254 700 000 000</p>
                </div>
              </div>
            </div>
          </Card>

          <Button onClick={() => navigate('/dashboard')} fullWidth>
            Return to Dashboard
          </Button>
        </div>
      </Container>
    </Layout>
  );
};
