package org.example.machine_service.controllers;

import org.example.machine_service.DTO.StockResponsDTO;
import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
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
    public ResponseEntity<?> CheckCorrect() {
        try {
            return ResponseEntity.ok().body("сервер запущен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    @GetMapping("/getproduct")
    public ResponseEntity<?> GetProduct(@RequestParam Long id) {
        try {
            Product product = productService.getProduct(id);
            return ResponseEntity.ok().body(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    // Increase stock by 1
    @PostMapping("/increaseStock")
    public ResponseEntity<StockResponsDTO> increaseStock(@RequestParam("id") Long id) {
        try {
            Product product = productService.getProduct(id);
            product.setInStock(product.getInStock() + 1);
            productService.updateProduct(product);
            return ResponseEntity.ok(new StockResponsDTO(product.getInStock()));
        } catch (ProductNotFindException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StockResponsDTO("Product not found"));
        }
    }

    // Decrease stock by 1
    @PostMapping("/decreaseStock")
    public ResponseEntity<StockResponsDTO> decreaseStock(@RequestParam("id") Long id) {
        try {
            Product product = productService.getProduct(id);
            if (product.getInStock() > 1) { // Ensure stock does not go below 0
                product.setInStock(product.getInStock() - 1);
                productService.updateProduct(product);
                return ResponseEntity.ok(new StockResponsDTO(product.getInStock()));
            } else {
                return ResponseEntity.badRequest().body(new StockResponsDTO("Stock cannot be less than 0"));
            }
        } catch (ProductNotFindException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new StockResponsDTO("Product not found"));
        }
    }

//    @PostMapping("/create")
//    public ResponseEntity<?> CreateProduct(@RequestBody Product product) {
//        try {
//            productService.create_product(product);
//            return ResponseEntity.ok().body("продукт сохранен");
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("неверная запись");
//        }
//    }
    @PostMapping("/create")
    public ResponseEntity<?> CreateProduct(@RequestBody Product product) {
        try {
            System.out.println("Получен продукт: " + product.getName());
            System.out.println("Категория: " + product.getCategory());
            System.out.println("Цена: " + product.getPrice());
            System.out.println("Наличие: " + product.getInStock());

            productService.createProduct(product);
            return ResponseEntity.ok().body("Продукт сохранен");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Ошибка при создании продукта");
        }
    }


    @PatchMapping("/updateproduct")
    public ResponseEntity<?> UpdateProduct(@RequestParam Long id, @RequestBody Product product) {
        try {
            Product past_product = productService.getProduct(id);
            if (product.getPrice() != 0) {
                past_product.setPrice(product.getPrice());
            }
            if (product.getInStock() != 0) {
                past_product.setInStock(product.getInStock());
            }
            if (!product.getName().isEmpty()) {
                past_product.setName(product.getName());
            }
            productService.updateProduct(past_product);
            return ResponseEntity.ok().body("продукт обновлен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    @DeleteMapping("/deleteproduct")
    public ResponseEntity<?> DeleteProduct(@RequestParam Long id) {
        try {
            Product delete_product = productService.getProduct(id);
            productService.delete_product(delete_product);
            return ResponseEntity.ok().body("продукт удален");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }

    @GetMapping("/getallproducts")
    public ResponseEntity<?> GetAllProducts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        Pageable pageable = (Pageable) PageRequest.of(page - 1, size);
        Page<Product> products = productService.searchAllProducts(pageable);
        return new ResponseEntity<>(products.getContent(), HttpStatus.OK);
    }

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
