package org.example.machine_service.entities;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = false)
    private String name;
    private String category;
    private String article;
    private int price;
    @Column(name = "in_stock")
    private int inStock;
    @ElementCollection
    private List<String> imageUrls;

    public Product(String name, String category, String article, int price, int inStock, ArrayList<String> imageUrls) {
        this.name = name;
        this.category = category.toLowerCase();
        this.article = article;
        this.price = price;
        this.inStock = inStock;
        this.imageUrls = imageUrls;
    }

    public Product() {
        this.name = "";
        category = "";
        this.price = 10000000;
        this.inStock = 0;
        this.article = "";
        this.imageUrls = new ArrayList<>();
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

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
