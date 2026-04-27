package com.truongduchoang.SpringBootRESTfullAPIs.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "sepay")
public class SepayConfig {

    private String bankAccount;
    private String bankAccountNumber;
    private String bankShortName;
    private String paymentPrefix;
    private String qrBaseUrl;
    private int expireMinutes = 10;

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankAccountNumber() { return bankAccountNumber; }
    public void setBankAccountNumber(String bankAccountNumber) { this.bankAccountNumber = bankAccountNumber; }
    public String getBankShortName() { return bankShortName; }
    public void setBankShortName(String bankShortName) { this.bankShortName = bankShortName; }
    public String getPaymentPrefix() { return paymentPrefix; }
    public void setPaymentPrefix(String paymentPrefix) { this.paymentPrefix = paymentPrefix; }
    public String getQrBaseUrl() { return qrBaseUrl; }
    public void setQrBaseUrl(String qrBaseUrl) { this.qrBaseUrl = qrBaseUrl; }
    public int getExpireMinutes() { return expireMinutes; }
    public void setExpireMinutes(int expireMinutes) { this.expireMinutes = expireMinutes; }
}