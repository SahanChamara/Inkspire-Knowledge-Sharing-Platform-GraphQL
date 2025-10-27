package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.entity.ArticleEntity;
import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final ModelMapper mapper;
    private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Override
    public Article addArticle(Article article) {
        if(article != null && article.getStatus().equalsIgnoreCase("DRAFT")){
            return mapper.map(articleRepository.save(mapper.map(article, ArticleEntity.class)), Article.class);
        }

        return article != null
                ? publishArticle(article.getId())
                : null;
    }

    @Override
    public Article publishArticle(Long id) {
        return null;
    }

    @Override
    public List<Article> getAllArticles() {
        return List.of();
    }

    @Override
    public Article articleById(Long id) {
        return null;
    }

    @Override
    public Article updateArticle(Long id, Article article) {
        return null;
    }

    @Override
    public Boolean deleteArticle(Long id) {
        return null;
    }

    @Override
    public Map<Long, List<Article>> findArticleByWriterIds(Collection<Long> writerIds) {
        return Map.of();
    }
}
