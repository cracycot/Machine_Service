package org.example.machine_service.services;

import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.repositories.ProductFilter;
import org.example.machine_service.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductFilter productFilter;

    public void createProduct(Product product) {
        productRepo.save(product);
    }

    public Product getProduct(Long id) throws ProductNotFindException {
        Optional<Product> productOptional = productRepo.findById(id);
        if (productOptional.isEmpty()) {
            throw new ProductNotFindException("Пользователь не найден");
        }
        return productOptional.get();
    }

    public void updateProduct(Product product) {
        Product savedProduct = productRepo.save(product);
    }

    public Page<Product> searchProduct(String searchTerm, String brand, int min, int max, Pageable pageable) {
        System.out.println(min + " " + max);
        if (searchTerm != null && !searchTerm.isEmpty()) {
            if (brand != null && !brand.isEmpty()) {
                System.out.println(searchTerm);
                return productFilter.findBySearchTermAndCategoryAndPrice(searchTerm, brand, min, max, pageable);
            }
            return productFilter.findBySearchTermAndPriceRange(searchTerm, min, max, pageable);
        } else if (brand != null && !brand.isEmpty()) {
            return productFilter.findByCategoryAndPriceRange(brand, min, max, pageable);
        } else {
            return productFilter.findBySearchTermAndPriceRange(null, min, max, pageable);
        }
    }

    public Page<Product> searchProductCategoryPrice(String search, int min, int max, Pageable pageable) {
        return productFilter.findBySearchTermAndPriceRange(search, min, max, pageable);
    }


    public Page<Product> searchAllProducts(Pageable pageable) {
        return productRepo.findAll(pageable);
    }

    public ArrayList<Product> searchAllProductsWithOutPagination() {
        return (ArrayList<Product>) productRepo.findAll();
    }

    public void delete_product(Product product) {
        productRepo.delete(product);
    }
}