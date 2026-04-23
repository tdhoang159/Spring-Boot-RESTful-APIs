package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventRegistrationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SendEventNotificationRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.SendEventNotificationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketSalesReportResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EventService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/organizers")
public class OrganizerController {

    private final EventService eventService;

    public OrganizerController(EventService eventService) {
        this.eventService = eventService;
    }

    // GET /organizers/{organizerId}/events?publishStatus=DRAFT/PUBLISHED/UNPUBLISHED
    @GetMapping("/{organizerId}/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getOrganizerEvents(
            @PathVariable Long organizerId,
            @RequestParam(required = false) String publishStatus) {
        List<EventResponse> events = eventService.getOrganizerEvents(organizerId, publishStatus);
        ApiResponse<List<EventResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get organizer events successful",
                events,
                null);
        return ResponseEntity.ok(response);
    }

    // GET /organizers/{organizerId}/ticket-sales-report?month=4&year=2026
    @GetMapping("/{organizerId}/ticket-sales-report")
    public ResponseEntity<ApiResponse<TicketSalesReportResponse>> getTicketSalesReport(
            @PathVariable Long organizerId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        TicketSalesReportResponse report = eventService.getTicketSalesReport(organizerId, month, year);
        ApiResponse<TicketSalesReportResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get ticket sales report successful",
                report,
                null);
        return ResponseEntity.ok(response);
    }

    // GET /organizers/{organizerId}/events/{eventId}/registrations
    @GetMapping("/{organizerId}/events/{eventId}/registrations")
    public ResponseEntity<ApiResponse<List<EventRegistrationResponse>>> getEventRegistrations(
            @PathVariable Long organizerId,
            @PathVariable Long eventId) {
        List<EventRegistrationResponse> registrations = eventService.getEventRegistrations(organizerId, eventId);
        ApiResponse<List<EventRegistrationResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Get event registrations successful",
                registrations,
                null);
        return ResponseEntity.ok(response);
    }

    // POST /organizers/{organizerId}/events + body CreateEventRequest
    @PostMapping("/{organizerId}/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @PathVariable Long organizerId,
            @RequestBody EventCreateRequest request) {
        request.setOrganizerId(organizerId);
        EventResponse createdEvent = eventService.createEvent(request, null);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Create event successful",
                createdEvent,
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PATCH /organizers/{organizerId}/events/{eventId}/publish
    @PatchMapping("/{organizerId}/events/{eventId}/publish")
    public ResponseEntity<ApiResponse<EventResponse>> publishEvent(
            @PathVariable Long organizerId,
            @PathVariable Long eventId) {
        EventResponse event = eventService.publishEvent(organizerId, eventId);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Publish event successful",
                event,
                null);
        return ResponseEntity.ok(response);
    }

    // PATCH /organizers/{organizerId}/events/{eventId}/unpublish
    @PatchMapping("/{organizerId}/events/{eventId}/unpublish")
    public ResponseEntity<ApiResponse<EventResponse>> unpublishEvent(
            @PathVariable Long organizerId,
            @PathVariable Long eventId) {
        EventResponse event = eventService.unpublishEvent(organizerId, eventId);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Unpublish event successful",
                event,
                null);
        return ResponseEntity.ok(response);
    }

    // POST /organizers/{organizerId}/events/{eventId}/send-notification + body
    @PostMapping("/{organizerId}/events/{eventId}/send-notification")
    public ResponseEntity<ApiResponse<SendEventNotificationResponse>> sendEventNotification(
            @PathVariable Long organizerId,
            @PathVariable Long eventId,
            @RequestBody SendEventNotificationRequest request) {
        SendEventNotificationResponse response = eventService.sendEventNotification(organizerId, eventId, request);
        ApiResponse<SendEventNotificationResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Send event notification successful",
                response,
                null);
        return ResponseEntity.ok(apiResponse);
    }
}
