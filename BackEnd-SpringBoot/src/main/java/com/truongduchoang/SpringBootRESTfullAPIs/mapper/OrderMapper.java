package com.truongduchoang.SpringBootRESTfullAPIs.mapper;


import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderItemResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrderItem;
import com.truongduchoang.SpringBootRESTfullAPIs.models.User;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public Order toEntity(OrderCreateRequest request,
                          Event event,
                          User user,
                          BigDecimal totalAmount,
                          List<OrderItem> orderItems,
                          String orderCode) {
        if (request == null) {
            return null;
        }

        Order order = new Order();

        // 1. Thông tin định danh & Quan hệ
        order.setOrderCode(orderCode);
        order.setEvent(event);
        order.setUser(user);

        // 2. Thông tin từ Request
        order.setBuyerName(request.getBuyerName());
        order.setBuyerEmail(request.getBuyerEmail());
        order.setBuyerPhone(request.getBuyerPhone());

        // 3. Thông tin tài chính
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);

        // 4. Trạng thái & Thời gian
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(OrderPaymentStatus.UNPAID);
        order.setCreatedAt(LocalDateTime.now());

        // 5. Gắn OrderItems và thiết lập quan hệ 2 chiều
        if (orderItems != null) {
            orderItems.forEach(item -> item.setOrder(order));
            order.setOrderItems(orderItems);
        }

        return order;
    }

    public OrderResponse toResponse(Order order, String paymentUrl) {
        OrderResponse res = new OrderResponse();
        res.setOrderId(order.getOrderId());
        res.setOrderCode(order.getOrderCode());
        res.setOrderStatus(order.getOrderStatus() != null
                ? order.getOrderStatus().name() : null);
        res.setPaymentStatus(order.getPaymentStatus() != null
                ? order.getPaymentStatus().name() : null);
        res.setBuyerName(order.getBuyerName());
        res.setBuyerEmail(order.getBuyerEmail());
        res.setBuyerPhone(order.getBuyerPhone());
        res.setTotalAmount(order.getTotalAmount());
        res.setDiscountAmount(order.getDiscountAmount());
        res.setFinalAmount(order.getFinalAmount());
        res.setCreatedAt(order.getCreatedAt());
        res.setPaymentUrl(paymentUrl);

        List<OrderItemResponse> items = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList())
                : Collections.emptyList();
        res.setItems(items);

        return res;
    }

    // Overload không có paymentUrl — dùng khi chỉ cần xem order
    public OrderResponse toResponseWithoutPayment(Order order) {
        return toResponse(order, null);
    }

    // ----------------------------------------------------------------
    // OrderItem → OrderItemResponse
    // ----------------------------------------------------------------
    public OrderItemResponse toItemResponse(OrderItem item) {
        OrderItemResponse res = new OrderItemResponse();
        if(item.getTicketType() == null) {
            throw new IllegalArgumentException("Lỗi ở đây nè " + item.getOrderItemId());
        }
        res.setOrderItemId(item.getOrderItemId());
        res.setTicketTypeId(item.getTicketType().getTicketTypeId());
        res.setTicketName(item.getTicketType().getTicketName());
        res.setQuantity(item.getQuantity());
        res.setUnitPrice(item.getUnitPrice());
        res.setSubtotal(item.getSubtotal());
        return res;
    }
}

//    public OrderItemResponse toItemResponse(OrderItem item) {
//        OrderItemResponse res = new OrderItemResponse();
//        res.setOrderItemId(item.getOrderItemId());
//        if (item.getTicketType() != null) {
//            res.setTicketTypeId(item.getTicketType().getTicketTypeId());
//            res.setTicketName(item.getTicketType().getTicketName());
//        } else {
//            // Xử lý trường hợp null, ví dụ đặt giá trị mặc định hoặc ghi log
//            res.setTicketTypeId(null);
//            res.setTicketName("Unknown");
//        }
//        res.setQuantity(item.getQuantity());
//        res.setUnitPrice(item.getUnitPrice());
//        res.setSubtotal(item.getSubtotal());
//        return res;
//    }
//}
