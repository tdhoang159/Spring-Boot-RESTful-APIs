package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventRegistrationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrganizerEmailHistoryResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SendEventEmailRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.TicketCheckinRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.SendEventEmailResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketCheckinResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketSalesReportResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.EmailSendStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EventService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/organizers")
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

    // GET /organizers/{organizerId}/email-history?eventId=1
    @GetMapping("/{organizerId}/email-history")
    public ResponseEntity<ApiResponse<Page<OrganizerEmailHistoryResponse>>> getOrganizerEmailHistory(
            @PathVariable Long organizerId,
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) EmailSendStatus sendStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OrganizerEmailHistoryResponse> history = eventService.getOrganizerEmailHistory(
                organizerId,
                eventId,
                sendStatus,
                PageRequest.of(page, size));
        ApiResponse<Page<OrganizerEmailHistoryResponse>> response = new ApiResponse<>(
            HttpStatus.OK,
            "Get organizer email history successful",
            history,
            null);
        return ResponseEntity.ok(response);
    }

    // POST /organizers/{organizerId}/events + body EventCreateRequest { categoryId, title, slug, shortDescription, description, venueName, venueAddress, city, locationType, meetingUrl, startTime, endTime, registrationDeadline, ticketTypes: [ { ticketName, description, price, quantityTotal, maxPerOrder, saleStartTime, saleEndTime, status } ] }
    @PostMapping(value = "/{organizerId}/events", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @PathVariable Long organizerId,
            @Valid @RequestBody EventCreateRequest request) {
        request.setOrganizerId(organizerId);
        EventResponse createdEvent = eventService.createEvent(request, null);
        ApiResponse<EventResponse> response = new ApiResponse<>(
            HttpStatus.CREATED,
            "Create event successful",
            createdEvent,
            null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping(value = "/{organizerId}/events", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> createEventWithBanner(
            @PathVariable Long organizerId,
            @Valid @ModelAttribute EventCreateRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        request.setOrganizerId(organizerId);
        EventResponse createdEvent = eventService.createEvent(request, banner);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Create event successful",
                createdEvent,
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping(value = "/{organizerId}/events/{eventId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> updateOrganizerEvent(
            @PathVariable Long organizerId,
            @PathVariable Long eventId,
            @Valid @RequestBody EventUpdateRequest request) {
        request.setOrganizerId(organizerId);
        EventResponse updatedEvent = eventService.updateEvent(eventId, request, null);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Update event successful",
                updatedEvent,
                null);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{organizerId}/events/{eventId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> updateOrganizerEventWithBanner(
            @PathVariable Long organizerId,
            @PathVariable Long eventId,
            @Valid @ModelAttribute EventUpdateRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        request.setOrganizerId(organizerId);
        EventResponse updatedEvent = eventService.updateEvent(eventId, request, banner);
        ApiResponse<EventResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Update event successful",
                updatedEvent,
                null);
        return ResponseEntity.ok(response);
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

    // POST /organizers/{organizerId}/events/{eventId}/send-email + body  { subject, content }
    @PostMapping("/{organizerId}/events/{eventId}/send-email")
    public ResponseEntity<ApiResponse<SendEventEmailResponse>> sendEventEmail(
            @PathVariable Long organizerId,
            @PathVariable Long eventId,
            @RequestBody SendEventEmailRequest request) {
        SendEventEmailResponse response = eventService.sendEventEmail(organizerId, eventId, request);
        ApiResponse<SendEventEmailResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Send event email successful",
                response,
                null);
        return ResponseEntity.ok(apiResponse);
    }

    // POST /organizers/{organizerId}/tickets/scan + body { ticketCode, eventId?, gateName? }
    @PostMapping("/{organizerId}/tickets/scan")
    public ResponseEntity<ApiResponse<TicketCheckinResponse>> scanTicketForCheckin(
            @PathVariable Long organizerId,
            @Valid @RequestBody TicketCheckinRequest request) {
        TicketCheckinResponse response = eventService.getTicketCheckinInfo(organizerId, request);
        ApiResponse<TicketCheckinResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Get ticket information successful",
                response,
                null);
        return ResponseEntity.ok(apiResponse);
    }

    // POST /organizers/{organizerId}/tickets/check-in + body { ticketCode, eventId?, gateName? }
    @PostMapping("/{organizerId}/tickets/check-in")
    public ResponseEntity<ApiResponse<TicketCheckinResponse>> checkInTicket(
            @PathVariable Long organizerId,
            @Valid @RequestBody TicketCheckinRequest request) {
        TicketCheckinResponse response = eventService.checkInTicket(organizerId, request);
        ApiResponse<TicketCheckinResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Check-in ticket successful",
                response,
                null);
        return ResponseEntity.ok(apiResponse);
    }
}
