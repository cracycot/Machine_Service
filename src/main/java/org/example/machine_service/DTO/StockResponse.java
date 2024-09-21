package org.example.machine_service.DTO;


public class StockResponse {
    private Integer newStock;
    private String error;

    // Constructors
    public StockResponse(Integer newStock) {
        this.newStock = newStock;
    }

    public StockResponse(String error) {
        this.error = error;
    }

    // Getters and Setters
    public Integer getNewStock() {
        return newStock;
    }

    public void setNewStock(Integer newStock) {
        this.newStock = newStock;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
