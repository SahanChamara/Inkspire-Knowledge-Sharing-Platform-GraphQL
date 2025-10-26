package io.github.SahanChamara.controller;

import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ArticleController {

    private final ArticleService articleService;
    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);

    @QueryMapping
    public List<Product> getProducts() {
        List<Product> allProducts = articleService.getAllProducts();
        return allProducts.isEmpty()
                ? null
                : allProducts;
    }

    @MutationMapping
    public Product addProduct(@Argument("input") Product input){
        logger.info("Input {}", input);
        Product inputProduct = new Product(null,input.getProductName(), input.getDescription(), input.getPrice(), input.getStock(), input.getCategory(), input.getImageUrl());
        logger.info("input Product {}", inputProduct);

        Product product = articleService.addProduct(inputProduct);
        if(product!=null){
            return product;
        }
        return null;
    }

    //public record ProductInput(String productName, String description, Float price, Integer stock, String category, String imageUrl) {}

}
