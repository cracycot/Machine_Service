package org.example.machine_service.repositories;

import org.example.machine_service.entities.Product;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ProductRepo extends CrudRepository<Product, Long> {
    Product findByName(String name);
    Optional<Product> findById(Long id); //Почему так?Откуда ошибка
}
