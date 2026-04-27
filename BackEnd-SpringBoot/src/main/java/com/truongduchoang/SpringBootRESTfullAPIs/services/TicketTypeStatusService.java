package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class TicketTypeStatusService {

    public void refreshStatus(TicketType ticketType) {
        LocalDateTime now = LocalDateTime.now();

        if (ticketType.getSaleEndTime() != null && now.isAfter(ticketType.getSaleEndTime())) {
            ticketType.setStatus(TicketTypeStatus.ENDED);
            return;
        }

        int quantitySold = ticketType.getQuantitySold() != null ? ticketType.getQuantitySold() : 0;
        int quantityTotal = ticketType.getQuantityTotal() != null ? ticketType.getQuantityTotal() : 0;
        if (quantitySold >= quantityTotal) {
            ticketType.setStatus(TicketTypeStatus.SOLD_OUT);
            return;
        }

        if (ticketType.getSaleStartTime() != null && now.isBefore(ticketType.getSaleStartTime())) {
            ticketType.setStatus(TicketTypeStatus.INACTIVE);
            return;
        }

        ticketType.setStatus(TicketTypeStatus.ON_SALE);
    }
}
