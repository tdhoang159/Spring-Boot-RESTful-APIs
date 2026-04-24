package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import java.util.List;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventSearchRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventDetailResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EventService;

import jakarta.validation.Valid;

@RestController
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping(value = "/api/events", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody EventCreateRequest request) {
        EventResponse event = eventService.createEvent(request, null);
        ApiResponse<EventResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                "Create event successfully",
                event,
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping(value = "/api/events", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> createEventWithBanner(
            @Valid @ModelAttribute EventCreateRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        EventResponse event = eventService.createEvent(request, banner);
        ApiResponse<EventResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                "Create event successfully",
                event,
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/api/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        ApiResponse<List<EventResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                "Get events successfully",
                events,
                null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        ApiResponse<EventResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Get event successfully",
                event,
                null);
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/api/events/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventUpdateRequest request) {
        EventResponse event = eventService.updateEvent(id, request, null);
        ApiResponse<EventResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Update event successfully",
                event,
                null);
        return ResponseEntity.ok(result);
    }

    @PutMapping(value = "/api/events/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<EventResponse>> updateEventWithBanner(
            @PathVariable Long id,
            @Valid @ModelAttribute EventUpdateRequest request,
            @RequestPart(value = "banner", required = false) MultipartFile banner) {
        EventResponse event = eventService.updateEvent(id, request, banner);
        ApiResponse<EventResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Update event successfully",
                event,
                null);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/api/events/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        ApiResponse<Void> result = new ApiResponse<>(
                HttpStatus.NO_CONTENT,
                "Delete event successfully",
                null,
                null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(result);
    }

    @GetMapping("/api/v1/events")
    public ResponseEntity<Page<EventSummaryResponse>> getApprovedEvents(
            @Valid @ModelAttribute EventSearchRequest request) {

        Page<EventSummaryResponse> result = eventService.getApprovedEvents(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/api/v1/events/{slug}")
    public ResponseEntity<EventDetailResponse> getApprovedEventBySlug(@PathVariable String slug) {
        EventDetailResponse result = eventService.getApprovedEventBySlug(slug);
        return ResponseEntity.ok(result);
    }






}
