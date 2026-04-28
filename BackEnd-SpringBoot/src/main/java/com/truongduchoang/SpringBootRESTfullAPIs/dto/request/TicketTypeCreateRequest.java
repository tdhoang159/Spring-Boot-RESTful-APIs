package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TicketTypeCreateRequest {
  private Long ticketTypeId;

    @NotNull(message = "Event không được bỏ trống")
    private Long eventId;

    @NotNull(message = "Tên loại vé không được bỏ trống")
    @Size(max = 100, message = "Tên loại vé không được vượt quá 100 ký tự")
    private String ticketName;

    private String description;

    @NotNull(message = "Giá vé không được bỏ trống")
    private BigDecimal price;

    @NotNull(message = "Số lượng vé không được bỏ trống")
    private Integer quantityTotal;

    @NotNull(message = "Số lượng vé tối đa mỗi đơn hàng không được bỏ trống")
    private Integer maxPerOrder;

    @NotNull(message = "Thời gian bắt đầu bán vé không được bỏ trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime saleStartTime;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime saleEndTime;

    private TicketTypeStatus status = TicketTypeStatus.INACTIVE;

    public Long getEventId() {
      return eventId;
    }

    public Long getTicketTypeId() {
      return ticketTypeId;
    }

    public void setTicketTypeId(Long ticketTypeId) {
      this.ticketTypeId = ticketTypeId;
    }

    public void setEventId(Long eventId) {
      this.eventId = eventId;
    }

    public String getTicketName() {
      return ticketName;
    }

    public void setTicketName(String ticketName) {
      this.ticketName = ticketName;
    }

    public String getDescription() {
      return description;
    }

    public void setDescription(String description) {
      this.description = description;
    }

    public BigDecimal getPrice() {
      return price;
    }

    public void setPrice(BigDecimal price) {
      this.price = price;
    }

    public Integer getQuantityTotal() {
      return quantityTotal;
    }

    public void setQuantityTotal(Integer quantityTotal) {
      this.quantityTotal = quantityTotal;
    }

    public Integer getMaxPerOrder() {
      return maxPerOrder;
    }

    public void setMaxPerOrder(Integer maxPerOrder) {
      this.maxPerOrder = maxPerOrder;
    }

    public LocalDateTime getSaleStartTime() {
      return saleStartTime;
    }

    public void setSaleStartTime(LocalDateTime saleStartTime) {
      this.saleStartTime = saleStartTime;
    }

    public LocalDateTime getSaleEndTime() {
      return saleEndTime;
    }

    public void setSaleEndTime(LocalDateTime saleEndTime) {
      this.saleEndTime = saleEndTime;
    }

    public TicketTypeStatus getStatus() {
      return status;
    }

    public void setStatus(TicketTypeStatus status) {
      this.status = status;
    }
}
