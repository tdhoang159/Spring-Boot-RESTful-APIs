package com.truongduchoang.SpringBootRESTfullAPIs.services;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SepayWebhookRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.CreateQrResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentStatusResponse;

public interface SepayService {

    // Tạo QR URL cho order, cập nhật order status = PENDING
    CreateQrResponse createQr(Long orderId, Long userId);

    // Đọc trạng thái thanh toán của order
    PaymentStatusResponse getPaymentStatus(Long orderId, Long userId);

    // Xử lý webhook từ SePay — luôn không throw exception
    // Trả true nếu xử lý thành công, false nếu bỏ qua
    boolean handleWebhook(SepayWebhookRequest payload);
}
