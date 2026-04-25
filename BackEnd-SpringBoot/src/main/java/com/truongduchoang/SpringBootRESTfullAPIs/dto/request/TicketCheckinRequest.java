package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import jakarta.validation.constraints.NotBlank;

public class TicketCheckinRequest {
    @NotBlank(message = "ticketCode is required")
    private String ticketCode;

    private Long eventId;

    private String gateName;

    public String getTicketCode() {
        return ticketCode;
    }

    public void setTicketCode(String ticketCode) {
        this.ticketCode = ticketCode;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }
}
