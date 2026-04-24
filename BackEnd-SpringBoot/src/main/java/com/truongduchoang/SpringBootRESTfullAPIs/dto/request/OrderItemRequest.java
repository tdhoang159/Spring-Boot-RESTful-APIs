package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OrderItemRequest {

    @NotNull(message = "ticketTypeId không được để trống")
    private Long ticketTypeId;

    @NotNull(message = "quantity không được để trống")
    @Min(value = 1, message = "Số lượng vé phải ít nhất là 1")
    private Integer quantity;

    public OrderItemRequest() {}

    public Long getTicketTypeId() { return ticketTypeId; }
    public void setTicketTypeId(Long ticketTypeId) { this.ticketTypeId = ticketTypeId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
