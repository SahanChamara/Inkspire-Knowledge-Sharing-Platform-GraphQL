package io.github.SahanChamara.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long id;
    private Long recipientId;
    private Long actorId;
    private Long articleId;
    private String type;
    private String payload;
    private Boolean readFlag = false;
    private LocalDateTime createdAt;
}
