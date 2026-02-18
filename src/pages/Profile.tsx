import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { ProfileForm } from '../components/features/ProfileForm';
import { User, Shield, LogOut } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, refreshUser } = useAuth();

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

  if (!user) {
    return null;
  }

  return (
    <Layout title="Profile" showBack backPath="/settings">
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
              <Badge
                variant={
                  user.kyc_status === 'approved'
                    ? 'success'
                    : user.kyc_status === 'submitted'
                    ? 'warning'
                    : 'info'
                }
              >
                KYC: {user.kyc_status || 'Not Started'}
              </Badge>
            </div>
          </Card>

          {/* Profile Form */}
          <ProfileForm user={user} onUpdateSuccess={handleUpdateSuccess} />

          {/* KYC Prompt */}
          {user.kyc_status !== 'approved' && (
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
