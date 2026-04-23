package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.truongduchoang.SpringBootRESTfullAPIs.services.EmailSenderService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.from:noreply@eventmanagement.com}")
    private String fromEmail;

    public EmailSenderServiceImpl(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendEmail(String to, String subject, String content) {
        try {
            sendEmailInternal(to, subject, content);
        } catch (Exception ex) {
            System.err.println("Failed to send email to " + to + ": " + ex.getMessage());
            ex.printStackTrace();
        }
    }

    @Override
    public void sendBulkEmail(List<String> recipients, String subject, String content) {
        for (String recipient : recipients) {
            try {
                sendEmailInternal(recipient, subject, content);
            } catch (Exception ex) {
                System.err.println("Failed to send email to " + recipient + ": " + ex.getMessage());
            }
        }
    }

    private void sendEmailInternal(String to, String subject, String content) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(formatEmailContent(content), true);

        javaMailSender.send(message);
        System.out.println("Email sent successfully to: " + to);
    }

    private String formatEmailContent(String content) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; }" +
                ".header { background-color: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }" +
                ".content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }" +
                ".footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }" +
                "a { color: #007bff; text-decoration: none; }" +
                ".button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>Event Management System</h2>" +
                "</div>" +
                "<div class='content'>" +
                content +
                "</div>" +
                "<div class='footer'>" +
                "<p>&copy; 2026 Event Management System. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}

