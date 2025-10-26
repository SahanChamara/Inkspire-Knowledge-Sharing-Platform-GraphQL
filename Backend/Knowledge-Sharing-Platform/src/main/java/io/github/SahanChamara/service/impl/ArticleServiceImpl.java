package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleServiceImpl implements ArticleService {
        private final ArticleRepository articleRepository;
        private final ModelMapper mapper;
        private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

}
