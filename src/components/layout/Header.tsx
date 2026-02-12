import { Bell, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  onMenuClick?: () => void;
}

export const Header = ({ title, showBack = false, showNotifications = true, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-900 h-16 flex items-center justify-between px-4 z-50 max-w-[428px] mx-auto lg:max-w-full">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="text-white p-2"
        >
          <ArrowLeft size={20} />
        </button>
      ) : (
        <button onClick={onMenuClick} className="text-white">
          <Menu size={24} />
        </button>
      )}

      <h1 className="text-white text-lg font-semibold absolute left-16">
        {title || 'PesaPlus'}
      </h1>

      <div className="flex items-center gap-4">
        {showNotifications && user && (
          <button
            onClick={() => navigate('/notifications')}
            className="text-white relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-neutral-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
        )}
        {user && (
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${user.id}`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            onClick={() => navigate('/profile')}
          />
        )}
      </div>
    </header>
  );
};
