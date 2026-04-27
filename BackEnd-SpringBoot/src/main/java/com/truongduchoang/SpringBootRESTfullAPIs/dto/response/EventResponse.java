package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.LocationType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;

public class EventResponse {
    private Long eventId;
    private OrganizerSummaryResponse organizer;
    private CategorySummaryResponse category;
    private String title;
    private String slug;
    private String shortDescription;
    private String description;
    private String bannerUrl;
    private String venueName;
    private String venueAddress;
    private String city;
    private LocationType locationType;
    private String meetingUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime registrationDeadline;
    private PublishStatus publishStatus;
    private ApprovalStatus approvalStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TicketTypeResponse> ticketTypes;

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public OrganizerSummaryResponse getOrganizer() {
        return organizer;
    }

    public void setOrganizer(OrganizerSummaryResponse organizer) {
        this.organizer = organizer;
    }

    public CategorySummaryResponse getCategory() {
        return category;
    }

    public void setCategory(CategorySummaryResponse category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getVenueAddress() {
        return venueAddress;
    }

    public void setVenueAddress(String venueAddress) {
        this.venueAddress = venueAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocationType getLocationType() {
        return locationType;
    }

    public void setLocationType(LocationType locationType) {
        this.locationType = locationType;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(LocalDateTime registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public PublishStatus getPublishStatus() {
        return publishStatus;
    }

    public void setPublishStatus(PublishStatus publishStatus) {
        this.publishStatus = publishStatus;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<TicketTypeResponse> getTicketTypes() {
        return ticketTypes;
    }

    public void setTicketTypes(List<TicketTypeResponse> ticketTypes) {
        this.ticketTypes = ticketTypes;
    }
}
