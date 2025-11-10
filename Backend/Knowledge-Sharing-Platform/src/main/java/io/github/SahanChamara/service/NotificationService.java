package io.github.SahanChamara.service;

import io.github.SahanChamara.dto.Notification;

import java.util.List;

public interface NotificationService {
    Notification createNotification(Long recipientId, Long actorId, Long articleId, String type, String payload);
    List<Notification> getNotificationsForRecipient(Long recipientId);
    long countUnread(Long recipientId);
    void markAsRead(Long notificationId);
}
