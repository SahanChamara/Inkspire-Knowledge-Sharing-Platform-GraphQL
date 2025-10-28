package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    List<ArticleEntity> findByWriterIdIn(Collection<Long> writerIds);
    List<ArticleEntity> findByWriterId(Long writerId);
    List<ArticleEntity> findByStatus(String status);

    @Modifying
    @Query("UPDATE ArticleEntity article SET article.status = :status WHERE article.id = :id")
    Integer updateStatus(@Param("id") Long id, @Param("status") String status);
}
