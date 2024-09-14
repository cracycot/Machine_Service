package org.example.machine_service.repositories;

import org.example.machine_service.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

//public interface ProductRepo extends CrudRepository<Product, Long> {
//    Product findByName(String name);
//    Optional<Product> findById(Long id);
//    Page<Product> findByArticleContaining(String searchTerm, Pageable pageable);
//}

public interface ProductRepo extends JpaRepository<Product, Long> {
    Product findByName(String name);

    Optional<Product> findById(Long id);

    Page<Product> findByArticleContaining(String searchTerm, Pageable pageable);

    Page<Product> findByCategory(String searchTerm, Pageable pageable);
}