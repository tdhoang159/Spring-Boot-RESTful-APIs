package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.security.SecurityUtils;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<TicketResponse> tickets = ticketService.getMyTickets(userId);

        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Tickets fetched successfully",
                tickets,
                null));
    }

    @GetMapping("/{ticketCode}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketByCode(
            @PathVariable String ticketCode) {
        Long userId = SecurityUtils.getCurrentUserId();
        TicketResponse ticket = ticketService.getMyTicketByCode(userId, ticketCode);

        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Ticket fetched successfully",
                ticket,
                null));
    }
}
