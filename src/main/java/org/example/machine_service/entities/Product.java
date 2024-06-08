package org.example.machine_service.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private String article;
    private int price;
    private int inStock;

    public String getLocalId() {
        return article;
    }

    public void setLocalId(String article) {
        this.article = article;
    }
    public Product(String name, String category, int price, int inStock) {
        this.name = name;
        this.category = category;
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
        this.category = category;
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
