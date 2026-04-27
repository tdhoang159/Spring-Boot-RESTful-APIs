package com.truongduchoang.SpringBootRESTfullAPIs.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SendEventEmailRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.TicketCheckinRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventRegistrationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrganizerEmailHistoryResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.SendEventEmailResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketCheckinResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketSalesReportResponse;

public interface EventService {
    EventResponse createEvent(EventCreateRequest request, MultipartFile banner);

    List<EventResponse> getAllEvents();

    EventResponse getEventById(Long id);

    EventResponse updateEvent(Long id, EventUpdateRequest request, MultipartFile banner);

    void deleteEvent(Long id);

    List<EventResponse> getOrganizerEvents(Long organizerId, String published);

    List<EventRegistrationResponse> getEventRegistrations(Long organizerId, Long eventId);

    List<OrganizerEmailHistoryResponse> getOrganizerEmailHistory(Long organizerId, Long eventId);

    SendEventEmailResponse sendEventEmail(Long organizerId, Long eventId, SendEventEmailRequest request);

    TicketSalesReportResponse getTicketSalesReport(Long organizerId, Integer month, Integer year);

    EventResponse publishEvent(Long organizerId, Long eventId);

    EventResponse unpublishEvent(Long organizerId, Long eventId);

    TicketCheckinResponse getTicketCheckinInfo(Long organizerId, TicketCheckinRequest request);

    TicketCheckinResponse checkInTicket(Long organizerId, TicketCheckinRequest request);
}
