package com.truongduchoang.SpringBootRESTfullAPIs.mapper;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Category;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrganizerProfile;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;

import java.util.List;

@Component
public class EventMapper {
    @Autowired
    private TicketTypeMapper ticketTypeMapper;

    public Event toEntity(EventCreateRequest request, Category category, OrganizerProfile organizer) {
        Event event = new Event();
        event.setCategory(category);
        event.setOrganizer(organizer);
        event.setTitle(request.getTitle());
        event.setSlug(request.getSlug());
        event.setShortDescription(request.getShortDescription());
        event.setDescription(request.getDescription());
        event.setVenueName(request.getVenueName());
        event.setVenueAddress(request.getVenueAddress());
        event.setCity(request.getCity());
        event.setLocationType(request.getLocationType());
        event.setMeetingUrl(request.getMeetingUrl());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setRegistrationDeadline(request.getRegistrationDeadline());
        event.setPublishStatus(request.getPublishStatus() != null ? request.getPublishStatus() : PublishStatus.DRAFT);
        event.setApprovalStatus(request.getApprovalStatus() != null ? request.getApprovalStatus() : ApprovalStatus.PENDING);
        return event;
    }

    public void updateEntity(Event event, EventUpdateRequest request, Category category, OrganizerProfile organizer) {
        if (category != null) {
            event.setCategory(category);
        }
        if (organizer != null) {
            event.setOrganizer(organizer);
        }
        if (StringUtils.hasText(request.getTitle())) {
            event.setTitle(request.getTitle());
        }
        if (StringUtils.hasText(request.getSlug())) {
            event.setSlug(request.getSlug());
        }
        if (request.getShortDescription() != null) {
            event.setShortDescription(request.getShortDescription());
        }
        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }
        if (request.getVenueName() != null) {
            event.setVenueName(request.getVenueName());
        }
        if (request.getVenueAddress() != null) {
            event.setVenueAddress(request.getVenueAddress());
        }
        if (request.getCity() != null) {
            event.setCity(request.getCity());
        }
        if (request.getLocationType() != null) {
            event.setLocationType(request.getLocationType());
        }
        if (request.getMeetingUrl() != null) {
            event.setMeetingUrl(request.getMeetingUrl());
        }
        if (request.getStartTime() != null) {
            event.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            event.setEndTime(request.getEndTime());
        }
        if (request.getRegistrationDeadline() != null) {
            event.setRegistrationDeadline(request.getRegistrationDeadline());
        }
        if (request.getPublishStatus() != null) {
            event.setPublishStatus(request.getPublishStatus());
        }
        if (request.getApprovalStatus() != null) {
            event.setApprovalStatus(request.getApprovalStatus());
        }
    }

    public EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setEventId(event.getEventId());
        response.setOrganizer(toOrganizerSummary(event.getOrganizer()));
        response.setCategory(toCategorySummary(event.getCategory()));
        response.setTitle(event.getTitle());
        response.setSlug(event.getSlug());
        response.setShortDescription(event.getShortDescription());
        response.setDescription(event.getDescription());
        response.setBannerUrl(event.getBannerUrl());
        response.setVenueName(event.getVenueName());
        response.setVenueAddress(event.getVenueAddress());
        response.setCity(event.getCity());
        response.setLocationType(event.getLocationType());
        response.setMeetingUrl(event.getMeetingUrl());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setRegistrationDeadline(event.getRegistrationDeadline());
        response.setPublishStatus(event.getPublishStatus());
        response.setApprovalStatus(event.getApprovalStatus());
        response.setCreatedAt(event.getCreatedAt());
        response.setUpdatedAt(event.getUpdatedAt());
        return response;
    }

    private CategorySummaryResponse toCategorySummary(Category category) {
        if (category == null) {
            return null;
        }
        return new CategorySummaryResponse(category.getCategoryId(), category.getCategoryName());
    }

    private OrganizerSummaryResponse toOrganizerSummary(OrganizerProfile organizer) {
        if (organizer == null) {
            return null;
        }
        User user = organizer.getUser();
        return new OrganizerSummaryResponse(
                organizer.getOrganizerId(),
                organizer.getOrganizationName(),
                user != null ? user.getUserId() : null,
                user != null ? user.getFullName() : null);
    }

    public EventSummaryResponse toSummaryResponse(Event event) {
        EventSummaryResponse dto = new EventSummaryResponse();
        dto.setEventId(event.getEventId());
        dto.setTitle(event.getTitle());
        dto.setSlug(event.getSlug());
        dto.setShortDescription(event.getShortDescription());
        dto.setBannerUrl(event.getBannerUrl());
        dto.setCity(event.getCity());
        dto.setVenueName(event.getVenueName());
        dto.setStartTime(event.getStartTime());
        dto.setEndTime(event.getEndTime());
        dto.setLocationType(event.getLocationType());

        // Nếu quan hệ lazy → đảm bảo đã fetch hoặc dùng JOIN FETCH trong repo
        if (event.getCategory() != null) {
            dto.setCategoryName(event.getCategory().getCategoryName());
        }
        if (event.getOrganizer() != null) {
            dto.setOrganizerName(event.getOrganizer().getOrganizationName()); // tuỳ field thực tế
        }

        // Giá vé rẻ nhất — nếu Event có collection ticketTypes
        event.getTicketTypes().stream()
                .map(t -> t.getPrice())
                .filter(p -> p != null)
                .min(java.util.Comparator.naturalOrder())
                .ifPresent(dto::setMinPrice);

        return dto;
    }

    public EventDetailResponse toDetailResponse(Event event) {
        EventDetailResponse response = new EventDetailResponse();
        response.setEventId(event.getEventId());
        response.setTitle(event.getTitle());
        response.setSlug(event.getSlug());
        response.setShortDescription(event.getShortDescription());
        response.setDescription(event.getDescription());
        response.setBannerUrl(event.getBannerUrl());
        response.setVenueName(event.getVenueName());
        response.setVenueAddress(event.getVenueAddress());
        response.setCity(event.getCity());
        response.setLocationType(event.getLocationType());
        response.setMeetingUrl(event.getMeetingUrl());
        response.setStartTime(event.getStartTime());
        response.setEndTime(event.getEndTime());
        response.setRegistrationDeadline(event.getRegistrationDeadline());


        // Organizer detail
        if (event.getOrganizer() != null) {
            OrganizerProfile organizer = event.getOrganizer();
            User user = organizer.getUser();
            response.setOrganizerWebsite(organizer.getWebsite());
            response.setOrganizerDescription(organizer.getDescription());
            response.setOrganizerIsVerified(organizer.getIsVerified());
        }

        // Danh sách loại vé
        if (event.getTicketTypes() != null) {
            List<TicketTypeResponse> ticketTypeResponses = event.getTicketTypes().stream()
                    .map(ticketTypeMapper::toTicketTypeResponse)
                    .toList();
            response.setTicketTypes(ticketTypeResponses);
        }

        return response;
    }
}
