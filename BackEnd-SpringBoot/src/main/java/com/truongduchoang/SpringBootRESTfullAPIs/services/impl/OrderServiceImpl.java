package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderItemRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.config.SepayConfig;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.OrderMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.models.*;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.*;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketTypeStatusService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;
    private final SepayConfig sepayConfig;
    private final TicketTypeStatusService ticketTypeStatusService;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            EventRepository eventRepository,
            TicketTypeRepository ticketTypeRepository,
            UserRepository userRepository,
            OrderMapper orderMapper,
            OrderValidator orderValidator,
            SepayConfig sepayConfig,
            TicketTypeStatusService ticketTypeStatusService) {
        this.orderRepository = orderRepository;
        this.eventRepository = eventRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.userRepository = userRepository;
        this.orderMapper = orderMapper;
        this.orderValidator = orderValidator;
        this.sepayConfig = sepayConfig;
        this.ticketTypeStatusService = ticketTypeStatusService;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, Long userId) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found", "EVENT_NOT_FOUND"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found", "USER_NOT_FOUND"));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Khong thể tạo đơn hàng không có sản phẩm nào");
        }

        for (OrderItemRequest itemReq : request.getItems()) {

            TicketType ticketType = ticketTypeRepository
                    .findById(itemReq.getTicketTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "TicketType not found: " + itemReq.getTicketTypeId(),
                            "TICKET_TYPE_NOT_FOUND"));

            orderValidator.validateTicketType(
                    ticketType, itemReq.getQuantity(), event.getEventId());

            BigDecimal subtotal = ticketType.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setTicketType(ticketType);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(ticketType.getPrice());
            orderItem.setSubtotal(subtotal);
            orderItems.add(orderItem);

            ticketType.setQuantitySold(
                    ticketType.getQuantitySold() + itemReq.getQuantity());
            ticketTypeStatusService.refreshStatus(ticketType);
            ticketTypeRepository.save(ticketType);
        }

        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setEvent(event);
        order.setUser(user);
        order.setBuyerName(request.getBuyerName());
        order.setBuyerEmail(request.getBuyerEmail());
        order.setBuyerPhone(request.getBuyerPhone());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(OrderPaymentStatus.UNPAID);
        order.setCreatedAt(LocalDateTime.now());
        order.setExpiredAt(order.getCreatedAt().plusMinutes(sepayConfig.getExpireMinutes()));

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return orderMapper.toResponseWithoutPayment(savedOrder);
    }

    @Override
    public OrderResponse getMyOrderByCode(String orderCode, Long userId) {
        Order order = orderRepository.findMyOrderByCodeWithItems(orderCode, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderCode, "ORDER_NOT_FOUND"));
        return orderMapper.toResponseWithoutPayment(order);
    }

    @Override
    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findMyOrdersWithItems(userId).stream()
                .map(orderMapper::toResponseWithoutPayment)
                .collect(Collectors.toList());
    }

    private String generateOrderCode() {
        String uuid = UUID.randomUUID()
                .toString().replace("-", "")
                .substring(0, 8).toUpperCase();
        String ts = String.valueOf(System.currentTimeMillis());
        ts = ts.substring(ts.length() - 8);
        return "ORD-" + uuid + "-" + ts;
    }
}
