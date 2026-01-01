package io.github.SahanChamara.publisher;

import io.github.SahanChamara.dto.Notification;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Component
public class NotificationPublisher {
    private final Sinks.Many<Notification> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void publish(Notification notification){
        sink.tryEmitNext(notification);
    }

    public Flux<Notification> getPublisher(){
        return sink.asFlux();
    }
}
