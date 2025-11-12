import { supabase, Notification, NotificationWithRelations } from './supabase';
import { followService } from './follows';

export const notificationService = {
  async createNotification(notification: {
    recipient_id: string;
    sender_id?: string;
    article_id?: string;
    type: string;
    message: string;
  }): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async notifyFollowersOfNewArticle(
    writerId: string,
    writerName: string,
    articleId: string,
    articleTitle: string
  ): Promise<void> {
    const followerIds = await followService.getFollowerIds(writerId);

    if (followerIds.length === 0) return;

    const notifications = followerIds.map(followerId => ({
      recipient_id: followerId,
      sender_id: writerId,
      article_id: articleId,
      type: 'new_article',
      message: `${writerName} published a new article: "${articleTitle}"`,
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) throw error;
  },

  async getNotifications(userId: string): Promise<NotificationWithRelations[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        sender:profiles!notifications_sender_id_fkey (*),
        article:articles (*)
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as NotificationWithRelations[];
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) throw error;
  },

  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
