CREATE TABLE product (
         id BIGINT AUTO_INCREMENT PRIMARY KEY,
         name VARCHAR(255) NOT NULL,
         category VARCHAR(255),
         article VARCHAR(255),
         price INT NOT NULL,
         in_stock INT NOT NULL
);
