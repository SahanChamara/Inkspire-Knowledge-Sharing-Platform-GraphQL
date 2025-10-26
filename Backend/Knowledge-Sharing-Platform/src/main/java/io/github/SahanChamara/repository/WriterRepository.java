package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.WriterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WriterRepository extends JpaRepository<WriterEntity, Long> {
}
