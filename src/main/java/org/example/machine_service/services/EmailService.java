package org.example.machine_service.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import static java.awt.SystemColor.text;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendHtmlMessage(String name, String motor_number, String phone_number, String email, String text) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Customize the HTML content
        String htmlContent = "<h3>Заказ</h3>"
                + "<p><strong>Имя:</strong> " + name + "</p>"
                + "<p><strong>Номер мотора:</strong> " + motor_number + "</p>"
                + "<p><strong>Телефон:</strong> " + phone_number + "</p>"
                + "<p><strong>Email:</strong> " + email + "</p>"
                + "<p><strong>Сообщение:</strong> " + text + "</p>";

        helper.setFrom("no-reply@example.com");
        helper.setTo("cracycot@mail.ru");
        helper.setSubject("Заказ");
        helper.setText(htmlContent, true); // true indicates the content is HTML

        mailSender.send(mimeMessage);
    }

}
