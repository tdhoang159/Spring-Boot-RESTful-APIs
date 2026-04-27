package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class TicketSalesReportResponse {

    private Long organizerId;
    private Integer month;
    private Integer year;
    private Integer totalOrders;
    private Integer paidOrders;
    private Integer ticketsSold;
    private BigDecimal revenue;
    private List<EventTicketSalesSummaryResponse> eventSummaries = new ArrayList<>();

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Integer getPaidOrders() {
        return paidOrders;
    }

    public void setPaidOrders(Integer paidOrders) {
        this.paidOrders = paidOrders;
    }

    public Integer getTicketsSold() {
        return ticketsSold;
    }

    public void setTicketsSold(Integer ticketsSold) {
        this.ticketsSold = ticketsSold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public List<EventTicketSalesSummaryResponse> getEventSummaries() {
        return eventSummaries;
    }

    public void setEventSummaries(List<EventTicketSalesSummaryResponse> eventSummaries) {
        this.eventSummaries = eventSummaries;
    }
}
