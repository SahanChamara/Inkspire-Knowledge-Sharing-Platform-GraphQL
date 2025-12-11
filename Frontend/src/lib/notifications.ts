import { Notification, NotificationWithRelations } from './supabase';

export const notificationService = {
  async createNotification(notification: {
    recipient_id: string;
    sender_id?: string;
    article_id?: string;
    type: string;
    message: string;
  }): Promise<Notification> {
    // Notifications are now handled by the backend GraphQL API
    throw new Error('Use GraphQL API instead');
  },

  async notifyFollowersOfNewArticle(
    writerId: string,
    writerName: string,
    articleId: string,
    articleTitle: string
  ): Promise<void> {
    // Notifications are now handled by the backend GraphQL API
    // This is called automatically when an article is published via publishArticle() mutation
  },

  async getNotifications(userId: string): Promise<NotificationWithRelations[]> {
    // Use GraphQL API to fetch notifications
    return [];
  },

  async getUnreadCount(userId: string): Promise<number> {
    // Use GraphQL API to get unread count
    return 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    // Use GraphQL API to mark notification as read
  },

  async markAllAsRead(userId: string): Promise<void> {
    // Use GraphQL API to mark all notifications as read
  },

  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    // Use GraphQL subscriptions instead
    return () => {
      // unsubscribe
    };
  },
};
