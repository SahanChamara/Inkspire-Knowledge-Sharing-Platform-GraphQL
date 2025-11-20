package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Notification;
import io.github.SahanChamara.publisher.NotificationPublisher;
import io.github.SahanChamara.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import reactor.core.publisher.Flux;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationPublisher notificationPublisher;

    @QueryMapping
    public List<Notification> notifications(@Argument Long recipientId){
        return notificationService.getNotificationsForRecipient(recipientId);
    }

    @QueryMapping
    public Long unreadNotificationCount(@Argument Long recipientId){
        return notificationService.countUnread(recipientId);
    }

    @MutationMapping
    public Boolean markNotificationRead(@Argument Long notificationId){
        notificationService.markAsRead(notificationId);
        return true;
    }

    @SubscriptionMapping
    public Flux<Notification> notificationAdded(@Argument Long recipientId){
        return notificationPublisher.getPublisher().filter(notification -> notification.getRecipientId().equals(recipientId));
    }
}
