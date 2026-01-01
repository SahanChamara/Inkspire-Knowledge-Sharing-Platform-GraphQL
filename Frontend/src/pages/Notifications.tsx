import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Bell, CheckCircle, MessageSquare, UserPlus, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../lib/notifications';
import { NotificationWithRelations } from '../lib/supabase';


export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<NotificationWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadNotifications();

      const unsubscribe = notificationService.subscribeToNotifications(
        profile.id,
        () => {
          loadNotifications();
        }
      );

      return unsubscribe;
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const data = await notificationService.getNotifications(profile.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };


  const getIcon = (type: string) => {
    switch (type) {
      case 'new_article':
        return <FileText className="text-teal-600" size={24} />;
      case 'new_follower':
        return <UserPlus className="text-blue-600" size={24} />;
      default:
        return <Bell className="text-gray-600" size={24} />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!profile) return;

    try {
      await notificationService.markAllAsRead(profile.id);
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageLayout maxWidth="md">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              filter === 'unread'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="danger" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'unread'
                ? "You've read all your notifications"
                : "We'll notify you when something important happens"}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all cursor-pointer ${
                !notification.read ? 'bg-teal-50 border-teal-200' : ''
              }`}
              onClick={() => {
                if (!notification.read) markAsRead(notification.id);
                if (notification.article_id) navigate(`/article/${notification.article_id}`);
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{getTimeAgo(notification.created_at)}</p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </PageLayout>
  );
};
