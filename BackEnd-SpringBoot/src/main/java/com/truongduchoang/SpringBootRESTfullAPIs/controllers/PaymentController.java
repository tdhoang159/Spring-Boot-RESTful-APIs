package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * PaymentController - Xử lý callback từ VNPay
 *
 * Có 2 endpoints:
 * 1. GET /api/payment/vnpay-ipn       ← VNPay gọi (IPN)
 * 2. GET /api/payment/vnpay-return    ← User redirect về
 */
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * IPN Callback từ VNPay (quan trọng nhất!)
     *
     * VNPay gọi endpoint này để thông báo kết quả thanh toán
     * Endpoint: GET /api/payment/vnpay-ipn
     *
     * Response: RspCode=00&Message=Confirm Success (đúng chuẩn VNPay)
     *
     * Lưu ý: Chỉ có VNPay gọi endpoint này, user không thấy
     */
    @GetMapping("/vnpay-ipn")
    @ResponseBody
    public String handleVNPayIPN(HttpServletRequest request) {
        System.out.println("=== VNPay IPN Callback ===");

        // Lấy tất cả parameters từ request
        Map<String, String> params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();

        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            params.put(paramName, paramValue);
            System.out.println(paramName + ": " + paramValue);
        }

        System.out.println("================================");

        // Gọi PaymentService để xử lý
        String response = paymentService.handleIpnCallback(params);

        System.out.println("IPN Response: " + response);

        return response;
    }

    /**
     * Return URL - User redirect về sau thanh toán
     *
     * Sau khi user hoàn thành thanh toán trên VNPay,
     * browser redirect về endpoint này
     *
     * Response: JSON PaymentResponse cho frontend xử lý
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<PaymentResponse> handleVNPayReturn(HttpServletRequest request) {
        System.out.println("=== VNPay Return URL ===");

        // Lấy tất cả parameters từ request
        Map<String, String> params = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();

        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            params.put(paramName, paramValue);
            System.out.println(paramName + ": " + paramValue);
        }

        System.out.println("================================");

        try {
            // Gọi PaymentService để xử lý
            PaymentResponse response = paymentService.handleReturnUrl(params);

            System.out.println("Return Response: " + response.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error handling return URL: " + e.getMessage());
            e.printStackTrace();

            PaymentResponse errorResponse = PaymentResponse.failed(
                    params.get("vnp_TxnRef"),
                    "Lỗi xử lý thanh toán: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}
