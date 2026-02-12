import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Notification } from '../types';
import { BellOff } from 'lucide-react';

// Helper function to get emoji based on notification type
const getNotificationEmoji = (type: string, title: string): string => {
  if (title.includes('Badge') || title.includes('Unlocked')) return '🎉';
  if (title.includes('Interest') || title.includes('Earned')) return '💰';
  if (title.includes('Streak')) return '🔥';
  if (title.includes('Challenge')) return '🏆';
  if (title.includes('Report') || title.includes('Summary')) return '📊';
  if (title.includes('Milestone') || title.includes('Goal')) return '⚡';
  if (title.includes('Deposit') || title.includes('Payment')) return '💳';
  if (title.includes('New Goal') || title.includes('Template')) return '🎯';
  if (title.includes('Friend') || title.includes('Referral')) return '👥';
  if (title.includes('Level') || title.includes('Tier')) return '🌟';
  if (title.includes('Rate') || title.includes('Update')) return '📈';
  if (title.includes('Welcome')) return '🔔';
  
  switch (type) {
    case 'achievement': return '🎉';
    case 'success': return '💰';
    case 'warning': return '⚠️';
    case 'challenge': return '🏆';
    default: return '🔔';
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  return '1 month ago';
};

export const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.is_read);
  const readNotifications = notifications.filter((n) => n.is_read);

  if (loading) {
    return (
      <Layout showBack title="Notifications">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="bg-neutral-100 w-full min-h-screen">
      {/* Custom Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 h-16 flex items-center justify-between px-4 border-b border-neutral-200 max-w-[428px] mx-auto">
        <button onClick={() => window.history.back()} className="w-8 h-8 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="#0F2A44" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold absolute left-1/2 transform -translate-x-1/2 text-[#0F2A44]">
          Notifications
        </h1>
        <button onClick={handleMarkAllAsRead} className="text-xs text-[#0F2A44] hover:underline">
          Mark all read
        </button>
      </header>

      <main className="pt-16 pb-6">
        {notifications.length === 0 ? (
          <div className="bg-white mx-4 mt-6 rounded-xl p-16 text-center">
            <BellOff size={64} className="text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0F2A44] mb-2">
              No Notifications
            </h3>
            <p className="text-neutral-500 text-sm max-w-sm mx-auto">
              You're all caught up! We'll notify you about important updates, achievements, and rewards.
            </p>
          </div>
        ) : (
          <>
            {/* Unread Notifications */}
            {unreadNotifications.length > 0 && (
              <div className="bg-neutral-100 px-4 py-4">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="bg-neutral-100 py-3 border-b border-neutral-200 flex items-start space-x-3 relative overflow-hidden cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
                      {getNotificationEmoji(notification.type, notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#0F2A44]">{notification.title}</h3>
                      <p className="text-xs mt-1 text-[#8A8F98]">{notification.message}</p>
                      <p className="text-[10px] mt-1 text-[#8A8F98]">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Read Notifications */}
            {readNotifications.length > 0 && (
              <div className="bg-white px-4">
                {readNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`bg-white py-3 flex items-start space-x-3 relative overflow-hidden ${
                      index < readNotifications.length - 1 ? 'border-b border-neutral-200' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
                      {getNotificationEmoji(notification.type, notification.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-[#0F2A44]">{notification.title}</h3>
                      <p className="text-xs mt-1 text-[#8A8F98]">{notification.message}</p>
                      <p className="text-[10px] mt-1 text-[#8A8F98]">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
