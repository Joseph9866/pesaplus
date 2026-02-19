import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/layout/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';

export const KYCPending = () => {
  const navigate = useNavigate();
  const { kycStatus, kycData, refreshKYCStatus } = useAuth();
  const { error, handleError, clearError } = useErrorHandler();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch KYC status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        clearError();
        await refreshKYCStatus();
      } catch (err: any) {
        console.error('Error fetching KYC status:', err);
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [refreshKYCStatus, clearError, handleError]);

  // Poll for status updates every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        await refreshKYCStatus();
      } catch (err) {
        console.error('Error polling KYC status:', err);
        // Don't show error for polling failures, just log them
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pollInterval);
  }, [refreshKYCStatus]);

  // Handle status transitions
  useEffect(() => {
    if (kycStatus === 'approved') {
      // Navigate to KYCComplete page when approved
      navigate('/kyc/complete');
    } else if (kycStatus === 'rejected') {
      // Navigate to rejection page or show rejection reason
      // For now, we'll stay on this page and show the rejection message
    }
  }, [kycStatus, navigate]);

  // Get estimated review time based on status
  const getEstimatedTime = () => {
    if (kycStatus === 'submitted' || kycStatus === 'pending') {
      return 'Usually completed within 24 hours';
    }
    return 'Processing...';
  };

  // Get status display text
  const getStatusText = () => {
    switch (kycStatus) {
      case 'submitted':
      case 'pending':
        return 'Verification in Progress';
      case 'rejected':
        return 'Verification Rejected';
      default:
        return 'Verification Status';
    }
  };

  if (isLoading) {
    return (
      <Layout showBack={false} showNotifications={false} title="Verification Status">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6 py-8">
            <Card className="text-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock size={48} className="text-accent animate-spin" />
              </div>
              <p className="text-text-secondary">Loading verification status...</p>
            </Card>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout showBack={false} showNotifications={false} title="Verification Status">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6 py-8">
            <Card className="text-center">
              <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={48} className="text-error" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-3">Error Loading Status</h2>
              <p className="text-text-secondary mb-6">{error?.message || 'An error occurred'}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Card>
          </div>
        </Container>
      </Layout>
    );
  }

  // Show rejection message if status is rejected
  if (kycStatus === 'rejected') {
    return (
      <Layout showBack={false} showNotifications={false} title="Verification Rejected">
        <Container>
          <div className="max-w-2xl mx-auto space-y-6 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="text-center">
                <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={48} className="text-error" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-3">
                  Verification Rejected
                </h2>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  {kycData?.rejection_reason || 'Your verification was rejected. Please review your information and try again.'}
                </p>
              </Card>
            </motion.div>

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

            <div className="space-y-3">
              <Button onClick={() => navigate('/kyc/personal-info')} fullWidth>
                Update Information
              </Button>
              <Button onClick={() => navigate('/dashboard')} fullWidth variant="outline">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </Container>
      </Layout>
    );
  }

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
                {getStatusText()}
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Thank you for submitting your documents. Our team is reviewing your information and will notify you once complete.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium text-sm">
                <Clock size={16} />
                <span>{getEstimatedTime()}</span>
              </div>
              {kycData?.submitted_at && (
                <p className="text-xs text-text-secondary mt-4">
                  Submitted on {new Date(kycData.submitted_at).toLocaleDateString()}
                </p>
              )}
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
