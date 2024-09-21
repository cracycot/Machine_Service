package org.example.machine_service.entities;

import jakarta.persistence.*;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private String article;
    private int price;
    @Column(name = "in_stock")
    private int inStock;

    public Product(String name, String category, String article, int price, int inStock) {
        this.name = name;
        this.category = category.toLowerCase();
        this.article = article;
        this.price = price;
        this.inStock = inStock;

    }

    public Product() {
        this.name = "";
        category = "";
        this.price = 10000000;
        this.inStock = 0;
        this.article = "";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public int getInStock() {
        return inStock;
    }

    public void setInStock(int inStock) {
        this.inStock = inStock;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category.toLowerCase();
    }

    public String getArticle() {
        return article;
    }

    public void setArticle(String article) {
        this.article = article;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public Long getId() {
        return id;
    }
}
