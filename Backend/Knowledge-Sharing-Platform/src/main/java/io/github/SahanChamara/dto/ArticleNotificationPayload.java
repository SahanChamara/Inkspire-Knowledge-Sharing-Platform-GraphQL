package io.github.SahanChamara.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleNotificationPayload {
    private Long articleId;
    private String title;
    private Long writerId;
    private LocalDateTime publishedAt;
}
