//package com.truongduchoang.SpringBootRESTfullAPIs.controllers;
//
//import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
//import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
//import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
//import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.validation.Valid;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
////import org.springframework.security.core.Authentication;
////import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//public class OrderController {
//
//    private final OrderService orderService;
//
//    public OrderController(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    /**
//     * POST /api/orders
//     * Tạo đơn hàng mua vé + lấy URL thanh toán VNPay
//     *
//     * Request body:
//     * {
//     *   "eventId": 1,
//     *   "buyerName": "Nguyễn Văn A",
//     *   "buyerEmail": "a@example.com",
//     *   "buyerPhone": "0912345678",
//     *   "items": [
//     *     {
//     *       "ticketTypeId": 5,
//     *       "quantity": 2
//     *     }
//     *   ]
//     * }
//     */
//    @PostMapping
//    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
//            @Valid @RequestBody OrderCreateRequest request,
//            HttpServletRequest httpRequest) {
//
//        // Lấy userId từ token (hoặc session)
//        // Nếu chưa có auth, dùng userId = 1 (test)
//        //Long userId = getCurrentUserId();
//        Long userId = 4L;
//
//        OrderResponse orderResponse = orderService.createOrder(request, userId, httpRequest);
//
//        ApiResponse<OrderResponse> result = new ApiResponse<>(
//                HttpStatus.CREATED,
//                "Order created successfully. Redirect to paymentUrl",
//                orderResponse,
//                null
//        );
//        return ResponseEntity.status(HttpStatus.CREATED).body(result);
//    }
//
//    /**
//     * GET /api/orders/{orderCode}
//     * Lấy chi tiết đơn hàng
//     *
//     * Ví dụ: /api/orders/ORD-A1B2C3D4-12345678
//     */
//    @GetMapping("/{orderCode}")
//    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByCode(
//            @PathVariable String orderCode) {
//
//        OrderResponse orderResponse = orderService.getOrderByCode(orderCode);
//
//        ApiResponse<OrderResponse> result = new ApiResponse<>(
//                HttpStatus.OK,
//                "Get order successfully",
//                orderResponse,
//                null
//        );
//        return ResponseEntity.ok(result);
//    }
//
//    /**
//     * GET /api/orders/my-orders
//     * Lấy danh sách đơn hàng của user (Trang "Đơn hàng của tôi")
//     */
//    @GetMapping("/my-orders")
//    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {
//        //Long userId = getCurrentUserId();
//        Long userId = 4L;
//
//        List<OrderResponse> orders = orderService.getMyOrders(userId);
//
//        ApiResponse<List<OrderResponse>> result = new ApiResponse<>(
//                HttpStatus.OK,
//                "Get orders successfully",
//                orders,
//                null
//        );
//        return ResponseEntity.ok(result);
//    }
//
//    /**
//     * Hàm hỗ trợ: Lấy userId từ Authentication
//     * Nếu chưa implement Security, dùng userId mặc định = 1
//     */
////    private Long getCurrentUserId() {
////        try {
////            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
////            if (auth != null && auth.isAuthenticated()) {
////                // TODO: Lấy userId từ auth (tuỳ cách implement)
////                // return ((UserDetails) auth.getPrincipal()).getId();
////            }
////        } catch (Exception e) {
////            System.err.println("Error getting userId: " + e.getMessage());
////        }
////        // Fallback: dùng userId = 1 cho test
////        return 1L;
////    }
//}

package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * OrderController - API mua vé + thanh toán
 *
 * Luồng:
 * 1. POST /api/orders → Tạo Order + lấy URL thanh toán VNPay
 * 2. Frontend redirect → VNPay (user thanh toán)
 * 3. VNPay callback → PaymentController (xử lý payment)
 * 4. GET /api/orders/{orderCode} → Lấy chi tiết Order
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * POST /api/orders - TẠO ĐƠN HÀNG + LẤY URL THANH TOÁN
     *
     * Request body:
     * {
     *   "eventId": 1,
     *   "buyerName": "Nguyễn Văn A",
     *   "buyerEmail": "a@example.com",
     *   "buyerPhone": "0912345678",
     *   "items": [
     *     {
     *       "ticketTypeId": 5,
     *       "quantity": 2
     *     }
     *   ]
     * }
     *
     * Response:
     * {
     *   "status": "Success",
     *   "message": "Order created successfully. Redirect to paymentUrl",
     *   "data": {
     *     "orderId": 24,
     *     "orderCode": "ORD-DF46A3D4-32440052",
     *     "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
     *     "items": [...]
     *   }
     * }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderCreateRequest request,
            HttpServletRequest httpRequest) {

        // TODO: Lấy userId từ token/session. Hiện tại dùng userId = 4 để test
        Long userId = 4L;

        System.out.println("=== POST /api/orders ===");
        System.out.println("Request: " + request);

        OrderResponse orderResponse = orderService.createOrder(request, userId, httpRequest);

        System.out.println("Order created: " + orderResponse.getOrderCode());
        System.out.println("Payment URL: " + orderResponse.getPaymentUrl());

        ApiResponse<OrderResponse> result = new ApiResponse<>(
                HttpStatus.CREATED,
                "Order created successfully. Redirect to paymentUrl",
                orderResponse,
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * GET /api/orders/{orderCode} - LẤY CHI TIẾT ĐƠN HÀNG
     *
     * Ví dụ: /api/orders/ORD-A1B2C3D4-12345678
     *
     * Response:
     * {
     *   "status": "Success",
     *   "message": "Get order successfully",
     *   "data": {
     *     "orderId": 24,
     *     "orderCode": "ORD-DF46A3D4-32440052",
     *     "orderStatus": "CONFIRMED",
     *     "paymentStatus": "PAID",
     *     "totalAmount": 1600000,
     *     "items": [...]
     *   }
     * }
     */
    @GetMapping("/{orderCode}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByCode(
            @PathVariable String orderCode) {

        System.out.println("=== GET /api/orders/{orderCode} ===");
        System.out.println("OrderCode: " + orderCode);

        OrderResponse orderResponse = orderService.getOrderByCode(orderCode);

        ApiResponse<OrderResponse> result = new ApiResponse<>(
                HttpStatus.OK,
                "Get order successfully",
                orderResponse,
                null
        );
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/orders/my-orders - LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
     *
     * Trang "Đơn hàng của tôi"
     *
     * Response:
     * {
     *   "status": "Success",
     *   "message": "Get orders successfully",
     *   "data": [
     *     {
     *       "orderId": 24,
     *       "orderCode": "ORD-DF46A3D4-32440052",
     *       "orderStatus": "CONFIRMED",
     *       ...
     *     },
     *     ...
     *   ]
     * }
     */
    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders() {

        // TODO: Lấy userId từ token/session. Hiện tại dùng userId = 4 để test
        Long userId = 4L;

        System.out.println("=== GET /api/orders/my-orders ===");
        System.out.println("UserId: " + userId);

        List<OrderResponse> orders = orderService.getMyOrders(userId);

        ApiResponse<List<OrderResponse>> result = new ApiResponse<>(
                HttpStatus.OK,
                "Get orders successfully",
                orders,
                null
        );
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/orders/test/create-demo - TẠO ĐƠN HÀNG DEMO (CHỈ ĐỂ TEST)
     *
     * Endpoint này tạo order tự động để test mà không cần request body
     *
     * Usage: GET http://localhost:8080/api/orders/test/create-demo
     */
//    @GetMapping("/test/create-demo")
//    public ResponseEntity<ApiResponse<OrderResponse>> createDemoOrder(
//            HttpServletRequest httpRequest) {
//
//        Long userId = 4L;
//        Long eventId = 1L;
//
//        // Tạo request demo
//        OrderCreateRequest request = new OrderCreateRequest();
//        request.setEventId(eventId);
//        request.setBuyerName("Nguyễn Văn Test");
//        request.setBuyerEmail("test@example.com");
//        request.setBuyerPhone("0912345678");
//
//        // Thêm 2 loại vé
//        OrderCreateRequest.OrderItemRequest item1 = new OrderCreateRequest.OrderItemRequest();
//        item1.setTicketTypeId(5L);
//        item1.setQuantity(2);
//
//        request.setItems(List.of(item1));
//
//        System.out.println("=== GET /api/orders/test/create-demo ===");
//
//        OrderResponse orderResponse = orderService.createOrder(request, userId, httpRequest);
//
//        ApiResponse<OrderResponse> result = new ApiResponse<>(
//                HttpStatus.CREATED,
//                "Demo order created successfully. Redirect to paymentUrl",
//                orderResponse,
//                null
//        );
//        return ResponseEntity.status(HttpStatus.CREATED).body(result);
//    }
}

