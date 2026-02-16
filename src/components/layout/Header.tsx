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
    <header className="fixed top-0 left-0 right-0 bg-neutral-900 h-16 flex items-center justify-between px-6 z-50 shadow-lg">
      {showBack ? (
        <button
          onClick={handleBackClick}
          className="text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={22} />
        </button>
      ) : (
        <button onClick={onMenuClick} className="text-white p-2 hover:bg-neutral-800 rounded-lg transition-colors">
          <Menu size={24} />
        </button>
      )}

      <h1 className="text-white text-xl font-semibold absolute left-1/2 transform -translate-x-1/2">
        {title || 'PesaPlus'}
      </h1>

      <div className="flex items-center gap-4">
        {showNotifications && user && (
          <button
            onClick={() => navigate('/notifications')}
            className="text-white relative p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
              3
            </span>
          </button>
        )}
        {user && (
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=${user.id}`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white cursor-pointer hover:border-[#F4B400] transition-colors"
            onClick={() => navigate('/profile')}
          />
        )}
      </div>
    </header>
  );
};
