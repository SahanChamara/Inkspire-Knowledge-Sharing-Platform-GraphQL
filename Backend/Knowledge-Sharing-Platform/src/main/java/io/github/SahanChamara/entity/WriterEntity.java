package io.github.SahanChamara.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "writers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WriterEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(length = 2000)
    private String bio;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "avatarUrl")
    private String avatarUrl;

    @Column(name = "followersCount")
    private Long followersCount;

    @Column(name = "articleCount")
    private Long articleCount;

    @Column(name = "createdAt")
    private LocalDateTime createdAt;

    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;
}
