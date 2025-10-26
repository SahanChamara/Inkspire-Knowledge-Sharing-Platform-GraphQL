package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    List<ArticleEntity> findByWriterIdIn(Collection<Long> writerIds);
    List<ArticleEntity> findByWriterId(Long writerId);
    List<ArticleEntity> findByStatus(String status);
}
