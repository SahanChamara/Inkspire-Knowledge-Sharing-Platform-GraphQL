package io.github.SahanChamara.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "writers")
public class WriterEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @Column(length = 2000)
    private String bio;
}
