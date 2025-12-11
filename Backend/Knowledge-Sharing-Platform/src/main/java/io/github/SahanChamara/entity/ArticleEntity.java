package io.github.SahanChamara.entity;

import io.github.SahanChamara.util.ArticleStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Enumerated(EnumType.STRING)
    private ArticleStatus status;

    @Column(name = "writerId")
    private Long writerId;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "excerpt")
    private String excerpt;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(columnDefinition = "json")
    @jakarta.persistence.Convert(converter = io.github.SahanChamara.util.StringListConverter.class)
    private java.util.List<String> tags;

    @Column(name = "read_time")
    private Integer readTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
