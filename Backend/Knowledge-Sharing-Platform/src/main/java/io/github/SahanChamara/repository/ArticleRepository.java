package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.ArticleEntity;
import io.github.SahanChamara.util.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    List<ArticleEntity> findByWriterIdIn(Collection<Long> writerIds);
    List<ArticleEntity> findByWriterId(Long writerId);
    List<ArticleEntity> findByStatus(ArticleStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE ArticleEntity article SET article.status = :status, article.publishedAt = :publishedAt WHERE article.id = :id")
    Integer updateStatus(@Param("id") Long id, @Param("status") String status, @Param("publishedAt") LocalDateTime publishedAt);

    @Query("SELECT articles.writerId, COUNT(articles) FROM ArticleEntity articles WHERE articles.writerId IN :writerIds GROUP BY articles.writerId")
    List<Object[]> countArticlesByWritersIds(@Param("writerIds") Collection<Long> writerIds);

    List<ArticleEntity> findByWriterIdAndStatus(Long writerId, ArticleStatus status);
}
