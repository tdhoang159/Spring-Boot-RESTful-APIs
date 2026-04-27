package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import java.math.BigDecimal;

public class PaymentStatusResponse {

    private Long orderId;
    private String orderCode;
    private String status;       // pending | paid | cancelled
    private BigDecimal paidAmount;

    public PaymentStatusResponse() {}

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
}