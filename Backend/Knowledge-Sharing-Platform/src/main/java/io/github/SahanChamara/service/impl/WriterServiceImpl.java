package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.entity.WriterEntity;
import io.github.SahanChamara.repository.WriterRepository;
import io.github.SahanChamara.service.WriterService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WriterServiceImpl implements WriterService {

    private final WriterRepository writerRepository;
    private final ModelMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public List<Writer> getAllWriters() {
        return writerRepository.findAll()
                .stream()
                .map(writerEntity -> mapper.map(writerEntity, Writer.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Writer getWriterById(Long id) {
        if(id != null){
            return writerRepository.findById(id)
                    .map(writerEntity -> mapper.map(writerEntity, Writer.class)).orElse(null);
        }
        return null;
    }

    @Override
    @Transactional
    public Writer addWriter(Writer writer) {
        if(writer != null){
            return mapper.map(writerRepository.save(mapper.map(writer, WriterEntity.class)), Writer.class);
        }
        return null;
    }
}
