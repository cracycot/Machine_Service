package org.example.machine_service.controllers;


import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Null;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.example.machine_service.services.EmailService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.*;


import java.lang.reflect.Array;
import java.util.ArrayList;

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
            session.setAttribute("basket", new ArrayList<Product>());
        }
        model.addAttribute("title", "Главная страница");
        return "Main";
    }
    @PostMapping("/add-to-basket")
    public ResponseEntity<?> addToBasket(@RequestParam Long productId, HttpSession session) throws ProductNotFindException {
        // Attempt to retrieve the basket from the session.
        List<Product> basket = (List<Product>) session.getAttribute("basket");

        // If the basket is null, initialize a new one and add it to the session.
        if (basket == null) {
            basket = new ArrayList<>();
            session.setAttribute("basket", basket);
        }

        // Retrieve the product using the provided ID.
        Product product = productService.get_product(productId); // Implement this method.

        // If the product is not null, add it to the basket.
        if (product != null) {
            basket.add(product);
        }

        // Return a success response.
        return ResponseEntity.ok().body(Collections.singletonMap("result", "success"));
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
    @GetMapping("/Catalog")
    public String catalogProduct(Model model, @RequestParam(value = "page", defaultValue = "1") int page,
                                 @RequestParam(value = "search", required = false) String search,
                                 @RequestParam(value = "size", defaultValue = "3") int size) {
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
        List<Product> basket = (List<Product>) session.getAttribute("basket");

        // If the basket is null, initialize a new one and add it to the session.
        if (basket == null) {
            basket = new ArrayList<>();

            session.setAttribute("basket", basket);
        }
        model.addAttribute("items", basket);
        return "Basket";
    }

}
