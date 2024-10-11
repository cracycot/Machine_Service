package org.example.machine_service.controllers;

import org.example.machine_service.DTO.StockResponsDTO;
import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.services.ProductService;
import org.example.machine_service.services.UploadPhotosService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("product")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private UploadPhotosService uploadPhotosService;

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);


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
//            System.out.println("Получен продукт: " + product.getName());
//            System.out.println("Категория: " + product.getCategory());
//            System.out.println("Цена: " + product.getPrice());
//            System.out.println("Наличие: " + product.getInStock());
//
//            productService.createProduct(product);
//            return ResponseEntity.ok().body("Продукт сохранен");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body("Ошибка при создании продукта");
//        }
//    }

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("category") String category,
            @RequestParam("article") String article,
            @RequestParam("price") int price,
            @RequestParam("inStock") int inStock,
            @RequestPart("files") MultipartFile[] files) {

        try {
            // Обработка данных продукта
            Product product = new Product();
            product.setName(name);
            product.setCategory(category);
            product.setArticle(article);
            product.setPrice(price);
            product.setInStock(inStock);

            // Список для хранения URL загруженных изображений
            List<String> fileNames = new ArrayList<>();

            // Загрузка файлов на S3 и получение их URL
            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                uploadPhotosService.uploadImage(file, fileName);
                logger.info("загружено фото {}", fileName);
                fileNames.add(fileName);
            }

            // Установка URL изображений в продукт
            product.setFileNames(fileNames);

            // Сохранение продукта в базе данных
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
            productService.deleteProduct(delete_product);
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

    @GetMapping("/get/photos")
    public ResponseEntity<?> getProductImages(@RequestParam("productId") Long productId) {
        try {
            List<String> fileNames = productService.getProduct(productId).getFileNames();
            List<String> base64Images = new ArrayList<>();

            for (String fileName : fileNames) {
                logger.info("получен запрос на загрузку фото {}", fileName);
                byte[] photo = uploadPhotosService.getPhotoByte(fileName);
                // Преобразуем байты изображения в Base64-строку
                String base64Image = Base64.getEncoder().encodeToString(photo);
                base64Images.add(base64Image);
            }

            // Возвращаем список Base64-строк изображений в формате JSON
            return ResponseEntity.ok(base64Images);
        } catch (ProductNotFindException e) {
            logger.error("продукт не найден");
            return ResponseEntity.badRequest().body("Ошибка при получении изображений");
        }
    }

}
