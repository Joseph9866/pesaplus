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
        <div className="max-w-4xl mx-auto space-y-8 py-4">
          {/* Profile Header Card */}
          <Card className="text-center p-8 bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] border-none">
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-4 border-white/20">
              <User size={64} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {user.full_name || 'User'}
            </h2>
            <p className="text-white/80 text-lg mb-4">{user.email}</p>
            <div className="flex justify-center gap-3">
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
            <Card className="bg-gradient-to-r from-[#F4B400]/10 to-[#E5A800]/10 border-2 border-[#F4B400]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#F4B400]/20 rounded-lg">
                  <Shield size={28} className="text-[#0F2A44]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0F2A44] text-lg mb-2">
                    Complete Your KYC Verification
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Verify your identity to unlock all features and increase your account limits
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/intro')}
                    className="bg-[#F4B400] hover:bg-[#E5A800] text-white font-semibold"
                  >
                    Start Verification
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Sign Out Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="text"
              onClick={handleSignOut}
              className="text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-medium transition-colors border border-red-200 hover:border-red-300"
            >
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Container>
    </Layout>
  );
};
