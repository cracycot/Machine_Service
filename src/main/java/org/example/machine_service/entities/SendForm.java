package org.example.machine_service.entities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class SendForm {
    @NotEmpty(message = "Введите Ваше имя")
    @Size(min = 2, max = 25, message = "Имя должно быть больше 2 и меньше 25 букв")
    private String name;

    @NotEmpty(message = "Введите номер телефона")
    private String phoneNumber;
    private String motorNumber;
    private String description;

    @NotEmpty(message = "Введите Вашу почту")
    @Email
    private String email;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public @NotEmpty(message = "Введите номер телефона") String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(@NotEmpty(message = "Введите номер телефона") String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getMotorNumber() {
        return motorNumber;
    }

    public void setMotorNumber(String motorNumber) {
        this.motorNumber = motorNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
