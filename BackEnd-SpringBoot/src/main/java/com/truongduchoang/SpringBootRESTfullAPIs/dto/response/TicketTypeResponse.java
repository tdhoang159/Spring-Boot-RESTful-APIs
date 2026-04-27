package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;

public class TicketTypeResponse {
    private Long ticketTypeId;
    private String ticketName;
    private String description;
    private BigDecimal price;
    private Integer quantityTotal;
    private Integer quantityAvailable;
    private Integer maxPerOrder;
    private LocalDateTime saleStartTime;
    private LocalDateTime saleEndTime;
    private String status;
    private Boolean isSaleOpen;

    public Long getTicketTypeId() {
        return ticketTypeId;
    }

    public void setTicketTypeId(Long ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
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

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setStatus(TicketTypeStatus status) {
        this.status = status != null ? status.name() : null;
    }

    public Boolean getIsSaleOpen() {
        return isSaleOpen;
    }

    public void setIsSaleOpen(Boolean isSaleOpen) {
        this.isSaleOpen = isSaleOpen;
    }
}
