
package org.example.machine_service.repositories;

import org.example.machine_service.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductFilter extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE (:search IS NULL OR p.article LIKE %:search% OR p.category LIKE %:search%) AND p.price BETWEEN :min AND :max")
    Page<Product> findBySearchTermAndPriceRange(@Param("search") String search, @Param("min") int min, @Param("max") int max, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE (:brand IS NULL OR p.category LIKE %:brand%) AND p.price BETWEEN :min AND :max")
    Page<Product> findByCategoryAndPriceRange(@Param("brand") String brand, @Param("min") int min, @Param("max") int max, Pageable pageable);


    @Query("SELECT p FROM Product p WHERE " +
            "(:search IS NULL OR p.article LIKE %:search%) AND " +
            "(:brand IS NULL OR p.category = :brand) AND " +
            "(p.price BETWEEN :min AND :max)")
    Page<Product> findBySearchTermAndCategoryAndPrice(@Param("search") String search,@Param("brand") String brand, @Param("min") int min, @Param("max") int max, Pageable pageable);
}
