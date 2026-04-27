package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketResponse;

import java.util.List;

public interface TicketService {

    List<TicketResponse> getMyTickets(Long userId);

    TicketResponse getMyTicketByCode(Long userId, String ticketCode);
}
