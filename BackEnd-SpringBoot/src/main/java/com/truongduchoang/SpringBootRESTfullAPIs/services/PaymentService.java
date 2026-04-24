package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentResponse;

import java.util.Map;

public interface PaymentService {

    // VNPay gọi về server — nguồn đáng tin để cập nhật DB
    // Trả String đúng chuẩn VNPay: "RspCode=00&Message=Confirm Success"
    String handleIpnCallback(Map<String, String> params);

    // User được redirect về sau thanh toán — chỉ đọc kết quả, không cập nhật DB
    PaymentResponse handleReturnUrl(Map<String, String> params);
}