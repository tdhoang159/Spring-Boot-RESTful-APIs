package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private String status;       // SUCCESS / FAILED / PENDING
    private String message;      // Mô tả kết quả cho user
    private String orderCode;
    private BigDecimal amount;
    private LocalDateTime paidAt;

    public PaymentResponse() {}

    // Factory methods cho tiện dùng trong Service
    public static PaymentResponse success(String orderCode, BigDecimal amount, LocalDateTime paidAt) {
        PaymentResponse r = new PaymentResponse();
        r.status = "SUCCESS";
        r.message = "Thanh toán thành công";
        r.orderCode = orderCode;
        r.amount = amount;
        r.paidAt = paidAt;
        return r;
    }

    public static PaymentResponse failed(String orderCode, String reason) {
        PaymentResponse r = new PaymentResponse();
        r.status = "FAILED";
        r.message = reason;
        r.orderCode = orderCode;
        return r;
    }

    public static PaymentResponse pending(String orderCode) {
        PaymentResponse r = new PaymentResponse();
        r.status = "PENDING";
        r.message = "Đang chờ thanh toán";
        r.orderCode = orderCode;
        return r;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}
