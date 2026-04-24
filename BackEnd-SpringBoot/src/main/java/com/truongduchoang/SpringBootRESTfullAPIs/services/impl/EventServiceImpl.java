package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventSearchRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventDetailResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventSummaryResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.EventUpdateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.EventResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.MediaUploadResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.BadRequestException;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.DuplicateResourceException;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.EventMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Category;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrganizerProfile;
import com.truongduchoang.SpringBootRESTfullAPIs.services.CloudinaryService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.EventService;

@Service
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final EventApprovalRepository eventApprovalRepository;
    private final CategoryRepository categoryRepository;
    private final OrganizerProfileRepository organizerProfileRepository;
    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final EventMapper eventMapper;
    private final CloudinaryService cloudinaryService;

    public EventServiceImpl(
            EventRepository eventRepository, EventApprovalRepository eventApprovalRepository,
            CategoryRepository categoryRepository,
            OrganizerProfileRepository organizerProfileRepository,
            OrderRepository orderRepository,
            TicketRepository ticketRepository,
            EventMapper eventMapper,
            CloudinaryService cloudinaryService) {
        this.eventRepository = eventRepository;
        this.eventApprovalRepository = eventApprovalRepository;
        this.categoryRepository = categoryRepository;
        this.organizerProfileRepository = organizerProfileRepository;
        this.orderRepository = orderRepository;
        this.ticketRepository = ticketRepository;
        this.eventMapper = eventMapper;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
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

        return eventMapper.toResponse(eventRepository.save(event));
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

    @Override
    public Page<EventSummaryResponse> getApprovedEvents(EventSearchRequest req) {
        //List<Long>approvedEventIds = eventApprovalRepository.findByApprovalStatus(ApprovalStatus.APPROVED);
        List<Long> approvedEventIds = eventApprovalRepository.findEventIdsByApprovalStatus(ApprovalStatus.APPROVED);
        if(approvedEventIds.isEmpty()) return Page.empty();

        Specification<Event> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            predicates.add(root.get("eventId").in(approvedEventIds));

            if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
                String likePattern = "%" + req.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likePattern),
                        cb.like(cb.lower(root.get("shortDescription")), likePattern)
                ));
            }

            // Lọc theo category
            if (req.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("categoryId"), req.getCategoryId()));
            }

            // Lọc theo city
            if (req.getCity() != null && !req.getCity().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("city")),
                        "%" + req.getCity().trim().toLowerCase() + "%"
                ));
            }

            // Lọc theo ngày (startTime trong ngày đó)
            if (req.getDate() != null) {
                LocalDateTime startOfDay = req.getDate().atStartOfDay();
                LocalDateTime endOfDay   = req.getDate().atTime(23, 59, 59);
                predicates.add(cb.between(root.get("startTime"), startOfDay, endOfDay));
            }

            // Lọc theo loại hình (ONLINE / OFFLINE)
            if (req.getLocationType() != null) {
                predicates.add(cb.equal(root.get("locationType"), req.getLocationType()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 3. Build Pageable với sort
        Sort sort = req.getSortDir().equalsIgnoreCase("desc")
                ? Sort.by(req.getSortBy()).descending()
                : Sort.by(req.getSortBy()).ascending();

        Pageable pageable = PageRequest.of(req.getPage(), req.getSize(), sort);

        // 4. Query + map sang DTO
        Page<Event> eventPage = eventRepository.findAll(spec, pageable);

        return eventPage.map(eventMapper::toSummaryResponse);
    }

    @Override
    public EventDetailResponse getApprovedEventBySlug(String slug) {
        Event event = eventRepository.findBySlugAndApprovalStatus(slug, ApprovalStatus.APPROVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event with slug " + slug + " not found or not approved yet",
                        "EVENT_NOT_FOUND"));
        return eventMapper.toDetailResponse(event);
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
}
