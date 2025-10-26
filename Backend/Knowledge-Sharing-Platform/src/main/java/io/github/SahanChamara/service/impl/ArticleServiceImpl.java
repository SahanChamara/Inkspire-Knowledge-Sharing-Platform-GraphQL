package io.github.SahanChamara.service.impl;

import io.github.SahanChamara.repository.ArticleRepository;
import io.github.SahanChamara.service.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleServiceImpl implements ArticleService {
        private final ArticleRepository articleRepository;
        private final ModelMapper mapper;
        private static final Logger logger = LoggerFactory.getLogger(ArticleServiceImpl.class);

    @Override
    public Product addProduct(Product product) {
        logger.info("Product object in service {}", product);

        if(product != null){
            return mapper.map(articleRepository.save(mapper.map(product, ProductEntity.class)), Product.class);
        }
        return null;
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        if(id != null && product != null){
            Optional<ProductEntity> existProduct = articleRepository.findById(id);
            if(existProduct.isPresent()){
                return mapper.map(articleRepository.save(mapper.map(product, ProductEntity.class)), Product.class);
            }
            throw new IllegalArgumentException("This ID Not Found");
        }
        return null;
    }

    @Override
    public Boolean deleteProduct(Long id) {
        if(id != null){
            Optional<ProductEntity> productExist = articleRepository.findById(id);
            if(productExist.isPresent()){
                articleRepository.deleteById(id);
                return true;
            }
            throw new IllegalArgumentException("Id is Not Found");
        }
        return false;
    }

    @Override
    public List<Product> getAllProducts() {
        return articleRepository.findAll().stream()
                .map(productEntity -> mapper.map(productEntity, Product.class))
                .toList();
    }
}
