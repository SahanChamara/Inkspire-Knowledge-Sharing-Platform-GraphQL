package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.service.FollowService;
import io.github.SahanChamara.service.WriterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.BatchMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
@Validated
public class WriterController {

    private final WriterService writerService;
    private final FollowService followService;
    private static final Logger logger = LoggerFactory.getLogger(WriterController.class);

    @MutationMapping()
    public Writer logInOrSignUpWriter(@Valid @Argument("input") Writer writerInput){
        logger.info("Writer input {} ", writerInput);
        return writerService.logInOrSignUpWriter(new Writer(null,
                writerInput.getName(),
                writerInput.getBio(),
                writerInput.getEmail(),
                writerInput.getPassword(),
                null,
                null,
                null,
                LocalDateTime.now(),
                LocalDateTime.now()));
    }

    @MutationMapping()
    public Writer updateWriter(Long id, Writer writer){
        return writerService.updateWriter(id,writer);
    }

    @QueryMapping()
    public List<Writer> getWriters(){
        return writerService.getAllWriters();
    }

    @QueryMapping()
    public Writer getWriterById(Long id){
        if(id != null){
            return writerService.getWriterById(id);
        }
        return null;
    }

    @SchemaMapping(typeName = "Writer", field = "isFollowedBy")
    public Boolean isFollowedBy(Writer writer, @Argument Long meId) {
        if (meId == null || writer.getId() == null) {
            return false;
        }
        return followService.isFollowing(meId, writer.getId());
    }

    @BatchMapping(typeName = "Writer", field = "followersCount")
    public Map<Writer, Long> followersCount(List<Writer> writers) {
        List<Long> writerIds = writers.stream().map(Writer::getId).toList();
        Map<Long, Long> countsById = followService.getFollowersCountFor(writerIds);
        
        Map<Writer, Long> result = new java.util.HashMap<>();
        for (Writer writer : writers) {
            result.put(writer, countsById.getOrDefault(writer.getId(), 0L));
        }
        return result;
    }
}
