package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.entity.ArticleEntity;
import io.github.SahanChamara.publisher.ArticlePublisher;
import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final ModelMapper mapper;
    private final ArticlePublisher articlePublisher;
    private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Override
    @Transactional
    public Article addArticle(Article article) {
        if(article != null && article.getStatus().equalsIgnoreCase("DRAFT")){
            return mapper.map(articleRepository.save(mapper.map(article, ArticleEntity.class)), Article.class);
        }

/*        return article != null && article.getStatus().equalsIgnoreCase("PUBLISHED")
                ? publishArticle(article.getId())
                : null;*/
        return null;
    }

    @Override
    @Transactional
    public Article publishArticle(Long id) {
        Integer isUpdated = articleRepository.updateStatus(id, "PUBLISHED", LocalDateTime.now(ZoneOffset.UTC));
        if(isUpdated != 0){
            Optional<ArticleEntity> articleEntity = articleRepository.findById(id);
            Article article = mapper.map(articleEntity, Article.class);
            articlePublisher.publish(article);
            return article;
        }
        return null;
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
        if(writerIds == null || writerIds.isEmpty()) return Collections.emptyMap();
        List<ArticleEntity> byWriterIdIn = articleRepository.findByWriterIdIn(writerIds);
        Map<Long, List<Article>> group = byWriterIdIn.stream()
                .map(articleEntity -> mapper.map(articleEntity, Article.class))
                .collect(Collectors.groupingBy(Article::getWriterId));

        writerIds.forEach(id -> group.putIfAbsent(id, List.of()));
        return  group;
    }
}
