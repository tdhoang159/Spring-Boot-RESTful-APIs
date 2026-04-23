package com.truongduchoang.SpringBootRESTfullAPIs.services;

public interface EmailSenderService {

    void sendEmail(String to, String subject, String content);

    void sendBulkEmail(java.util.List<String> recipients, String subject, String content);
}
