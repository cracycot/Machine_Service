package org.example.machine_service.controllers;
import org.example.machine_service.entities.Product;
import org.example.machine_service.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("product")
public class ProductController {
    @Autowired
    private ProductService productService;
    @GetMapping("/home")
    public ResponseEntity CheckCorrect() {
        try {
            return ResponseEntity.ok().body("сервер запущен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }
    @GetMapping("/getproduct")
    public ResponseEntity GetProduct(@RequestParam  Long id) {
        try {
            Product product = productService.get_product(id);
            return ResponseEntity.ok().body(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }
    @PostMapping("/create")
    public ResponseEntity CreateProduct(@RequestBody Product product) {
        try {
            System.out.println("dn gkfjlmsd,");
            productService.create_product(product);
            return ResponseEntity.ok().body("продукт сохранен");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("неверная запись");
        }
    }
    @PatchMapping("/updateproduct")
    public ResponseEntity UpdateProduct(@RequestParam Long id, @RequestBody Product product) {
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
    public ResponseEntity DeleteProduct(@RequestParam Long id) {
        try {
            Product delete_product = productService.get_product(id);
            productService.delete_product(delete_product);
            return ResponseEntity.ok().body("продукт удален");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("произошла ошибка");
        }
    }
}
