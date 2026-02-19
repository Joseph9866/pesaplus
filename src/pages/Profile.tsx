import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { ProfileForm } from '../components/features/ProfileForm';
import { User, Shield, LogOut, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, refreshUser, kycStatus, kycData, refreshKYCStatus } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateSuccess = async () => {
    await refreshUser();
  };

  // Refresh KYC status on mount
  useEffect(() => {
    refreshKYCStatus();
  }, []);

  // Get KYC status display info
  const getKYCStatusInfo = () => {
    switch (kycStatus) {
      case 'approved':
        return {
          variant: 'success' as const,
          label: 'Verified',
          icon: CheckCircle,
          color: 'text-green-600',
        };
      case 'submitted':
      case 'pending':
        return {
          variant: 'warning' as const,
          label: 'Pending Review',
          icon: Clock,
          color: 'text-yellow-600',
        };
      case 'rejected':
        return {
          variant: 'error' as const,
          label: 'Rejected',
          icon: AlertCircle,
          color: 'text-red-600',
        };
      case 'in_progress':
        return {
          variant: 'info' as const,
          label: 'In Progress',
          icon: FileText,
          color: 'text-blue-600',
        };
      default:
        return {
          variant: 'info' as const,
          label: 'Not Started',
          icon: Shield,
          color: 'text-gray-600',
        };
    }
  };

  const statusInfo = getKYCStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (!user) {
    return null;
  }

  return (
    <Layout title="Profile" showBack backPath="/dashboard">
      <Container>
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-3 sm:py-4 px-3 sm:px-4">
          {/* Profile Header Card */}
          <Card className="text-center p-6 sm:p-8 bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-none">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg border-4 border-white/20">
              <User size={48} className="text-white sm:w-16 sm:h-16" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {user.full_name || 'User'}
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-3 sm:mb-4">{user.email}</p>
            <div className="flex justify-center gap-2 sm:gap-3">
              <Badge variant={statusInfo.variant}>
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={14} />
                  <span>KYC: {statusInfo.label}</span>
                </div>
              </Badge>
            </div>
          </Card>

          {/* Profile Form */}
          <ProfileForm user={user} onUpdateSuccess={handleUpdateSuccess} />

          {/* KYC Status Card */}
          {kycStatus === 'not_started' && (
            <Card className="bg-gradient-to-r from-[#F4B400]/10 to-[#E5A800]/10 border-2 border-[#F4B400]/30 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-[#F4B400]/20 rounded-lg flex-shrink-0">
                  <Shield size={24} className="text-[#0F2A44] sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0F2A44] text-base sm:text-lg mb-2">
                    Complete Your KYC Verification
                  </h4>
                  <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                    Verify your identity to unlock all features and increase your account limits
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/intro')}
                    className="bg-[#F4B400] hover:bg-[#E5A800] text-white font-semibold text-sm sm:text-base"
                  >
                    Start Verification
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {kycStatus === 'in_progress' && (
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-200 rounded-lg flex-shrink-0">
                  <FileText size={24} className="text-blue-700 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-base sm:text-lg mb-2">
                    Continue Your KYC Verification
                  </h4>
                  <p className="text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    You have an incomplete KYC application. Resume where you left off.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/intro')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base"
                  >
                    Resume Verification
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {(kycStatus === 'submitted' || kycStatus === 'pending') && (
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-yellow-200 rounded-lg flex-shrink-0">
                  <Clock size={24} className="text-yellow-700 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 text-base sm:text-lg mb-2">
                    KYC Verification Pending
                  </h4>
                  <p className="text-yellow-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Your KYC application is under review. We'll notify you once it's processed.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/pending')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm sm:text-base"
                  >
                    View Status
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {kycStatus === 'approved' && (
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-green-200 rounded-lg flex-shrink-0">
                  <CheckCircle size={24} className="text-green-700 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 text-base sm:text-lg mb-2">
                    KYC Verification Complete
                  </h4>
                  <p className="text-green-800 mb-3 sm:mb-4 text-sm sm:text-base">
                    Your identity has been verified. You have full access to all features.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/complete')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {kycStatus === 'rejected' && (
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-red-200 rounded-lg flex-shrink-0">
                  <AlertCircle size={24} className="text-red-700 sm:w-7 sm:h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 text-base sm:text-lg mb-2">
                    KYC Verification Rejected
                  </h4>
                  <p className="text-red-800 mb-2 text-sm sm:text-base">
                    Your KYC application was rejected. Please review the feedback and resubmit.
                  </p>
                  {kycData?.rejection_reason && (
                    <p className="text-red-700 mb-3 sm:mb-4 text-sm sm:text-base font-medium bg-red-50 p-2 rounded border border-red-200">
                      Reason: {kycData.rejection_reason}
                    </p>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/intro')}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base"
                  >
                    Resubmit Application
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Sign Out Button */}
          <div className="flex justify-center pt-3 sm:pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:border-red-600 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </Container>
    </Layout>
  );
};
