package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    Long countByRecipientIdAndReadFlagFalse(Long recipientId);
}
