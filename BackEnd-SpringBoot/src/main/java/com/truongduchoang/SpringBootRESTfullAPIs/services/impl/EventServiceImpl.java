package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SendEventNotificationRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventRegistrationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventTicketSalesSummaryResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.MediaUploadResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.SendEventNotificationResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketSalesReportResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.BadRequestException;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.DuplicateResourceException;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.EventMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.TicketTypeMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Category;
import com.truongduchoang.SpringBootRESTfullAPIs.models.EmailCampaign;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrderItem;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrganizerProfile;
import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.EmailSendStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.CategoryRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.EmailCampaignRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.EventRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.OrderRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.OrganizerProfileRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketTypeRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.CloudinaryService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EmailSenderService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EventService;


@Service
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final EventMapper eventMapper;
    private final TicketTypeMapper ticketTypeMapper;
    private final CloudinaryService cloudinaryService;
    private final EmailSenderService emailSenderService;
    private final EmailCampaignRepository emailCampaignRepository;

    public EventServiceImpl(
            EventRepository eventRepository,
            CategoryRepository categoryRepository,
            OrganizerProfileRepository organizerProfileRepository,
            OrderRepository orderRepository,
            TicketRepository ticketRepository,
            TicketTypeRepository ticketTypeRepository,
            EventMapper eventMapper,
            TicketTypeMapper ticketTypeMapper,
            CloudinaryService cloudinaryService,
            EmailSenderService emailSenderService,
            EmailCampaignRepository emailCampaignRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.organizerProfileRepository = organizerProfileRepository;
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.eventMapper = eventMapper;
        this.ticketTypeMapper = ticketTypeMapper;
        this.cloudinaryService = cloudinaryService;
        this.emailSenderService = emailSenderService;
        this.emailCampaignRepository = emailCampaignRepository;
    }

    @Override
    @Transactional
    public EventResponse createEvent(EventCreateRequest request, MultipartFile banner) {
        validateTimeRange(request.getStartTime(), request.getEndTime());
        if (eventRepository.existsBySlug(request.getSlug())) {
            throw new DuplicateResourceException("Event slug already exists", "EVENT_SLUG_ALREADY_EXISTS");
        }

        Category category = findCategoryById(request.getCategoryId());
        OrganizerProfile organizer = findOrganizerById(request.getOrganizerId());
        Event event = eventMapper.toEntity(request, category, organizer);

        if (hasFile(banner)) {
            MediaUploadResponse uploadResponse = cloudinaryService.uploadImage(banner, "event-management/events");
            event.setBannerUrl(uploadResponse.getSecureUrl());
        }

        Event savedEvent = eventRepository.save(event);

        if (request.getTicketTypes() != null && !request.getTicketTypes().isEmpty()) {
            List<TicketType> ticketTypes = request.getTicketTypes().stream()
                    .map(ticketTypeRequest -> ticketTypeMapper.toEntity(ticketTypeRequest, savedEvent))
                    .toList();
            List<TicketType> savedTicketTypes = ticketTypeRepository.saveAll(ticketTypes);
            savedEvent.setTicketTypes(savedTicketTypes);
        }

        return eventMapper.toResponse(savedEvent);
    }

    @Override
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(eventMapper::toResponse)
                .toList();
    }

    @Override
    public EventResponse getEventById(Long id) {
        return eventMapper.toResponse(findEventById(id));
    }

    @Override
    public EventResponse updateEvent(Long id, EventUpdateRequest request, MultipartFile banner) {
        Event event = findEventById(id);

        if (request.getTitle() != null && !StringUtils.hasText(request.getTitle())) {
            throw new BadRequestException("Event title cannot be blank", "EVENT_TITLE_BLANK");
        }
        if (request.getSlug() != null && !StringUtils.hasText(request.getSlug())) {
            throw new BadRequestException("Event slug cannot be blank", "EVENT_SLUG_BLANK");
        }
        if (StringUtils.hasText(request.getSlug())
                && !request.getSlug().equalsIgnoreCase(event.getSlug())
                && eventRepository.existsBySlugAndEventIdNot(request.getSlug(), id)) {
            throw new DuplicateResourceException("Event slug already exists", "EVENT_SLUG_ALREADY_EXISTS");
        }

        LocalDateTime startTime = request.getStartTime() != null ? request.getStartTime() : event.getStartTime();
        LocalDateTime endTime = request.getEndTime() != null ? request.getEndTime() : event.getEndTime();
        validateTimeRange(startTime, endTime);

        Category category = request.getCategoryId() != null ? findCategoryById(request.getCategoryId()) : null;
        OrganizerProfile organizer = request.getOrganizerId() != null ? findOrganizerById(request.getOrganizerId()) : null;
        eventMapper.updateEntity(event, request, category, organizer);

        if (hasFile(banner)) {
            MediaUploadResponse uploadResponse = cloudinaryService.uploadImage(banner, "event-management/events");
            event.setBannerUrl(uploadResponse.getSecureUrl());
        }

        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = findEventById(id);
        if (orderRepository.existsByEventEventId(id) || ticketRepository.existsByEventEventId(id)) {
            throw new BadRequestException("Event already has orders or tickets", "EVENT_HAS_TRANSACTIONS");
        }
        eventRepository.delete(event);
    }

    private Event findEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event with id " + id + " not found", "EVENT_NOT_FOUND"));
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category with id " + id + " not found", "CATEGORY_NOT_FOUND"));
    }

    private OrganizerProfile findOrganizerById(Long id) {
        return organizerProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer with id " + id + " not found", "ORGANIZER_NOT_FOUND"));
    }

    private void validateTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new BadRequestException("Start time and end time are required", "EVENT_TIME_REQUIRED");
        }
        if (!endTime.isAfter(startTime)) {
            throw new BadRequestException("End time must be after start time", "EVENT_TIME_INVALID");
        }
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }


    @Override
    @Transactional(readOnly = true)
    public List<EventResponse> getOrganizerEvents(Long organizerId, String publishStatus) {
        organizerProfileRepository.findById(organizerId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer with id " + organizerId + " not found", "ORGANIZER_NOT_FOUND"));

        if (publishStatus == null) {
            return eventRepository.findByOrganizer_OrganizerIdOrderByCreatedAtDesc(organizerId)
                    .stream().map(eventMapper::toResponse).toList();
        }

        try {
            PublishStatus status = PublishStatus.valueOf(publishStatus.toUpperCase());
            return eventRepository.findByOrganizer_OrganizerIdAndPublishStatusOrderByCreatedAtDesc(organizerId, status)
                    .stream().map(eventMapper::toResponse).toList();
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid publish status. Valid values: DRAFT, PUBLISHED, UNPUBLISHED", "INVALID_PUBLISH_STATUS");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventRegistrationResponse> getEventRegistrations(Long organizerId, Long eventId) {
        Event event = getOrganizerEvent(organizerId, eventId);
        List<Order> orders = orderRepository.findByEvent_EventIdOrderByCreatedAtDesc(event.getEventId());

        List<EventRegistrationResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToRegistrationResponse(order));
        }

        return responses;
    }

    private EventRegistrationResponse mapToRegistrationResponse(Order order) {
        EventRegistrationResponse response = new EventRegistrationResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUser() != null ? order.getUser().getUserId() : null);
        response.setFullName(order.getUser() != null ? order.getUser().getFullName() : null);
        response.setEmail(order.getUser() != null ? order.getUser().getEmail() : null);
        response.setPhone(order.getUser() != null ? order.getUser().getPhone() : null);
        response.setBuyerName(order.getBuyerName());
        response.setBuyerEmail(order.getBuyerEmail());
        response.setBuyerPhone(order.getBuyerPhone());
        response.setTotalTickets(sumTotalTickets(order.getOrderItems()));
        response.setFinalAmount(order.getFinalAmount());
        response.setPaymentStatus(order.getPaymentStatus() != null ? order.getPaymentStatus().name() : null);
        response.setOrderStatus(order.getOrderStatus() != null ? order.getOrderStatus().name() : null);
        response.setRegisteredAt(order.getCreatedAt());
        return response;
    }

    private Integer sumTotalTickets(List<OrderItem> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) {
            return 0;
        }
        return orderItems.stream()
                .map(OrderItem::getQuantity)
                .filter(Objects::nonNull)
                .reduce(0, Integer::sum);
    }

    @Override
    @Transactional
    public SendEventNotificationResponse sendEventNotification(Long organizerId, Long eventId, SendEventNotificationRequest request) {
        if (request.getSubject() == null || request.getSubject().isBlank()) {
            throw new IllegalArgumentException("Email subject is required");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Email content is required");
        }

        Event event = getOrganizerEvent(organizerId, eventId);
        List<Order> orders = orderRepository.findByEvent_EventIdOrderByCreatedAtDesc(event.getEventId());

        Set<String> emailSet = new HashSet<>();
        for (Order order : orders) {
            if (order.getBuyerEmail() != null && !order.getBuyerEmail().isBlank()) {
                emailSet.add(order.getBuyerEmail());
            } else if (order.getUser() != null && order.getUser().getEmail() != null) {
                emailSet.add(order.getUser().getEmail());
            }
        }

        List<String> recipients = new ArrayList<>(emailSet);
        if (recipients.isEmpty()) {
            return new SendEventNotificationResponse(null, 0, "No recipients found for event");
        }

        User createdBy = event.getOrganizer().getUser();
        emailSenderService.sendBulkEmail(recipients, request.getSubject(), request.getContent());

        EmailCampaign campaign = new EmailCampaign();
        campaign.setEvent(event);
        campaign.setCreatedBy(createdBy);
        campaign.setSubject(request.getSubject());
        campaign.setContent(request.getContent());
        campaign.setSendStatus(EmailSendStatus.SENT);
        campaign.setSentAt(LocalDateTime.now());
        EmailCampaign savedCampaign = emailCampaignRepository.save(campaign);

        return new SendEventNotificationResponse(savedCampaign.getCampaignId(), recipients.size(), "Email sent successfully to " + recipients.size() + " recipients");
    }

    @Override
    @Transactional(readOnly = true)
    public TicketSalesReportResponse getTicketSalesReport(Long organizerId, Integer month, Integer year) {
        organizerProfileRepository.findById(organizerId)
                .orElseThrow(() -> new java.util.NoSuchElementException("Organizer with id " + organizerId + " not found"));

        if (month != null && (month < 1 || month > 12)) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        if (year != null && year < 1) {
            throw new IllegalArgumentException("Year must be greater than 0");
        }
        if (month != null && year == null) {
            throw new IllegalArgumentException("Year is required when month is provided");
        }

        List<Order> allOrders = orderRepository.findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(organizerId);
        List<Order> filteredOrders = new ArrayList<>();
        for (Order order : allOrders) {
            if (order.getCreatedAt() == null) {
                continue;
            }
            if (year != null && order.getCreatedAt().getYear() != year) {
                continue;
            }
            if (month != null && order.getCreatedAt().getMonthValue() != month) {
                continue;
            }
            filteredOrders.add(order);
        }

        int totalOrders = filteredOrders.size();
        int paidOrders = 0;
        int ticketsSold = 0;
        BigDecimal revenue = BigDecimal.ZERO;

        Map<Long, EventTicketSalesSummaryResponse> eventSummaryById = new HashMap<>();

        for (Order order : filteredOrders) {
            if (order.getPaymentStatus() != OrderPaymentStatus.PAID) {
                continue;
            }

            paidOrders++;
            revenue = revenue.add(order.getFinalAmount() == null ? BigDecimal.ZERO : order.getFinalAmount());

            int orderTicketCount = sumTotalTickets(order.getOrderItems());
            ticketsSold += orderTicketCount;

            Long eventId = order.getEvent() != null ? order.getEvent().getEventId() : null;
            if (eventId == null) {
                continue;
            }

            EventTicketSalesSummaryResponse summary = eventSummaryById.get(eventId);
            if (summary == null) {
                summary = new EventTicketSalesSummaryResponse();
                summary.setEventId(eventId);
                summary.setEventTitle(order.getEvent().getTitle());
                summary.setPaidOrders(0);
                summary.setTicketsSold(0);
                summary.setRevenue(BigDecimal.ZERO);
                eventSummaryById.put(eventId, summary);
            }

            summary.setPaidOrders(summary.getPaidOrders() + 1);
            summary.setTicketsSold(summary.getTicketsSold() + orderTicketCount);
            summary.setRevenue(summary.getRevenue().add(order.getFinalAmount() == null ? BigDecimal.ZERO : order.getFinalAmount()));
        }

        TicketSalesReportResponse response = new TicketSalesReportResponse();
        response.setOrganizerId(organizerId);
        response.setMonth(month);
        response.setYear(year);
        response.setTotalOrders(totalOrders);
        response.setPaidOrders(paidOrders);
        response.setTicketsSold(ticketsSold);
        response.setRevenue(revenue);
        response.setEventSummaries(new ArrayList<>(eventSummaryById.values()));
        return response;
    }

    @Override
    @Transactional
    public EventResponse publishEvent(Long organizerId, Long eventId) {
        Event event = getOrganizerEvent(organizerId, eventId);
        event.setPublishStatus(PublishStatus.PUBLISHED);
        event.setUpdatedAt(LocalDateTime.now());
        return eventMapper.toResponse(eventRepository.save(event));
    }

    @Override
    @Transactional
    public EventResponse unpublishEvent(Long organizerId, Long eventId) {
        Event event = getOrganizerEvent(organizerId, eventId);
        event.setPublishStatus(PublishStatus.UNPUBLISHED);
        event.setUpdatedAt(LocalDateTime.now());
        return eventMapper.toResponse(eventRepository.save(event));
    }

    private Event getOrganizerEvent(Long organizerId, Long eventId) {
        OrganizerProfile organizer = organizerProfileRepository.findById(organizerId)
                .orElseThrow(() -> new NoSuchElementException("Organizer with id " + organizerId + " not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event with id " + eventId + " not found"));

        if (!event.getOrganizer().getOrganizerId().equals(organizer.getOrganizerId())) {
            throw new IllegalArgumentException("Event does not belong to organizer " + organizerId);
        }

        return event;
    }
}