import { apolloClient } from './apllo';
import {
  GET_NOTIFICATIONS,
  GET_UNREAD_NOTIFICATION_COUNT,
  MARK_NOTIFICATION_READ,
  NOTIFICATION_ADDEDD_SUB,
} from './operations';

export const notificationService = {
  // Backend handles creation of notifications when an article is published.
  // These client helpers use GraphQL queries/mutations/subscriptions to read and react to notifications.

  async getNotifications(recipientId: string) {
    const result = await apolloClient.query<{notifications: any[]}, {recipientId: string}>({
      query: GET_NOTIFICATIONS,
      variables: { recipientId },
      fetchPolicy: 'network-only',
    });

    if (result.error) throw new Error(result.error.message);
    const raw = result.data?.notifications ?? [];
    // map GraphQL notification shape to client shape used by UI
    return raw.map((n: any) => {
      let message = n.payload;
      try {
        if (typeof n.payload === 'string') {
          const parsed = JSON.parse(n.payload);
          // If payload has title, craft a readable message
          if (parsed.title) {
            message = `New article published: ${parsed.title}`;
          } else {
            message = JSON.stringify(parsed);
          }
        }
      } catch (e) {
        // ignore parse errors, keep original payload
      }

      return {
        id: n.id,
        recipient_id: n.recipientId,
        sender_id: n.actorId ?? null,
        article_id: n.articleId ?? null,
        type: n.type,
        message,
        read: Boolean(n.readFlag),
        created_at: n.createdAt,
      };
    });
  },

  async getUnreadCount(recipientId: string) {
    const result = await apolloClient.query<{unreadNotificationCount: number}, {recipientId: string}>({
      query: GET_UNREAD_NOTIFICATION_COUNT,
      variables: { recipientId },
      fetchPolicy: 'network-only',
    });

    if (result.error) throw new Error(result.error.message);
    return result.data?.unreadNotificationCount ?? 0;
  },

  async markAsRead(notificationId: string) {
    const result = await apolloClient.mutate<{markNotificationRead: boolean}, {notificationId: string}>({
      mutation: MARK_NOTIFICATION_READ,
      variables: { notificationId },
    });

    if (result.error) throw new Error(result.error.message);
    return result.data?.markNotificationRead ?? false;
  },

  // markAllAsRead is not implemented server-side; client can iterate markAsRead when needed
  async markAllAsRead(recipientId: string) {
    const notifications = await this.getNotifications(recipientId);
    const unread = notifications.filter((n: any) => !n.readFlag && n.id);
    await Promise.all(unread.map((n: any) => this.markAsRead(n.id)));
  },

  subscribeToNotifications(recipientId: string, onMessage: (n: any) => void) {
    const observable = apolloClient.subscribe({
      query: NOTIFICATION_ADDEDD_SUB,
      variables: { recipientId },
    });

    const sub = observable.subscribe({
      next(response) {
          const payload = response.data?.notificationAdded;
          if (!payload) return;
          let message = payload.payload;
          try {
            if (typeof payload.payload === 'string') {
              const parsed = JSON.parse(payload.payload);
              if (parsed.title) {
                message = `New article published: ${parsed.title}`;
              } else {
                message = JSON.stringify(parsed);
              }
            }
          } catch (e) {
            console.debug('Failed to parse notification payload', e);
          }

          onMessage({
            id: payload.id,
            recipient_id: payload.recipientId,
            sender_id: payload.actorId ?? null,
            article_id: payload.articleId ?? null,
            type: payload.type,
            message,
            read: Boolean(payload.readFlag),
            created_at: payload.createdAt,
          });
      },
      error(err) {
        console.error('Notification subscription error', err);
      },
    });

    return () => sub.unsubscribe();
  },
};
