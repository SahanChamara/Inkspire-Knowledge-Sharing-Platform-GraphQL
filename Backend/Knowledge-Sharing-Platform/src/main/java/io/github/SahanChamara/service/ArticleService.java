package io.github.SahanChamara.service;

import java.util.List;

public interface ArticleService {
    Product addProduct(Product product);
    Product updateProduct(Long id, Product product);
    Boolean deleteProduct(Long id);
    List<Product> getAllProducts();
}
