package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.entity.WriterEntity;
import io.github.SahanChamara.repository.WriterRepository;
import io.github.SahanChamara.service.WriterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WriterServiceImpl implements WriterService {

    private final WriterRepository writerRepository;
    private final ModelMapper mapper;
    private static final Logger logger = LoggerFactory.getLogger(WriterServiceImpl.class);

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
        logger.info("Service Writer {}", writer);
        if(writer != null){
            return mapper.map(writerRepository.save(mapper.map(writer, WriterEntity.class)), Writer.class);
        }
        return null;
    }
}
