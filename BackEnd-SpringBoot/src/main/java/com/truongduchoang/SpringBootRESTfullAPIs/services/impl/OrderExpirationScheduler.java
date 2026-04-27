package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.OrderRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketTypeRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketTypeStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class OrderExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OrderExpirationScheduler.class);

    private final OrderRepository orderRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketTypeStatusService ticketTypeStatusService;

    public OrderExpirationScheduler(
            OrderRepository orderRepository,
            TicketTypeRepository ticketTypeRepository,
            TicketTypeStatusService ticketTypeStatusService) {
        this.orderRepository = orderRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.ticketTypeStatusService = ticketTypeStatusService;
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void expirePendingOrders() {
        LocalDateTime now = LocalDateTime.now();

        orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING)
                .filter(order -> order.getPaymentStatus() == OrderPaymentStatus.UNPAID)
                .filter(order -> order.getExpiredAt() != null && now.isAfter(order.getExpiredAt()))
                .forEach(order -> expireOrder(order, now));
    }

    private void expireOrder(Order order, LocalDateTime now) {
        order.setOrderStatus(OrderStatus.EXPIRED);
        order.setUpdatedAt(now);

        order.getOrderItems().forEach(item -> {
            var ticketType = item.getTicketType();
            int quantitySold = ticketType.getQuantitySold() != null ? ticketType.getQuantitySold() : 0;
            ticketType.setQuantitySold(Math.max(0, quantitySold - item.getQuantity()));
            ticketTypeStatusService.refreshStatus(ticketType);
            ticketTypeRepository.save(ticketType);
        });

        orderRepository.save(order);
        log.info("[Order Expiration] Expired order {} and released reserved tickets", order.getOrderCode());
    }
}
