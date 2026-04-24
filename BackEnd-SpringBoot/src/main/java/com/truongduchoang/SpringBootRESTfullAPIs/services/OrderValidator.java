package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.errors.BadRequestException;
import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OrderValidator {

    // ----------------------------------------------------------------
    // Validate một TicketType trước khi cho phép mua
    // Tách ra đây để OrderServiceImpl gọn, dễ test riêng
    // ----------------------------------------------------------------
    public void validateTicketType(TicketType ticketType, int quantity, Long eventId) {

        // Kiểm tra ticket type thuộc đúng event
        System.out.println(eventId);
        System.out.println(ticketType.getEvent().getEventId());
        if (!ticketType.getEvent().getEventId().equals(eventId)) {
            throw new BadRequestException(
                    "TicketType không thuộc event này",
                    "TICKET_TYPE_MISMATCH");
        }

        // Kiểm tra trạng thái
        if (ticketType.getStatus() != TicketTypeStatus.ON_SALE) {
            throw new BadRequestException(
                    "Loại vé \"" + ticketType.getTicketName() + "\" hiện không mở bán",
                    "TICKET_TYPE_NOT_ACTIVE");
        }

        // Kiểm tra thời gian mở bán
        LocalDateTime now = LocalDateTime.now();
        if (ticketType.getSaleStartTime() != null
                && now.isBefore(ticketType.getSaleStartTime())) {
            throw new BadRequestException(
                    "Loại vé \"" + ticketType.getTicketName() + "\" chưa mở bán",
                    "TICKET_SALE_NOT_STARTED");
        }
        if (ticketType.getSaleEndTime() != null
                && now.isAfter(ticketType.getSaleEndTime())) {
            throw new BadRequestException(
                    "Loại vé \"" + ticketType.getTicketName() + "\" đã hết hạn mua",
                    "TICKET_SALE_ENDED");
        }

        // Kiểm tra maxPerOrder
        if (ticketType.getMaxPerOrder() != null
                && quantity > ticketType.getMaxPerOrder()) {
            throw new BadRequestException(
                    "Mỗi đơn chỉ được mua tối đa "
                            + ticketType.getMaxPerOrder()
                            + " vé loại \"" + ticketType.getTicketName() + "\"",
                    "EXCEED_MAX_PER_ORDER");
        }

        // Kiểm tra tồn kho
        int available = ticketType.getQuantityTotal() - ticketType.getQuantitySold();
        if (quantity > available) {
            throw new BadRequestException(
                    "Loại vé \"" + ticketType.getTicketName()
                            + "\" không đủ số lượng. Còn lại: " + available,
                    "INSUFFICIENT_TICKET_QUANTITY");
        }
    }
}