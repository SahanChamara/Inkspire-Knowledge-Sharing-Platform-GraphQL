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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public Article addArticle(Article article) {
        if(article != null && article.getStatus().equalsIgnoreCase("DRAFT")){
            return mapper.map(articleRepository.save(mapper.map(article, ArticleEntity.class)), Article.class);
        }

        return article != null && article.getStatus().equalsIgnoreCase("PUBLISHED")
                ? publishArticle(article.getId())
                : null;
    }

    @Override
    @Transactional
    public Article publishArticle(Long id) {
        Integer isUpdated = articleRepository.updateStatus(id, "PUBLISHED");
        return isUpdated != 0
                ? mapper.map(articleRepository.findById(id), Article.class)
                : null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Article> getAllArticles() {
        return articleRepository.findAll()
                .stream()
                .map(articleEntity -> mapper.map(articleEntity, Article.class))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Article articleById(Long id) {
        return mapper.map(articleRepository.findById(id), Article.class);
    }

    @Override
    @Transactional
    public Article updateArticle(Long id, Article article) {
        if(id != null && article != null){
            Optional<ArticleEntity> isExist = articleRepository.findById(id);
            if(isExist.isPresent()){
                return mapper.map(articleRepository.save(mapper.map(article, ArticleEntity.class)), Article.class);
            }
            return null;
        }
        return null;
    }

    @Override
    @Transactional
    public Boolean deleteArticle(Long id) {
        articleRepository.deleteById(id);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, List<Article>> findArticleByWriterIds(Collection<Long> writerIds) {
        return Map.of();
    }
}
