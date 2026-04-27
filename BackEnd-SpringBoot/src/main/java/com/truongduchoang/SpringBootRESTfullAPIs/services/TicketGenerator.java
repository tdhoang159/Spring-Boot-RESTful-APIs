package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;

public interface TicketGenerator {

    void generateTickets(Order order);
}
