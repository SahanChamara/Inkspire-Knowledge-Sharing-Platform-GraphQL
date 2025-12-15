package io.github.SahanChamara.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.dto.ArticleNotificationPayload;
import io.github.SahanChamara.dto.Notification;
import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.entity.ArticleEntity;
import io.github.SahanChamara.entity.WriterEntity;
import io.github.SahanChamara.publisher.ArticlePublisher;
import io.github.SahanChamara.publisher.NotificationPublisher;
import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.repository.FollowRepository;
import io.github.SahanChamara.repository.WriterRepository;
import io.github.SahanChamara.service.ArticleService;
import io.github.SahanChamara.service.NotificationService;
import io.github.SahanChamara.util.ArticleStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
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
    private final FollowRepository followRepository;
    private final NotificationService notificationService;
    private final WriterRepository writerRepository;
    private final ModelMapper mapper;
    private final ArticlePublisher articlePublisher;
    private final NotificationPublisher notificationPublisher;

    @Override
    @Transactional
    public Article addArticle(Article article) {
        if (article == null) return null;

        // If creating as DRAFT -> just save
        if (article.getStatus() != null && article.getStatus().equals(ArticleStatus.DRAFT)) {
            return mapper.map(articleRepository.save(mapper.map(article, ArticleEntity.class)), Article.class);
        }

        // If creating as PUBLISHED -> persist and run publish side-effects (notify followers)
        if (article.getStatus() != null && article.getStatus().equals(ArticleStatus.PUBLISHED)) {
            ArticleEntity entity = mapper.map(article, ArticleEntity.class);
            entity.setPublishedAt(LocalDateTime.now(ZoneOffset.UTC));
            ArticleEntity saved = articleRepository.save(entity);
            Article dto = mapper.map(saved, Article.class);

            // attach writer for convenience so clients receive it immediately
            writerRepository.findById(saved.getWriterId()).ifPresent(w -> dto.setWriter(mapper.map(w, Writer.class)));

            // notify followers
            List<Long> followerIdByFollowingId = followRepository.findFollowerIdByFollowingId(saved.getWriterId());
            String payload = buildPayloadForArticle(saved);
            for (Long recipientId : followerIdByFollowingId){
                Notification articlePublished = notificationService.createNotification(recipientId, saved.getWriterId(), saved.getId(), "ARTICLE_PUBLISHED", payload);
                notificationPublisher.publish(articlePublished);
            }

            return dto;
        }

        return null;
    }

    @Override
    @Transactional
    public Article publishArticle(Long id) {
        Integer isUpdated = articleRepository.updateStatus(id, "PUBLISHED", LocalDateTime.now(ZoneOffset.UTC));

        Optional<ArticleEntity> articleEntity = articleRepository.findById(id);
        if (articleEntity.isEmpty()) return null;
        ArticleEntity article = articleEntity.get();
        Article articleDto = mapper.map(article, Article.class);
        writerRepository.findById(article.getWriterId()).ifPresent(w -> articleDto.setWriter(mapper.map(w, Writer.class)));
//        articlePublisher.publish(article);

        if(isUpdated != 0){
            List<Long> followerIdByFollowingId = followRepository.findFollowerIdByFollowingId(article.getWriterId());
            String payload = buildPayloadForArticle(articleEntity.get());
            for (Long recipientId : followerIdByFollowingId){
                Notification articlePublished = notificationService.createNotification(recipientId, article.getWriterId(), articleEntity.get().getId(), "ARTICLE_PUBLISHED", payload);
                notificationPublisher.publish(articlePublished);
            }
        }
        return articleDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Article> getAllArticles(ArticleStatus status) {
        List<ArticleEntity> articles = (status == null)
                ? articleRepository.findAll()
                : articleRepository.findByStatus(status);
        List<Article> dtos = articles.stream()
            .map(articleEntity -> mapper.map(articleEntity, Article.class))
            .toList();

        attachWriters(dtos);
        return dtos;
    }

        /**
         * Populate `writer` field on each Article DTO using a single batch query
         */
        private void attachWriters(List<Article> articles){
        if(articles == null || articles.isEmpty()) return;
        List<Long> writerIds = articles.stream()
            .map(Article::getWriterId)
            .filter(Objects::nonNull)
            .distinct()
            .toList();
        if(writerIds.isEmpty()) return;

        List<WriterEntity> writerEntities = writerRepository.findByIdIn(writerIds);
        Map<Long, Writer> map = writerEntities.stream()
            .map(w -> mapper.map(w, Writer.class))
            .collect(Collectors.toMap(Writer::getId, w -> w));

        for(Article a : articles){
            a.setWriter(map.get(a.getWriterId()));
        }
        }

    @Override
    @Transactional(readOnly = true)
    public Article articleById(Long id) {
        Optional<ArticleEntity> opt = articleRepository.findById(id);
        if (opt.isEmpty()) return null;
        Article dto = mapper.map(opt.get(), Article.class);
        attachWriters(List.of(dto));
        return dto;
    }

    @Override
    @Transactional
    public List<Article> articlesByWriter(Long writerId) {
        List<Article> dtos = articleRepository.findByWriterId(writerId)
            .stream()
            .map(articleEntity -> mapper.map(articleEntity, Article.class))
            .toList();
        attachWriters(dtos);
        return dtos;
    }

    @Override
    @Transactional
    public List<Article> draftsByWriter(Long writerId) {
        List<Article> dtos = articleRepository.findByWriterIdAndStatus(writerId, ArticleStatus.DRAFT)
            .stream()
            .map(articleEntity -> mapper.map(articleEntity, Article.class))
            .toList();
        attachWriters(dtos);
        return dtos;
    }

    @Override
    @Transactional
    public List<Article> publishedByWriter(Long writerId) {
        List<Article> dtos = articleRepository.findByWriterIdAndStatus(writerId, ArticleStatus.PUBLISHED)
            .stream()
            .map(articleEntity -> mapper.map(articleEntity, Article.class))
            .toList();
        attachWriters(dtos);
        return dtos;
    }

    @Override
    @Transactional
    public Article updateArticle(Long id, Article article) {
        if (id != null && article != null) {
            Optional<ArticleEntity> isExist = articleRepository.findById(id);
            if (isExist.isPresent()) {
                ArticleEntity articleEntity = mapper.map(article, ArticleEntity.class);
                articleEntity.setId(id); // Preserve the ID
                ArticleEntity saved = articleRepository.save(articleEntity);
                Article dto = mapper.map(saved, Article.class);
                writerRepository.findById(saved.getWriterId()).ifPresent(w -> dto.setWriter(mapper.map(w, Writer.class)));
                return dto;
            }
            return null;
        }
        return null;
    }

    @Override
    @Transactional
    public Boolean deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) return Boolean.FALSE;
        articleRepository.deleteById(id);
        return Boolean.TRUE;
    }


    @Override
    @Transactional(readOnly = true)
    public Map<Long, List<Article>> findArticleByWriterIds(Collection<Long> writerIds) {
        if (writerIds == null || writerIds.isEmpty()) return Collections.emptyMap();
        List<ArticleEntity> byWriterIdIn = articleRepository.findByWriterIdIn(writerIds);
        Map<Long, List<Article>> group = byWriterIdIn.stream()
                .map(articleEntity -> mapper.map(articleEntity, Article.class))
                .collect(Collectors.groupingBy(Article::getWriterId));

        writerIds.forEach(id -> group.putIfAbsent(id, List.of()));
        return group;
    }

    @Override
    public Map<Long, Writer> getWriterByArticles(List<Article> articles) {
        List<Long> writerIds = articles.stream()
                .map(Article::getWriterId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        if(writerIds.isEmpty()){
            return Collections.emptyMap();
        }

        List<WriterEntity> writerEntities = writerRepository.findByIdIn(writerIds);
        Map<Long, Writer> map = writerEntities.stream()
                .map(writerEntity -> mapper.map(writerEntity, Writer.class))
                .collect(Collectors.toMap(Writer::getId, writer -> writer));

        writerIds.forEach(id -> map.putIfAbsent(id, null));
        return map;

    }

    //   This is helper method for clear structuring for notification payload
    @Override
    public String buildPayloadForArticle(ArticleEntity article) {
        // Serialize payload as primitives to avoid requiring jackson-datatype-jsr310 for LocalDateTime
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", article.getId());
        payload.put("title", article.getTitle());
        payload.put("writerId", article.getWriterId());
        payload.put("publishedAt", article.getPublishedAt() != null ? article.getPublishedAt().toString() : null);

        try {
            return new ObjectMapper().writeValueAsString(payload);
        } catch (JsonProcessingException processingException) {
            throw new RuntimeException("Error Building Notification Payload", processingException);
        }
    }
}
