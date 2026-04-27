package com.truongduchoang.SpringBootRESTfullAPIs.controllers;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.CreateQrRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SepayWebhookRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.CreateQrResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentStatusResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.ApiResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.security.SecurityUtils;
import com.truongduchoang.SpringBootRESTfullAPIs.services.SepayService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sepay")
@CrossOrigin(origins = "http://localhost:5173")
public class SepayController {

    private final SepayService sepayService;

    public SepayController(SepayService sepayService) {
        this.sepayService = sepayService;
    }

    @PostMapping("/qr")
    public ResponseEntity<ApiResponse<CreateQrResponse>> createQr(
            @Valid @RequestBody CreateQrRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        CreateQrResponse response = sepayService.createQr(request.getOrderId(), userId);
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "QR created successfully",
                response,
                null));
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<ApiResponse<PaymentStatusResponse>> getPaymentStatus(
            @PathVariable Long orderId) {
        Long userId = SecurityUtils.getCurrentUserId();
        PaymentStatusResponse response = sepayService.getPaymentStatus(orderId, userId);
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK,
                "Payment status fetched successfully",
                response,
                null));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Boolean>> handleWebhook(
            @RequestBody SepayWebhookRequest payload) {
        boolean processed = sepayService.handleWebhook(payload);
        return ResponseEntity.ok(Map.of("success", processed));
    }
}
