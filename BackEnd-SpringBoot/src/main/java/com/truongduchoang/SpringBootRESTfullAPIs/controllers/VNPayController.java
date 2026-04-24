package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * ⚠️ DEPRECATED - Dùng PaymentController thay thế
 *
 * File này giữ lại để tương thích với code cũ
 * Tất cả callback logic đã chuyển sang PaymentController
 *
 * Luồng mới:
 * 1. OrderController.POST /api/orders → Tạo Order + URL thanh toán
 * 2. User thanh toán trên VNPay
 * 3. VNPay callback → PaymentController.GET /api/payment/vnpay-ipn
 * 4. User redirect → PaymentController.GET /api/payment/vnpay-return
 */
@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/payment")
public class VNPayController {

    @Autowired
    private VNPayService vnpayService;

    @Autowired
    private OrderService orderService;

    /**
     * ❌ DEPRECATED - Không dùng nữa
     *
     * Lý do: OrderController.POST /api/orders đã sinh URL thanh toán
     *
     * Luồng cũ (không dùng):
     * POST /api/payment/vnpay?invoiceId=[1,2,3]&amount=1000000
     * → vnpayService.createOrder()
     *
     * Luồng mới (dùng):
     * POST /api/orders {eventId, items, ...}
     * → OrderServiceImpl.createOrder()
     * → VNPayServiceImpl.createPaymentUrl()
     */
    @PostMapping("/vnpay")
    public ResponseEntity<?> createPayment(HttpServletRequest request, @RequestBody java.util.Map<String, Object> paymentRequest) {
        return ResponseEntity.badRequest().body(
                "❌ DEPRECATED: Use POST /api/orders instead\n" +
                        "Luồng mới: POST /api/orders {eventId, items, buyerName, ...}"
        );
    }

    /**
     * ❌ DEPRECATED - Callback logic đã chuyển sang PaymentController
     *
     * Cũ: GET /api/payment/vnpay-payment-return
     * Mới: GET /api/payment/vnpay-return (trong PaymentController)
     */
    @GetMapping("/vnpay-payment-return")
    public String returnPayment(HttpServletRequest request) {
        // Redirect sang endpoint mới
        String orderCode = request.getParameter("vnp_TxnRef");
        String responseCode = request.getParameter("vnp_ResponseCode");

        if ("00".equals(responseCode)) {
            return "redirect:http://localhost:3000/payment?status=success&orderCode=" + orderCode;
        } else if ("24".equals(responseCode)) {
            return "redirect:http://localhost:3000/payment?status=cancel&orderCode=" + orderCode;
        } else {
            return "redirect:http://localhost:3000/payment?status=fail&orderCode=" + orderCode;
        }
    }
}
