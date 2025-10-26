package io.github.SahanChamara.publisher;

import io.github.SahanChamara.dto.Article;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Component
public class ArticlePublisher {
    private final Sinks.Many<Article> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publish(Article article) {
        sink.tryEmitNext(article);
    }

    public Flux<Article> getPublisher() {
        return this.sink.asFlux();
    }
}
