import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/layout/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { User, Phone, Mail, Shield, LogOut, ChevronRight } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Personal Information',
      onClick: () => console.log('Personal Info'),
    },
    {
      icon: Shield,
      label: 'Security Settings',
      onClick: () => console.log('Security'),
    },
  ];

  return (
    <Layout title="Profile">
      <Container>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="text-center">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">
              {user?.full_name || 'User'}
            </h2>
            <p className="text-text-secondary mb-4">{user?.email}</p>
            <div className="flex justify-center gap-2">
              <Badge
                variant={
                  user?.kyc_status === 'approved'
                    ? 'success'
                    : user?.kyc_status === 'submitted'
                    ? 'warning'
                    : 'info'
                }
              >
                KYC: {user?.kyc_status || 'Not Started'}
              </Badge>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-text mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-text-secondary" />
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="text-text">{user?.email}</p>
                </div>
              </div>
              {user?.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-text-secondary" />
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary">Phone</p>
                    <p className="text-text">{user.phone_number}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-text-secondary" />
                <div className="flex-1">
                  <p className="text-sm text-text-secondary">Referral Code</p>
                  <p className="text-text font-mono">{user?.referral_code}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-text mb-4">Settings</h3>
            <div className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-3 hover:bg-background rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-text-secondary" />
                      <span className="text-text">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-text-secondary" />
                  </button>
                );
              })}
            </div>
          </Card>

          {user?.kyc_status !== 'approved' && (
            <Card className="bg-gradient-to-r from-accent/20 to-accent/10">
              <div className="flex items-start gap-3">
                <Shield size={24} className="text-accent flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-text mb-1">
                    Complete Your KYC
                  </h4>
                  <p className="text-sm text-text-secondary mb-3">
                    Verify your identity to unlock all features
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/kyc/intro')}
                  >
                    Start Verification
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Button
            variant="text"
            onClick={handleSignOut}
            className="w-full text-red-500 hover:bg-red-50"
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </Container>
    </Layout>
  );
};
