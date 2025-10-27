package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.service.WriterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WriterController {

    private final WriterService writerService;
    private static final Logger logger = LoggerFactory.getLogger(WriterController.class);

    @MutationMapping()
    public Writer addWriter(@Argument("input") Writer writerInput){
        logger.info("Writer input {} ", writerInput);
        return writerService.addWriter(new Writer(null,writerInput.getName(), writerInput.getBio()));
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
