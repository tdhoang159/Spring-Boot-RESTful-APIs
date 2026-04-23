package com.truongduchoang.SpringBootRESTfullAPIs.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SendEventNotificationRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventRegistrationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.SendEventNotificationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketSalesReportResponse;

public interface EventService {
    EventResponse createEvent(EventCreateRequest request, MultipartFile banner);

    List<EventResponse> getAllEvents();

    EventResponse getEventById(Long id);

    EventResponse updateEvent(Long id, EventUpdateRequest request, MultipartFile banner);

    void deleteEvent(Long id);

    List<EventResponse> getOrganizerEvents(Long organizerId, String published);

    List<EventRegistrationResponse> getEventRegistrations(Long organizerId, Long eventId);

    SendEventNotificationResponse sendEventNotification(Long organizerId, Long eventId, SendEventNotificationRequest request);

    TicketSalesReportResponse getTicketSalesReport(Long organizerId, Integer month, Integer year);

    EventResponse publishEvent(Long organizerId, Long eventId);

    EventResponse unpublishEvent(Long organizerId, Long eventId);
}
