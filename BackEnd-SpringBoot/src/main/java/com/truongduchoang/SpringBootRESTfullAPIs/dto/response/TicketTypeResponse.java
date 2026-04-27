package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TicketTypeResponse {

    private Long ticketTypeId;
    private String ticketName;
    private String description;
    private BigDecimal price;

    // Computed — quantityTotal - quantitySold, không lộ 2 field gốc ra ngoài
    private Integer quantityAvailable;

    private Integer maxPerOrder;
    private LocalDateTime saleStartTime;
    private LocalDateTime saleEndTime;

    // Trả String thay vì Enum để frontend không bị ảnh hưởng nếu sau này thêm giá trị enum mới
    private String status;

    // Computed — frontend dùng để enable/disable nút "Mua vé" mà không cần tự tính
    private Boolean isSaleOpen;

    // ----------------------------------------------------------------
    // Constructor — dùng trong Mapper để tính 2 computed field ngay khi tạo
    // ----------------------------------------------------------------
    public TicketTypeResponse(
            Long ticketTypeId,
            String ticketName,
            String description,
            BigDecimal price,
            Integer quantityTotal,
            Integer quantitySold,
            Integer maxPerOrder,
            LocalDateTime saleStartTime,
            LocalDateTime saleEndTime,
            TicketTypeStatus status) {

        this.ticketTypeId   = ticketTypeId;
        this.ticketName     = ticketName;
        this.description    = description;
        this.price          = price;
        this.maxPerOrder    = maxPerOrder;
        this.saleStartTime  = saleStartTime;
        this.saleEndTime    = saleEndTime;
        this.status         = status != null ? status.name() : null;

        // Tính quantityAvailable — null-safe
        int available = (quantityTotal != null && quantitySold != null)
                ? quantityTotal - quantitySold
                : 0;
        this.quantityAvailable = available;

        // Tính isSaleOpen
        this.isSaleOpen = computeIsSaleOpen(status, saleStartTime, saleEndTime, available);
    }

    public TicketTypeResponse() {}


    private boolean computeIsSaleOpen(
            TicketTypeStatus status,
            LocalDateTime saleStartTime,
            LocalDateTime saleEndTime,
            int available) {

        if (status != TicketTypeStatus.ON_SALE) return false;
        if (available <= 0) return false;
        LocalDateTime now = LocalDateTime.now();
        if (saleStartTime != null && now.isBefore(saleStartTime)) return false;
        if (saleEndTime != null && now.isAfter(saleEndTime)) return false;

        return true;
    }


    public Long getTicketTypeId() { return ticketTypeId; }
    public void setTicketTypeId(Long ticketTypeId) { this.ticketTypeId = ticketTypeId; }

    public String getTicketName() { return ticketName; }
    public void setTicketName(String ticketName) { this.ticketName = ticketName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(Integer quantityAvailable) { this.quantityAvailable = quantityAvailable; }

    public Integer getMaxPerOrder() { return maxPerOrder; }
    public void setMaxPerOrder(Integer maxPerOrder) { this.maxPerOrder = maxPerOrder; }

    public LocalDateTime getSaleStartTime() { return saleStartTime; }
    public void setSaleStartTime(LocalDateTime saleStartTime) { this.saleStartTime = saleStartTime; }

    public LocalDateTime getSaleEndTime() { return saleEndTime; }
    public void setSaleEndTime(LocalDateTime saleEndTime) { this.saleEndTime = saleEndTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsSaleOpen() { return isSaleOpen; }
    public void setIsSaleOpen(Boolean isSaleOpen) { this.isSaleOpen = isSaleOpen; }
}
