import { Home, Target, Gift, Users, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Gift, label: 'Rewards', path: '/rewards' },
  { icon: Users, label: 'Social', path: '/social' },
  { icon: Settings, label: 'Settings', path: '/profile' },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white h-14 sm:h-16 flex items-center justify-around shadow-lg z-50 border-t border-neutral-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path ||
                        (item.path === '/dashboard' && location.pathname === '/');

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-14 sm:w-16 transition-colors ${
              isActive ? 'text-[#0F2A44]' : 'text-[#8A8F98]'
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
            <span className="text-[10px] sm:text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
