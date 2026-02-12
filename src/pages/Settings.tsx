import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  CreditCard,
  DollarSign,
  Bell,
  Globe,
  Lock,
  Shield,
  Fingerprint,
  HelpCircle,
  MessageCircle,
  FileText,
  ChevronRight,
  Banknote,
} from 'lucide-react';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Layout title="Settings" showBack={true}>
      <main className="pb-6 px-4">
        {/* Profile Section */}
        <div className="mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${user?.id || '42857'}`}
              alt="Profile Avatar"
              className="w-20 h-20 rounded-full mx-auto border-2 border-neutral-200"
            />
            <h2 className="text-lg text-neutral-900 mt-3 font-semibold">
              {user?.full_name || 'John Doe'}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {user?.email || 'john.doe@email.com'}
            </p>
            <button className="text-sm text-neutral-900 mt-3 hover:underline">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Section */}
        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <User className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Personal Information</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <CreditCard className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Payment Methods</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <Banknote className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Withdrawal Options</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <Bell className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Notifications</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <Globe className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Language</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-neutral-500 mr-2">English</span>
                <ChevronRight className="text-neutral-400" size={16} />
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <DollarSign className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Currency</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-neutral-500 mr-2">KES</span>
                <ChevronRight className="text-neutral-400" size={16} />
              </div>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <Lock className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Change Password</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <div className="flex items-center">
                <Shield className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Two-Factor Auth</span>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                  twoFactorEnabled ? 'bg-neutral-500' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    twoFactorEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <Fingerprint className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Biometric Login</span>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className={`relative inline-block w-12 h-6 rounded-full transition-colors ${
                  biometricEnabled ? 'bg-neutral-500' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    biometricEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <HelpCircle className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Help Center</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <MessageCircle className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Contact Support</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center">
                <FileText className="text-neutral-600 w-6" size={18} />
                <span className="ml-3 text-sm text-neutral-900">Terms & Privacy</span>
              </div>
              <ChevronRight className="text-neutral-400" size={16} />
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="mt-6 mb-6">
          <button
            onClick={handleSignOut}
            className="w-full bg-white border-2 border-neutral-600 text-neutral-600 py-4 rounded-xl hover:bg-neutral-50 transition-colors font-semibold"
          >
            Log Out
          </button>
        </div>
      </main>
    </Layout>
  );
};
