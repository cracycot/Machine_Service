package org.example.machine_service.repositories;

import org.example.machine_service.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepo extends JpaRepository<Product, Long> {
    Product findByName(String name);

    Optional<Product> findById(Long id);

}