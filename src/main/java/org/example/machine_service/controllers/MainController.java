package org.example.machine_service.controllers;


import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.example.machine_service.entities.Product;
import org.example.machine_service.entities.SendForm;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.repositories.ProductRepo;
import org.example.machine_service.services.ProductService;
import org.example.machine_service.services.UploadPhotosService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.example.machine_service.services.EmailService;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.util.*;

@Controller
public class MainController {
    private static final Logger logger = LoggerFactory.getLogger(MainController.class);
    @Autowired
    private EmailService emailService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private UploadPhotosService uploadPhotosService;

    @GetMapping("/")
    public String MainPage(HttpSession session, Model model) {
        if (session.getAttribute("basket") == null) {
            session.setAttribute("basket", new HashMap<Product, Integer>());
        }
        model.addAttribute("title", "Главная страница");
        return "Main";
    }


    @GetMapping("/Bid")
    public String BidPage(Model model) {
        model.addAttribute("title", "Оформление заявки");
        model.addAttribute("sendForm", new SendForm()); // Добавляем 'sendForm' в модель
        return "Bid";
    }

    @PostMapping("/Sendform")
    public String submitForm(@ModelAttribute("sendForm") @Valid SendForm sendForm, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return "Bid";
        }
        try {
            emailService.sendHtmlMessage(
                    sendForm.getName(),
                    sendForm.getMotorNumber(),
                    sendForm.getPhoneNumber(),
                    sendForm.getEmail(),
                    sendForm.getDescription());
            return "redirect:/";
        } catch (MessagingException e) {
            return "redirect:/Error";
        }
    }

    @PostMapping("/SendOrder")
    public ResponseEntity<Object> sendOrder(@Valid @RequestBody OrderRequest orderRequest) {
        HashMap<String, List<Object>> basket = orderRequest.getBasket();
        String contact = orderRequest.getContact();

        if (basket == null || basket.isEmpty() || contact == null || contact.isEmpty()) {
            return ResponseEntity.badRequest().body("Проверьте корректность корзины и контактных данных.");
        }
        try {
            emailService.sendOrder(basket, contact);
            return ResponseEntity.ok().body("Заказ успешно принят и находится в обработке.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Произошла ошибка при обработке вашего заказа.");
        }
    }


    // Внутренний класс для десериализации
    private static class OrderRequest {
        private HashMap<String, List<Object>> basket;
        private String contact;

        // Геттеры и сеттеры
        public HashMap<String, List<Object>> getBasket() {
            return basket;
        }

        public void setBasket(HashMap<String, List<Object>> basket) {
            this.basket = basket;
        }

        public String getContact() {
            return contact;
        }

        public void setContact(String contact) {
            this.contact = contact;
        }
    }


    @GetMapping("/Catalog")
    public String catalogProduct(Model model, @RequestParam(value = "page", defaultValue = "1") int page,
                                 @RequestParam(value = "search", required = false) String search,
                                 @RequestParam(value = "size", defaultValue = "5") int size) {
        Pageable pageable =  PageRequest.of(page - 1, size);
        Page<Product> elements;
        elements = productService.searchAllProducts(pageable);
        if (search == null) {
        } else {
//            elements = productService.searchProduct(search, pageable);
        }
        model.addAttribute("title", "Каталог");
        model.addAttribute("items", elements);
        model.addAttribute("page", elements);
        model.addAttribute("currentPage", elements.getNumber() + 1); // +1 потому что Page индексируется с 0
        model.addAttribute("totalPages", elements.getTotalPages());
        logger.info("элементов в каталоге {}", elements.getTotalElements());
        model.addAttribute("pageSize", elements.getSize());
        return "Catalog";
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadPhoto(@RequestParam("file") MultipartFile file,
                                                           @RequestParam("fileName") String fileName) {
        try {
            logger.info("Фото отправлено {}", fileName);
            String imageUrl = uploadPhotosService.uploadImage(file, fileName);
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image"));
        }
    }


    @GetMapping("/product/{id}")
    public String getProductDetail(@PathVariable Long id, Model model) throws ProductNotFindException {
        Product product = productService.getProduct(id);
        model.addAttribute("product", product);
        System.out.println(id);
        return "ProductDetails"; // Название шаблона Thymeleaf для детальной страницы товара
    }
}
