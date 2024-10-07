package org.example.machine_service.controllers;

import jakarta.servlet.http.HttpSession;
import org.example.machine_service.DTO.BasketUpdateRequestDTO;
import org.example.machine_service.entities.Product;
import org.example.machine_service.exeptions.ProductNotFindException;
import org.example.machine_service.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Controller
public class BasketController {
    @Autowired
    private ProductService productService;

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
        Product product = productService.getProduct(productId); // Реализовать этот метод.
        if (product != null) {
            String productName = product.getName();
            // Проверить, есть ли продукт уже в корзине
            if (basket.containsKey(productName) && ((Integer) (basket.get(productName)).get(0) < (Integer) (basket.get(productName)).get(4))) {
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
    public ResponseEntity<?> increaseQuantity(@RequestBody BasketUpdateRequestDTO request, HttpSession session) {
        System.out.println(request.productName());
        return updateQuantity(session, request.productName(), 1, request.page());
    }

    @PostMapping("/basket/decrease")
    public ResponseEntity<?> decreaseQuantity(@RequestBody BasketUpdateRequestDTO request, HttpSession session) {
        return updateQuantity(session, request.productName(), -1, request.page());
    }


    private synchronized ResponseEntity<?> updateQuantity(HttpSession session, String productName, int change, int page) {
        HashMap<String, List<Object>> basket = (HashMap<String, List<Object>>) session.getAttribute("basket");
        if (basket == null) {
            basket = new HashMap<>();
            session.setAttribute("basket", basket);
        }
        System.out.println(basket);
        if (basket.containsKey(productName)) {
            int currentQuantity = (Integer) basket.get(productName).get(0);
            int inStock = (Integer) basket.get(productName).get(4);

            int newQuantity = currentQuantity + change;

            if (newQuantity > 0 && newQuantity <= inStock) {
                basket.get(productName).set(0, newQuantity);
            } else if (newQuantity <= 0) {
                basket.remove(productName);
            } else {
                return ResponseEntity.badRequest().body("Невозможно обновить количество товара, превышено количество на складе.");
            }

            session.setAttribute("basket", basket);

            List<Map<String, Object>> itemsList = new ArrayList<>();
            for (Map.Entry<String, List<Object>> entry : basket.entrySet()) {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("name", entry.getKey());
                itemMap.put("inBasket", entry.getValue().get(0));
                itemMap.put("article", entry.getValue().get(2));
                itemMap.put("price", entry.getValue().get(3));
                itemMap.put("inStock", entry.getValue().get(4));
                itemsList.add(itemMap);
            }

            int totalItems = basket.size();
            int start = (page - 1) * 5;
            int end = Math.min(start + 5, totalItems);
            List<Map<String, Object>> pageItems = itemsList.subList(start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("items", pageItems);


            int pageSize = 5;
            int totalPages = (int) Math.ceil((double) totalItems / pageSize);

            response.put("totalPages", totalPages);
            response.put("totalItems", totalItems);
            response.put("numberInBasket", newQuantity);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/CleanBasket")
    public ResponseEntity<?> cleanBasket(HttpSession session) {
        session.setAttribute("basket", new HashMap<String, List<Object>>());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/Basket")
    public String basket(Model model, HttpSession session) {
        HashMap<String, List<Object>> basket = (HashMap<String, List<Object>>) session.getAttribute("basket");
        System.out.println(basket);
        // If the basket is null, initialize a new one and add it to the session.
        if (basket == null) {
            basket = new HashMap<String, List<Object>>();
            session.setAttribute("basket", basket);
        }
        model.addAttribute("items", basket);
        model.addAttribute("totalPages", (basket.size() + 4) / 5);
        return "Basket";
    }
    @GetMapping("/basket/products")
    public ResponseEntity<Map<String, Object>> getBasketProducts(
            HttpSession session,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        HashMap<String, List<Object>> basket = (HashMap<String, List<Object>>) session.getAttribute("basket");

        if (basket == null) {
            basket = new HashMap<>();
        }

        List<Map<String, Object>> itemsList = new ArrayList<>();
        for (Map.Entry<String, List<Object>> entry : basket.entrySet()) {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("name", entry.getKey());
            itemMap.put("inBasket", entry.getValue().get(0));
            itemMap.put("article", entry.getValue().get(2));
            itemMap.put("price", entry.getValue().get(3));
            itemMap.put("inStock", entry.getValue().get(4));
            itemsList.add(itemMap);
        }

        int totalItems = itemsList.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);

        int start = (page - 1) * size;
        int end = Math.min(start + size, totalItems);
        List<Map<String, Object>> pageItems = itemsList.subList(start, end);

        Map<String, Object> response = new HashMap<>();
        response.put("items", pageItems);
        response.put("totalPages", totalPages);
        response.put("currentPage", page);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
