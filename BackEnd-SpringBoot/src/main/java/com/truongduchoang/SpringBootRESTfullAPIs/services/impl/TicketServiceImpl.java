package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.TicketMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public TicketServiceImpl(TicketRepository ticketRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    @Override
    public List<TicketResponse> getMyTickets(Long userId) {
        return ticketRepository.findByOwnerUserUserIdOrderByIssuedAtDesc(userId)
                .stream()
                .map(ticketMapper::toResponse)
                .toList();
    }

    @Override
    public TicketResponse getMyTicketByCode(Long userId, String ticketCode) {
        return ticketRepository.findByTicketCodeAndOwnerUserUserId(ticketCode, userId)
                .map(ticketMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ticket not found: " + ticketCode,
                        "TICKET_NOT_FOUND"));
    }
}
