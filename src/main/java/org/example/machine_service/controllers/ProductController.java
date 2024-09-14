package org.example.machine_service.controllers;

import org.example.machine_service.entities.Product;
import org.example.machine_service.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("product")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping("/home")
    public ResponseEntity<?>  CheckCorrect() {
        try {
            return ResponseEntity.ok().body("сервер запущен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    @GetMapping("/getproduct")
    public ResponseEntity<?>  GetProduct(@RequestParam Long id) {
        try {
            Product product = productService.get_product(id);
            return ResponseEntity.ok().body(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

//    @GetMapping("/searchproduct")
//    public ResponseEntity SearchProduct(@RequestParam String id,
//                                        @RequestParam(value = "page", defaultValue = "1") int page,
//                                        @RequestParam(value = "size", defaultValue = "10") int size
//    ) {
//        try {
//            Pageable pageable = PageRequest.of(page - 1, size);
//            Page<Product> products = productService.searchProduct(id, pageable);
//            return ResponseEntity.ok().body(products);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("произошла ошибка");
//        }
//    }

    @PostMapping("/create")
    public ResponseEntity<?>  CreateProduct(@RequestBody Product product) {
        try {
            productService.create_product(product);
            return ResponseEntity.ok().body("продукт сохранен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("неверная запись");
        }
    }

    @PatchMapping("/updateproduct")
    public ResponseEntity<?> UpdateProduct(@RequestParam Long id, @RequestBody Product product) {
        try {
            Product past_product = productService.get_product(id);
            if (product.getPrice() != 0) {
                past_product.setPrice(product.getPrice());
            }
            if (product.getInStock() != 0) {
                past_product.setInStock(product.getInStock());
            }
            if (!product.getName().isEmpty()) {
                past_product.setName(product.getName());
            }
            productService.update_product(past_product);
            return ResponseEntity.ok().body("продукт обновлен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    @DeleteMapping("/deleteproduct")
    public ResponseEntity<?> DeleteProduct(@RequestParam Long id) {
        try {
            Product delete_product = productService.get_product(id);
            productService.delete_product(delete_product);
            return ResponseEntity.ok().body("продукт удален");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    //    @DeleteMapping("/deleteproduct")
//    public ResponseEntity DeleteProduct(@RequestParam Long id) {
//        try {
//            Product delete_product = productService.get_product(id);
//            productService.delete_product(delete_product);
//            return ResponseEntity.ok().body("продукт удален");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("произошла ошибка");
//        }
//    }
    @GetMapping("/getallproducts")
    public ResponseEntity<?> GetAllProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        Pageable pageable = (Pageable) PageRequest.of(page - 1, size);
        Page<Product> products = productService.searchAllProducts(pageable);
        return new ResponseEntity<>(products.getContent(), HttpStatus.OK);
    }


    //    @GetMapping("/searchproduct")
//    public ResponseEntity<List<Product>> searchProduct(
//            @RequestParam(value = "search", required = false) String search,
//            @RequestParam(value = "page", defaultValue = "1") int page,
//            @RequestParam(value = "size", defaultValue = "5") int size) {
//
//        Pageable pageable = (Pageable) PageRequest.of(page - 1, size); // Постраничное отображение
//        Page<Product> products;
//
//        if (search != null && !search.isEmpty()) {
//            products = productService.searchProduct(search, pageable);
//        } else {
//            products = productService.searchAllProducts(pageable);
//        }
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Total-Pages", String.valueOf(products.getTotalPages()));
//
//        return new ResponseEntity<>(products.getContent(), headers, HttpStatus.OK);
//    }
//
//    @GetMapping("/filterproduct")
//    public ResponseEntity<List<Product>> filterProduct(
//            @RequestParam(value = "search", required = false) String search,
//            @RequestParam(value = "min", defaultValue = "0") int min,
//            @RequestParam(value = "max", defaultValue = "100000000") int max,
//            @RequestParam(value = "page", defaultValue = "1") int page,
//            @RequestParam(value = "size", defaultValue = "5") int size) {
//
//        Pageable pageable = (Pageable) PageRequest.of(page - 1, size); // Постраничное отображение
//        Page<Product> products;
//
//        if (search != null && !search.isEmpty()) {
//            products = productService.searchProductCategoryPrice(search, min, max, pageable);
//        } else {
//            products = productService.searchAllProducts(pageable);
//        }
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Total-Pages", String.valueOf(products.getTotalPages()));
//
//        return new ResponseEntity<>(products.getContent(), headers, HttpStatus.OK);
//    }
    @GetMapping("/filterproduct")
    public ResponseEntity<List<Product>> filterProduct(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "min", defaultValue = "0") int min,
            @RequestParam(value = "max", defaultValue = "100000000") int max,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page - 1, size);
        if (brand != null) {
            System.out.println(brand);
        }
        Page<Product> products = productService.searchProduct(search, brand, min, max, pageable);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Total-Pages", String.valueOf(products.getTotalPages()));

        return new ResponseEntity<>(products.getContent(), headers, HttpStatus.OK);
    }

}
