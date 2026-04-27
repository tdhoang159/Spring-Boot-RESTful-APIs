package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderCreateRequest request, Long userId);

    OrderResponse getMyOrderByCode(String orderCode, Long userId);

    List<OrderResponse> getMyOrders(Long userId);
}
