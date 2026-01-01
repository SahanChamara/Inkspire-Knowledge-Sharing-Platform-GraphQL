package io.github.SahanChamara.exception;

import graphql.GraphQLError;
import graphql.GraphqlErrorBuilder;
import graphql.schema.DataFetchingEnvironment;
import jakarta.validation.ConstraintViolationException;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.ErrorType;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class GraphQlValidationExceptionResolver extends DataFetcherExceptionResolverAdapter {
    @Override
    protected GraphQLError resolveToSingleError(Throwable ex, DataFetchingEnvironment env) {
        if (ex instanceof ConstraintViolationException cve) {
            List<Map<String, String>> violations = cve.getConstraintViolations()
                    .stream()
                    .map(v -> Map.of(
                            "property", v.getPropertyPath().toString(),
                            "message", v.getMessage()))
                    .toList();

            return GraphqlErrorBuilder.newError(env)
                    .message("Validation failed")
                    .errorType(ErrorType.BAD_REQUEST)
                    .extensions(Map.of("validation", violations))
                    .build();
        }
        return null;
    }
}

