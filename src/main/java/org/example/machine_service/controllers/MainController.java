package org.example.machine_service.controllers;


import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.example.machine_service.entities.Product;
import org.example.machine_service.entities.SendForm;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.repositories.ProductRepo;
import org.example.machine_service.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.example.machine_service.services.EmailService;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;

@Controller
public class MainController  {
    @Autowired
    private EmailService emailService;
    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepo productRepo;

    @GetMapping("/")
    public  String MainPage(HttpSession session, Model model) {
        if (session.getAttribute("basket") == null) {
            session.setAttribute("basket", new HashMap<Product, Integer>());
        }
        model.addAttribute("title", "Главная страница");
        return "Main";
    }
    @PostMapping("/add-to-basket")
    public ResponseEntity<?> addToBasket(@RequestParam Long productId, HttpSession session) throws ProductNotFindException {
        // Попытаться получить корзину из сессии.
        HashMap<String, List<Object>> basket =
                (HashMap<String, List<Object>>) session.getAttribute("basket");

        if (basket == null) {
            basket = new HashMap<>();
            session.setAttribute("basket", basket);
        }

        // Извлечь продукт, используя предоставленный ID.
        Product product = productService.get_product(productId); // Реализовать этот метод.

        if (product != null) {
            String productName = product.getName();
            // Проверить, есть ли продукт уже в корзине
            if (basket.containsKey(productName) && ((Integer)(basket.get(productName)).get(0) < (Integer)(basket.get(productName)).get(4))) {
                // Обновить существующее количество продукта
                List<Object> existingEntry = basket.get(productName);
                existingEntry.set(0, (Integer) existingEntry.get(0) + 1); // Увеличить количество на 1
            } else if (!basket.containsKey(productName)) {
                // Продукт отсутствует в корзине, добавить новую запись
                List<Object> productDetails = Arrays.asList(
                        1, // Количество
                        product.getCategory(),
                        product.getArticle(),
                        product.getPrice(),
                        product.getInStock()
                );
                basket.put(productName, productDetails);
            }
        }
        // Вернуть успешный ответ.
        return ResponseEntity.ok().body(Collections.singletonMap("result", "success"));
    }
    @PostMapping("/basket/increase")
    public ResponseEntity<?> increaseQuantity(@RequestParam String productName, HttpSession session) {
        return updateQuantity(session, productName, 1);
    }
    @PostMapping("/basket/decrease")
    public ResponseEntity<?> decreaseQuantity(@RequestParam String productName, HttpSession session) {
        return updateQuantity(session, productName, -1);
    }

    private synchronized ResponseEntity<?> updateQuantity(HttpSession session, String productName, int change) {
        HashMap<String, List<Object>> basket = (HashMap<String, List<Object>>) session.getAttribute("basket");
        if (basket != null && basket.containsKey(productName)) {
            List<Object> productDetails = basket.get(productName);
            int currentQuantity = (Integer) productDetails.get(0);
            int inStock = (Integer) productDetails.get(4);

            int newQuantity = currentQuantity + change;

            if (newQuantity > 0 && newQuantity <= inStock) {
                productDetails.set(0, newQuantity);
            } else if (newQuantity <= 0) {
                basket.remove(productName);
            } else {
                return ResponseEntity.badRequest().body("Невозможно обновить количество товара, превышено количество на складе.");
            }

            session.setAttribute("basket", basket);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/Bid")
    public String BidPage(Model model) {
        model.addAttribute("title", "Оформление заявки");
        model.addAttribute("sendForm", new SendForm()); // Добавляем 'sendForm' в модель
        return "Bid";
    }
    @GetMapping("/Success")
    public String SuccessPage(Model model) {
        model.addAttribute("title", "Спасибо за заявку");
        model.addAttribute("message", "Спасибо за заявку, Вам перезвонят");
        return "SuccessError";
    }
    @GetMapping("/Error")
    public String ErrorPage(Model model) {
        model.addAttribute("title", "Что-то пошло не так");
        model.addAttribute("message", "Что-то пошло не так, попробуйте позже");
        return "SuccessError";
    }
    @GetMapping("/Sendform")
    public String showForm(Model model) {
        SendForm sendForm = new SendForm();
        model.addAttribute("sendForm", sendForm);
        return "Bid";
    }


    @PostMapping("/Sendform")
    public String submitForm(@ModelAttribute("sendForm") @Valid SendForm sendForm, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            return"Bid";
        }
        try {
            emailService.sendHtmlMessage(
                    sendForm.getName(),
                    sendForm.getMotor_number(),
                    sendForm.getPhone_number(),
                    sendForm.getEmail(),
                    sendForm.getDescription());
            return "redirect:/Success";
        } catch (MessagingException e) {
            return "redirect:/Error";
        }
    }
//    @PostMapping("/SendOrder")
//    public ResponseEntity<Object> sendOrder(@RequestBody OrderRequest orderRequest) {
//        HashMap<String, List<Object>> basket = orderRequest.getBasket();
//        String contact = orderRequest.getContact();
//
//        if (!(basket.isEmpty() || contact.isEmpty())) {
//            emailService.sendOrder(basket, contact);
//        }
//        return ResponseEntity.ok().body("Письмо отправлено");
//    }
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

    @GetMapping("/CleanBasket")
    public ResponseEntity<?> cleanBasket(HttpSession session) {
        session.setAttribute("basket", new HashMap<String, List<Object>>() );
        return ResponseEntity.ok().build();
    }
    // Внутренний класс для десериализации
    private static class OrderRequest {
        private HashMap<String, List<Object>> basket;
        private String contact;

        // Геттеры и сеттеры
        public HashMap<String, List<Object>> getBasket() { return basket; }
        public void setBasket(HashMap<String, List<Object>> basket) { this.basket = basket; }
        public String getContact() { return contact; }
        public void setContact(String contact) { this.contact = contact; }
    }


    @GetMapping("/Catalog")
    public String catalogProduct(Model model, @RequestParam(value = "page", defaultValue = "1") int page,
                                 @RequestParam(value = "search", required = false) String search,
                                 @RequestParam(value = "size", defaultValue = "5") int size) {
        Pageable pageable = (Pageable) PageRequest.of(page - 1, size);
        Page<Product> elements;
        if (search == null) {
            elements = productService.searchAllProducts(pageable);
        }
        else {
            elements = productService.searchProduct(search, pageable);
        }
        model.addAttribute("title", "Каталог");
        model.addAttribute("items", elements);
        model.addAttribute("page", elements);
        model.addAttribute("currentPage", elements.getNumber() + 1); // +1 потому что Page индексируется с 0
        model.addAttribute("totalPages", elements.getTotalPages());
        model.addAttribute("pageSize", elements.getSize());
        return "Catalog";
    }
    @GetMapping("/Basket")
    public String basket(Model model, HttpSession session) {
        HashMap<String, List<Object>> basket = ( HashMap<String, List<Object>>) session.getAttribute("basket");

        // If the basket is null, initialize a new one and add it to the session.
        if (basket == null) {
            basket = new HashMap<String, List<Object>>();

            session.setAttribute("basket", basket);
        }
        model.addAttribute("items", basket);
        return "Basket";
    }
    @GetMapping("/MainPage")
    public String MainPage(Model model) {
        return "MainPage";
    }

}
