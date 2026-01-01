package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.entity.WriterEntity;
import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.repository.WriterRepository;
import io.github.SahanChamara.service.WriterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class WriterServiceImpl implements WriterService {

    private final WriterRepository writerRepository;
    private final ArticleRepository articleRepository;
    private final ModelMapper mapper;
    private final PasswordEncoder passwordEncorder;
    private static final Logger logger = LoggerFactory.getLogger(WriterServiceImpl.class);

    @Override
    @Transactional(readOnly = true)
    public List<Writer> getAllWriters() {
        List<WriterEntity> writerEntities = writerRepository.findAll();
        List<Long> writersIds = writerEntities.stream()
                .map(WriterEntity::getId).toList();

        Map<Long, Long> counts;
        if(!writersIds.isEmpty()){
            List<Object[]> rows = articleRepository.countArticlesByWritersIds(writersIds);
            counts = new HashMap<>();
            for (Object[] row : rows){
                Long writerId = ((Number) row[0]).longValue();
                Long count = ((Number) row[1]).longValue();
                counts.put(writerId,count);
            }
        } else {
            counts = Collections.emptyMap();
        }

        return writerEntities.stream()
                .map( writerEntity -> {
                            Writer writer = mapper.map(writerEntity, Writer.class);
                            writer.setArticleCount(counts.getOrDefault(writer.getId(), 0L));
                            return writer;
                }).toList();
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
    public Writer logInOrSignUpWriter(Writer writer) {
        logger.info("Service Writer {}", writer);

        if(writer == null || writer.getEmail() == null || writer.getPassword() == null ){
            throw new IllegalArgumentException("Email and Password are Required");
        }

        Optional<WriterEntity> existingWriter = writerRepository.findByEmail(writer.getEmail());
        if(existingWriter.isPresent()){
            WriterEntity exsistingWriterEntity = existingWriter.get();
            if(passwordEncorder.matches(writer.getPassword(), exsistingWriterEntity.getPassword())){
                return mapper.map(existingWriter, Writer.class);
            }
            throw new IllegalArgumentException("Invalid Credentials");
        }else {
            WriterEntity writerEntity = new WriterEntity();
            writerEntity.setName(writer.getName());
            writerEntity.setBio(writer.getBio());
            writerEntity.setEmail(writer.getEmail());
            writerEntity.setPassword(passwordEncorder.encode(writer.getPassword()));

            return mapper.map(writerRepository.save(writerEntity), Writer.class);
        }
    }

    @Override
    public Writer updateWriter(Long id,Writer writer) {
        if(id != null && writer != null){
            Optional<WriterEntity> isExist = writerRepository.findById(id);
            if(isExist.isPresent()){
                return mapper.map(writerRepository.save(mapper.map(writer, WriterEntity.class)), Writer.class);
            }
            return null;
        }
        return null;
    }
}
