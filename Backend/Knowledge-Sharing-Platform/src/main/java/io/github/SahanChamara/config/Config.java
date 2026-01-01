package io.github.SahanChamara.config;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.entity.ArticleEntity;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        
        // Configure ModelMapper to use strict matching strategy to avoid ambiguity
        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setAmbiguityIgnored(true);
        
        return modelMapper;
    }
}


