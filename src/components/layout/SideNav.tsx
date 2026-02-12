import { Home, Target, Gift, Users, User, LogOut, Settings as SettingsIcon, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Gift, label: 'Rewards', path: '/rewards' },
  { icon: Users, label: 'Social', path: '/social' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' },
];

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNav = ({ isOpen, onClose }: SideNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-out Menu */}
      <nav
        className={`fixed left-0 top-0 bottom-0 w-[280px] bg-white flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
       
        <div className="flex-1 p-6 space-y-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
                            (item.path === '/dashboard' && location.pathname === '/');

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all min-h-touch ${
                  isActive
                    ? 'bg-teal-100 text-teal-600 font-medium'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors min-h-touch"
          >
            <LogOut size={22} />
            <span className="text-base">Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
};
