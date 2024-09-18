package org.example.machine_service.DTO;

public class BasketUpdateRequest {
    private String productName;
    private int page;

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }
}
