package io.github.SahanChamara.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification")
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipientId")
    private Long recipientId;

    @Column(name = "actorId")
    private Long actorId;

    @Column(name = "articleId")
    private Long articleId;

    @Column(name = "type")
    private String type;

    @Column(name = "readFlag")
    private Boolean readFlag = false;

    @Column(name = "payload")
    private String payload;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
