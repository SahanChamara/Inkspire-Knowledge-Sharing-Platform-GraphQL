package io.github.SahanChamara.controller;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.publisher.ArticlePublisher;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Flux;

import java.util.List;

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

    public Article publisheArticle(@Argument Long id){
        return articleService.publishArticle(id);
    }


    @SubscriptionMapping
    public Flux<Article> articlePublished(){
        return articlePublisher.getPublisher();
    }

}
