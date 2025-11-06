package io.github.SahanChamara.repository;

import io.github.SahanChamara.entity.WriterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WriterRepository extends JpaRepository<WriterEntity, Long> {
    Optional<WriterEntity> findByEmail(String email);
}
