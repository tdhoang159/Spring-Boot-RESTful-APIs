package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import jakarta.validation.constraints.NotNull;

public class CreateQrRequest {

    @NotNull(message = "orderId không được để trống")
    private Long orderId;

    public CreateQrRequest() {}
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
}
