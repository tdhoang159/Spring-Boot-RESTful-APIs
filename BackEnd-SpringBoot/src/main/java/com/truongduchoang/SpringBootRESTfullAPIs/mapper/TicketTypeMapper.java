package com.truongduchoang.SpringBootRESTfullAPIs.mapper;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.TicketTypeCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketTypeResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import org.springframework.stereotype.Component;

@Component
public class TicketTypeMapper {
    public TicketType toEntity(TicketTypeCreateRequest request, Event event) {
        TicketType ticketType = new TicketType();
        ticketType.setEvent(event);
        ticketType.setTicketName(request.getTicketName());
        ticketType.setDescription(request.getDescription());
        ticketType.setPrice(request.getPrice());
        ticketType.setQuantityTotal(request.getQuantityTotal());
        ticketType.setMaxPerOrder(request.getMaxPerOrder());
        ticketType.setSaleStartTime(request.getSaleStartTime());
        ticketType.setSaleEndTime(request.getSaleEndTime());
        ticketType.setStatus(request.getStatus());
        return ticketType;
    }

    public TicketTypeResponse toResponse(TicketType ticketType) {
        TicketTypeResponse response = new TicketTypeResponse();
        response.setTicketTypeId(ticketType.getTicketTypeId());
        response.setTicketName(ticketType.getTicketName());
        response.setDescription(ticketType.getDescription());
        response.setPrice(ticketType.getPrice());
        response.setQuantityTotal(ticketType.getQuantityTotal());
        response.setMaxPerOrder(ticketType.getMaxPerOrder());
        response.setSaleStartTime(ticketType.getSaleStartTime());
        response.setSaleEndTime(ticketType.getSaleEndTime());
        response.setStatus(ticketType.getStatus());
        return response;
    }
}
