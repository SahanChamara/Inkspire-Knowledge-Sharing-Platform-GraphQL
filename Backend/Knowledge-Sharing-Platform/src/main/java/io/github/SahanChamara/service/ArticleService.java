package io.github.SahanChamara.service;

import io.github.SahanChamara.dto.Article;
import io.github.SahanChamara.entity.ArticleEntity;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface ArticleService {
    Article addArticle(Article article);
    Article publishArticle(Long id);
    List<Article> getAllArticles(String status);
    Article articleById(Long id);
    List<Article> articlesByWriter(Long writerId);
    List<Article> draftsByWriter(Long writerId);
    List<Article> publishedByWriter(Long writerId);
    Article updateArticle(Long id, Article article);
    Boolean deleteArticle(Long id);
    Map<Long, List<Article>> findArticleByWriterIds(Collection<Long> writerIds);
    String buildPayloadForArticle(ArticleEntity article);
}
