package org.example.machine_service.services;

import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.repositories.ProductFilter;
import org.example.machine_service.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductFilter productFilter;
    public Product create_product(Product product) {
        if (productRepo.findByName(product.getName()) != null) {
            return product; // исправить на поиск модели
        }
        return productRepo.save(product);
    }

    public Product get_product(Long id) throws ProductNotFindException {
        Optional<Product> productOptional = productRepo.findById(id);
        if (productOptional.isEmpty()) {
            throw new ProductNotFindException("Пользователь не найден");
        }
        return productOptional.get();
    }
    public Product update_product(Product product) {
        Product savedProduct = productRepo.save(product);
        return savedProduct;
    }
    public Page<Product> searchProduct(String searchTerm, Pageable pageable) {
        return productFilter.findByArticleContaining(searchTerm, pageable);
    }

    public Page<Product> searchAllProducts(Pageable pageable) {
        return productRepo.findAll(pageable);
    }


    public void delete_product(Product product) {
        productRepo.delete(product);
    }
}
