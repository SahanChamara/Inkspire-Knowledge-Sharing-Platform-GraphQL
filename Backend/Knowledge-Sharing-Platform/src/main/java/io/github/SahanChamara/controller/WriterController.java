package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.service.WriterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
@Validated
public class WriterController {

    private final WriterService writerService;
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
}
