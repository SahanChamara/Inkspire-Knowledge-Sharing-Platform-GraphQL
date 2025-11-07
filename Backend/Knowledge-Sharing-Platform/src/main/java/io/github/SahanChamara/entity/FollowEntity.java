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
@Table(name = "follow")
public class FollowEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "followId")
    private Long followerId;

    @Column(name = "followingId")
    private Long followingId;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;
}
