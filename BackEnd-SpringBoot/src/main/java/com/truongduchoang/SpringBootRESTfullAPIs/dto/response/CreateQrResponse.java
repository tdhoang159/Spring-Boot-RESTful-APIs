package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

public class CreateQrResponse {

    private String qrUrl;
    private Long orderId;
    private String orderCode;
    private String description; // nội dung chuyển khoản user cần nhập

    public CreateQrResponse() {}

    public CreateQrResponse(String qrUrl, Long orderId,
                            String orderCode, String description) {
        this.qrUrl       = qrUrl;
        this.orderId     = orderId;
        this.orderCode   = orderCode;
        this.description = description;
    }

    public String getQrUrl() { return qrUrl; }
    public void setQrUrl(String qrUrl) { this.qrUrl = qrUrl; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
