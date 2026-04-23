package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.LocationType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class EventCreateRequest {
    @NotNull(message = "Organizer không được bỏ trống")
    private Long organizerId;

    @NotNull(message = "Category không được bỏ trống")
    private Long categoryId;

    @NotBlank(message = "Tên sự kiện không được bỏ trống")
    @Size(max = 200, message = "Tên sự kiện không được vượt quá 200 ký tự")
    private String title;

    @NotBlank(message = "Slug không được bỏ trống")
    @Size(max = 220, message = "Slug không được vượt quá 220 ký tự")
    private String slug;

    @Size(max = 500, message = "Mô tả ngắn không được vượt quá 500 ký tự")
    private String shortDescription;

    private String description;

    @Size(max = 200, message = "Tên địa điểm không được vượt quá 200 ký tự")
    private String venueName;

    @Size(max = 255, message = "Địa chỉ địa điểm không được vượt quá 255 ký tự")
    private String venueAddress;

    @Size(max = 100, message = "Thành phố không được vượt quá 100 ký tự")
    private String city;

    @NotNull(message = "Hình thức tổ chức không được bỏ trống")
    private LocationType locationType;

    @Size(max = 255, message = "Meeting URL không được vượt quá 255 ký tự")
    private String meetingUrl;

    @NotNull(message = "Thời gian bắt đầu không được bỏ trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startTime;

    @NotNull(message = "Thời gian kết thúc không được bỏ trống")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endTime;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime registrationDeadline;

    private PublishStatus publishStatus = PublishStatus.DRAFT;

    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    private List<TicketTypeCreateRequest> ticketTypes;

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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

    public List<TicketTypeCreateRequest> getTicketTypes() {
        return ticketTypes;
    }

    public void setTicketTypes(List<TicketTypeCreateRequest> ticketTypes) {
        this.ticketTypes = ticketTypes;
    }
}
