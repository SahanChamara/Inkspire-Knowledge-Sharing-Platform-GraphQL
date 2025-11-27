package io.github.SahanChamara.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @Column(length = 5000)
    private String content;

    private String status;

    @Column(name = "writerId")
    private Long writerId;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "excerpt")
    private String excerpt;

    @Column(name = "cover_image")
    private String coverImageUrl;

    @ElementCollection
    @Column(name = "tags", columnDefinition = "json")
    private String[] tags;

    @Column(name = "read_time")
    private Integer readTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
