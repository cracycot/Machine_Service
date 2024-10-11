package org.example.machine_service.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;

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
    @CollectionTable(
            name = "product_file_names",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "file_name")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<String> fileNames;

    public Product(String name, String category, String article, int price, int inStock, ArrayList<String> fileNames) {
        this.name = name;
        this.category = category.toLowerCase();
        this.article = article;
        this.price = price;
        this.inStock = inStock;
        this.fileNames = fileNames;
    }

    public Product() {
        this.name = "";
        category = "";
        this.price = 10000000;
        this.inStock = 0;
        this.article = "";
        this.fileNames = new ArrayList<>();
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

    public List<String> getFileNames() {
        return fileNames;
    }

    public void setFileNames(List<String> fileNames) {
        this.fileNames = fileNames;
    }
}
