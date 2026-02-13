import { Home, Target, Gift, Users, User, Settings as SettingsIcon, X } from 'lucide-react';
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
        className={`fixed left-0 top-0 h-screen w-[264px] bg-[#0F2A44] flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Button - Absolute Positioned with better visibility */}
        <div className="absolute top-0 right-0 p-4 z-20">
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 rounded-lg transition-all duration-150 shadow-lg"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
       
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col px-4 pt-24 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                              (item.path === '/dashboard' && location.pathname === '/');

              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-150 min-h-[44px] ${
                    isActive
                      ? 'bg-[#1A3A5A] text-[#F4B400] font-bold'
                      : 'text-[#F4B400] hover:bg-[#1A3A5A]/50'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-base">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sign Out - Pushed to Bottom */}
          <div className="mt-auto pb-4 pt-4 border-t border-[#1A3A5A]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#F4B400] hover:bg-red-500/20 hover:text-red-400 transition-all duration-150 min-h-[44px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-base">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};
