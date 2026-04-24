package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;


import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.LocationType;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public class EventSummaryResponse {

    private Long eventId;
    private String title;
    private String slug;
    private String shortDescription;
    private String bannerUrl;
    private String city;
    private String venueName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocationType locationType;
    private String categoryName;
    private String organizerName;
    private BigDecimal minPrice;   // giá vé rẻ nhất

    public EventSummaryResponse() {}

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public LocationType getLocationType() { return locationType; }
    public void setLocationType(LocationType locationType) { this.locationType = locationType; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }
}