package com.truongduchoang.SpringBootRESTfullAPIs.mapper;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setTicketId(ticket.getTicketId());
        response.setTicketCode(ticket.getTicketCode());
        response.setStatus(ticket.getStatus() != null ? ticket.getStatus().name() : null);
        response.setQrCode(ticket.getQrCode());
        response.setIssuedAt(ticket.getIssuedAt());
        response.setCheckedInAt(ticket.getCheckedInAt());
        response.setAttendeeName(ticket.getAttendeeName());
        response.setAttendeeEmail(ticket.getAttendeeEmail());

        if (ticket.getEvent() != null) {
            response.setEventId(ticket.getEvent().getEventId());
            response.setEventTitle(ticket.getEvent().getTitle());
            response.setEventStartTime(ticket.getEvent().getStartTime());
            response.setEventEndTime(ticket.getEvent().getEndTime());
            response.setVenueName(ticket.getEvent().getVenueName());
        }

        if (ticket.getTicketType() != null) {
            response.setTicketTypeId(ticket.getTicketType().getTicketTypeId());
            response.setTicketTypeName(ticket.getTicketType().getTicketName());
        }

        Order order = ticket.getOrderItem() != null ? ticket.getOrderItem().getOrder() : null;
        if (order != null) {
            response.setOrderId(order.getOrderId());
            response.setOrderCode(order.getOrderCode());
        }

        return response;
    }
}
