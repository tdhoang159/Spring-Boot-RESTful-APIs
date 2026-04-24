package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public class OrderCreateRequest {

    @NotNull(message = "eventId không được để trống")
    private Long eventId;

    @NotBlank(message = "Tên người mua không được để trống")
    @Size(max = 150, message = "Tên người mua không được vượt quá 150 ký tự")
    private String buyerName;

    @NotBlank(message = "Email người mua không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 150, message = "Email không được vượt quá 150 ký tự")
    private String buyerEmail;

    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$",
            message = "Số điện thoại không đúng định dạng")
    private String buyerPhone;

    @NotEmpty(message = "Danh sách vé không được để trống")
    @Valid  // trigger validation cho từng OrderItemRequest trong list
    private List<OrderItemRequest> items;

    public OrderCreateRequest() {}

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public String getBuyerEmail() { return buyerEmail; }
    public void setBuyerEmail(String buyerEmail) { this.buyerEmail = buyerEmail; }
    public String getBuyerPhone() { return buyerPhone; }
    public void setBuyerPhone(String buyerPhone) { this.buyerPhone = buyerPhone; }
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
}