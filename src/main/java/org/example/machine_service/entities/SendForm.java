package org.example.machine_service.entities;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class SendForm {
    @NotEmpty(message = "Введите Ваше имя")
    @Size(min = 2, max = 25, message = "Имя должно быть больше 2 и меньше 25 букв")
    private String name;

    @NotEmpty(message = "Введите номер телефона")
    private String phone_number;
    private String motor_number;
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

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getMotor_number() {
        return motor_number;
    }

    public void setMotor_number(String motor_number) {
        this.motor_number = motor_number;
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
