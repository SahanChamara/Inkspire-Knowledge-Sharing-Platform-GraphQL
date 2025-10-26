package io.github.SahanChamara.service;

import io.github.SahanChamara.dto.Writer;

import java.util.List;

public interface WriterService {
    List<Writer> getAllWriters();
    Writer getWriterById(Long id);
    Writer addWriter(Writer writer);
}
