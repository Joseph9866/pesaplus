import { Bell, ArrowLeft, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backPath?: string;
  showNotifications?: boolean;
  onMenuClick?: () => void;
}

export const Header = ({ title, showBack = false, backPath, showNotifications = true, onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackClick = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-neutral-900 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6 z-50 shadow-lg">
      {showBack ? (
        <button
          onClick={handleBackClick}
          className="text-white p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      ) : (
        <button onClick={onMenuClick} className="text-white p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg transition-colors">
          <Menu size={22} className="sm:w-6 sm:h-6" />
        </button>
      )}

      <h1 className="text-white text-base sm:text-lg md:text-xl font-semibold absolute left-1/2 transform -translate-x-1/2 truncate max-w-[50%] sm:max-w-none">
        {title || 'PesaPlus'}
      </h1>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {showNotifications && user && (
          <button
            onClick={() => navigate('/notifications')}
            className="text-white relative p-1.5 sm:p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Bell size={20} className="sm:w-[22px] sm:h-[22px]" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-semibold">
              3
            </span>
          </button>
        )}
        {user && (
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${user.full_name || user.email || user.id}`}
            alt="Profile"
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-white cursor-pointer hover:border-[#F4B400] transition-colors flex-shrink-0"
            onClick={() => navigate('/profile')}
          />
        )}
      </div>
    </header>
  );
};
