package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Notification;
import io.github.SahanChamara.entity.NotificationEntity;
import io.github.SahanChamara.repository.NotificationRepository;
import io.github.SahanChamara.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final ModelMapper mapper;
    
    @Override
    @Transactional
    public Notification createNotification(Notification notification) {
        return mapper.map(notificationRepository.save(mapper.map(notification, NotificationEntity.class)), Notification.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForRecipient(Long recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(notificationEntity -> mapper.map(notificationEntity, Notification.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Long countUnread(Long recipientId) {
        return notificationRepository.countByRecipientIdAndReadFlagFalse(recipientId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Optional<NotificationEntity> notification = notificationRepository.findById(notificationId);
        notification.ifPresent(notificationEntity -> {notificationEntity.setReadFlag(true); notificationRepository.save(notificationEntity); });
    }
}
