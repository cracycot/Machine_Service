package org.example.machine_service.controllers;

import org.example.machine_service.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    @GetMapping // Маршрут для получения главной страницы админ-панели
    public String admin(Model model) {
        // Обращение к сервису для получения страницы с товарами
        model.addAttribute("products", productService.searchAllProductsWithOutPagination());
        return "Admin"; // Имя шаблона страницы в каталоге templates (без .html)
    }

}