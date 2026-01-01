package io.github.SahanChamara.dto;

import io.github.SahanChamara.util.ArticleStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    private Long id;
    private String title;
    private String content;
    private ArticleStatus status;
    private Long writerId;
    private LocalDateTime publishedAt;
    private String excerpt;
    private String coverImageUrl;
    private List<String> tags;
    private Integer readTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Writer writer;
}
