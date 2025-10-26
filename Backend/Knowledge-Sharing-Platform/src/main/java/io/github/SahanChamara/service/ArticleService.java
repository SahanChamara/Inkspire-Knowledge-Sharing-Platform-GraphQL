package io.github.SahanChamara.service;

import io.github.SahanChamara.dto.Article;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface ArticleService {
    Article addArticle(Article article);
    Article publishArticle(Long id);
    List<Article> getAllArticles();
    Article articleById(Long id);
    Article updateArticle(Long id, Article article);
    Boolean deleteArticle(Long id);
    Map<Long, List<Article>> findArticleByWriterIds(Collection<Long> writerIds);
}
