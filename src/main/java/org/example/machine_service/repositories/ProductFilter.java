//package org.example.machine_service.repositories;
//import org.example.machine_service.entities.Product;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import java.util.List;
//public interface ProductFilter extends JpaRepository<Product, Long> {
//    @Query("SELECT p FROM Product p WHERE p.localId LIKE %:localId%")
//    List<Product> findByArticleContaining(String localId);
//}

package org.example.machine_service.repositories;

import org.example.machine_service.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductFilter extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.article LIKE %:searchTerm%")
    Page<Product> findByArticleContaining(String searchTerm, Pageable pageable);
}