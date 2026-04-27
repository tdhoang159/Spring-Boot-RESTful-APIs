package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.security.SecurityUtils;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        OrderResponse data = orderService.createOrder(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                HttpStatus.CREATED,
                "Order created successfully",
                data,
                null));
    }

    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @PathVariable String orderCode) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Order fetched successfully",
                orderService.getMyOrderByCode(orderCode, userId),
                null));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Orders fetched successfully",
                orderService.getMyOrders(userId),
                null));
    }
}
