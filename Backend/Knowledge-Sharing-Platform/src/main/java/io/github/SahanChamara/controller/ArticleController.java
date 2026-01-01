package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.publisher.ArticlePublisher;
import io.github.SahanChamara.service.ArticleService;
import io.github.SahanChamara.util.ArticleStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ArticleController {

    private final ArticleService articleService;
    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);
    private final ArticlePublisher articlePublisher;

    @MutationMapping
    public Article addArticle(@Argument("input") Article articleInput){

        logger.debug("Cover Image Url: {}", articleInput.getCoverImageUrl());

        return articleService.addArticle(new Article(null, articleInput.getTitle(),
            articleInput.getContent(), articleInput.getStatus(), articleInput.getWriterId(),articleInput.getPublishedAt(), articleInput.getExcerpt(), articleInput.getCoverImageUrl(),
            articleInput.getTags(), articleInput.getReadTime(), LocalDateTime.now(), LocalDateTime.now(), null));

    }

    @MutationMapping
    public Article publisheArticle(@Argument Long id){
        return articleService.publishArticle(id);
    }

    @MutationMapping
    public Article updateArticle(@Argument Long id, @Argument("input") Article articleInput){
        return articleService.updateArticle(id, new Article(null,articleInput.getTitle(),
            articleInput.getContent(), articleInput.getStatus(), articleInput.getWriterId(), articleInput.getPublishedAt(), articleInput.getExcerpt(), articleInput.getCoverImageUrl(),
            articleInput.getTags(), articleInput.getReadTime(), articleInput.getCreatedAt(), LocalDateTime.now(), null));
    }

    @MutationMapping
    public Boolean deleteArticle(@Argument Long id){
        return articleService.deleteArticle(id);
    }

    @QueryMapping
    public Article articleById(@Argument Long id){
        return articleService.articleById(id);
    }

    @QueryMapping
    public List<Article> articlesByWriter(@Argument Long writerId){
        return articleService.articlesByWriter(writerId);
    }

    @QueryMapping
    public List<Article> draftsByWriter(@Argument Long writerId){
        return articleService.draftsByWriter(writerId);
    }

    @QueryMapping
    public List<Article> publishedByWriter(@Argument Long writerId){
        return articleService.publishedByWriter(writerId);
    }

    @QueryMapping
    public List<Article> articles(@Argument Optional<String> status){
        ArticleStatus articleStatus = null;
        if (status.isPresent()){
            try{
                articleStatus = ArticleStatus.valueOf(status.get());
            } catch (IllegalArgumentException ex){
                logger.warn("Unknown article status filter: {}", status.get());
                articleStatus = null;
            }
        }
        return articleService.getAllArticles(articleStatus);
    }

    @BatchMapping(typeName = "Writer", field = "articles")
    public Map<Long, List<Article>> articles(List<Writer> writers){
        List<Long> writerIdList = writers.stream()
                .map(Writer::getId).toList();
        return articleService.findArticleByWriterIds(writerIdList);
    }

    @BatchMapping(typeName = "Article", field = "writer")
    public Map<Article, Writer> writer(List<Article> articles){
        // GraphQL BatchMapping for Article.writer expects a map keyed by Article object -> Writer
        Map<Long, Writer> writersByWriterId = articleService.getWriterByArticles(articles);
        Map<Article, Writer> result = new java.util.HashMap<>();
        for (Article a : articles) {
            Writer writer = writersByWriterId.get(a.getWriterId());
            if (writer != null) {
                result.put(a, writer);
            }
        }
        return result;
    }

    @SubscriptionMapping
    public Flux<Article> articlePublished(){
        return articlePublisher.getPublisher();
    }

}
