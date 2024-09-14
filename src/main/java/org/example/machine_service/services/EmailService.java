package org.example.machine_service.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import static java.awt.SystemColor.text;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendHtmlMessage(String name, String motor_number, String phone_number, String email, String text) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        // Customize the HTML content
        String htmlContent = "<h3>Заявка</h3>"
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

    public void sendOrder(HashMap<String, List<Object>> basket, String contact) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            StringBuilder htmlContent = new StringBuilder("<h3>Заказ</h3>" + "<ul>");

            // Customize the HTML content
            for (String key : basket.keySet()) {
                List<Object> value = basket.get(key);
                htmlContent.append("<li>" + "<p><strong>Название товара:</strong> ").append(key).append("</p>")
                        .append("<p><strong>Кол-во</strong> ").append(value.get(0)).append("</p>")
                        .append("<p><strong>Бренд</strong> ").append(value.get(1)).append("</p>")
                        .append("<p><strong>Цена</strong> ").append(value.get(2)).append("</p>").append("</li>");
            }
            htmlContent.append("</ul>" + "<p><strong>Контакты</strong> ").append(contact).append("</p>");

            helper.setFrom("no-reply@example.com");
            helper.setTo("cracycot@mail.ru");
            helper.setSubject("Заказ");
            helper.setText(htmlContent.toString(), true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Обработка исключения MessagingException
            e.printStackTrace();
            // Возможно, вы захотите здесь добавить дополнительную логику обработки ошибок
        }
    }

}
