package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.dto.Writer;
import io.github.SahanChamara.publisher.ArticlePublisher;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import reactor.core.publisher.Flux;

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
        return articleService.addArticle(new Article(null, articleInput.getTitle(),
                articleInput.getContent(), articleInput.getStatus(), articleInput.getWriterId(),articleInput.getPublishedAt()));

    }

    @MutationMapping
    public Article publisheArticle(@Argument Long id){
        return articleService.publishArticle(id);
    }

    @MutationMapping
    public Article updateArticle(@Argument Long id, @Argument("input") Article articleInput){
        return articleService.updateArticle(id, new Article(null,articleInput.getTitle(),
                articleInput.getContent(), articleInput.getStatus(), articleInput.getWriterId(), articleInput.getPublishedAt()));
    }

    @MutationMapping
    public Boolean deleteArticle(@Argument Long id){
        return articleService.deleteArticle(id);
    }

    public Article articleById(@Argument Long id){
        return articleService.articleById(id);
    }

    @QueryMapping
    public List<Article> articles(@Argument Optional<String> status){
        return articleService.getAllArticles(status.orElse(null));
    }

    @BatchMapping(typeName = "Writer", field = "articles")
    public Map<Long, List<Article>> articles(List<Writer> writers){
        List<Long> writerIdList = writers.stream()
                .map(Writer::getId).toList();
        return articleService.findArticleByWriterIds(writerIdList);
    }

    @SubscriptionMapping
    public Flux<Article> articlePublished(){
        return articlePublisher.getPublisher();
    }

}
