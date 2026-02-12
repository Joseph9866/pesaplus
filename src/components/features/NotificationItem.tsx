import { Notification } from '../../types';
import { Bell, CheckCircle, AlertCircle, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-secondary" />;
      case 'warning':
        return <AlertCircle size={20} className="text-accent" />;
      case 'achievement':
        return <Trophy size={20} className="text-accent" />;
      case 'challenge':
        return <Users size={20} className="text-secondary" />;
      default:
        return <Bell size={20} className="text-primary" />;
    }
  };

  const getTimeAgo = () => {
    const now = new Date();
    const created = new Date(notification.created_at);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        !notification.is_read ? 'bg-secondary/5' : ''
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium text-text ${!notification.is_read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {getTimeAgo()}
            </span>
          </div>
          <p className="text-sm text-text-secondary line-clamp-2">
            {notification.message}
          </p>
          {!notification.is_read && (
            <div className="mt-2">
              <span className="inline-block w-2 h-2 bg-secondary rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
};
