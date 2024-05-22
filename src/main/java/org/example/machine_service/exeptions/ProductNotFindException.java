package org.example.machine_service.exeptions;

public class ProductNotFindException extends Exception {
    public ProductNotFindException(String message) {
        super(message);
    }
}
