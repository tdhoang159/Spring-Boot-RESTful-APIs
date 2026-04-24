package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

/**
 * Interface VNPay Service
 * - createPaymentUrl: Sinh URL thanh toán (từ VNPayServiceImpl)
 * - verifyCallback: Verify chữ ký từ VNPay callback
 *
 * Lưu ý: Loại bỏ createOrder() & orderReturn() vì đã có VNPayServiceImpl
 */
public interface VNPayService {

    /**
     * Sinh URL thanh toán từ Order
     * @param order Order entity với finalAmount, orderCode, etc.
     * @param request HttpServletRequest để lấy IP, bank code
     * @return Map chứa paymentUrl và txnRef
     */
    Map<String, String> createPaymentUrl(Order order, HttpServletRequest request);

    /**
     * Verify callback từ VNPay
     * @param params Map chứa tất cả parameters từ VNPay callback
     * @return true nếu chữ ký hợp lệ, false nếu không
     */
    boolean verifyCallback(Map<String, String> params);
}
