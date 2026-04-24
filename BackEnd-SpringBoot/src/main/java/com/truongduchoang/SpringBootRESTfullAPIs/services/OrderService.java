package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * OrderService Interface
 * Quản lý Order + Thanh toán VNPay
 */
public interface OrderService {

    /**
     * Tạo Order + lấy URL thanh toán VNPay
     */
    OrderResponse createOrder(OrderCreateRequest request,
                              Long userId,
                              HttpServletRequest httpRequest);

    /**
     * Lấy chi tiết Order theo orderCode
     */
    OrderResponse getOrderByCode(String orderCode);

    /**
     * Lấy danh sách Order của user (trang "Đơn hàng của tôi")
     */
    List<OrderResponse> getMyOrders(Long userId);

    /**
     * Cập nhật payment info (phương thức cũ - nếu cần)
     */
    void updatePaymentInfo(List<Integer> invoiceIds, String method, MultipartFile proofImage);

    /**
     * ✅ PHƯƠNG THỨC MỚI - Xử lý VNPay callback
     * Được gọi từ PaymentServiceImpl.handleIpnCallback()
     * @param params Map chứa các parameters từ VNPay
     */
    void handleVNPayCallback(Map<String, String> params);
}
