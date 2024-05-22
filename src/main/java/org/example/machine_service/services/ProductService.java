package org.example.machine_service.services;

import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;
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
    public void delete_product(Product product) {
        productRepo.delete(product);
    }
}
