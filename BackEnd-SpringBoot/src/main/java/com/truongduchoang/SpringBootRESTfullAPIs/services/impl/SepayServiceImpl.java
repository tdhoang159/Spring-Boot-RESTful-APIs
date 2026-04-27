package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.config.SepayConfig;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.SepayWebhookRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.CreateQrResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentStatusResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Payment;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketTypeStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.OrderRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.PaymentRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketTypeRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.SepayService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketTypeStatusService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SepayServiceImpl implements SepayService {

    private static final Logger log = LoggerFactory.getLogger(SepayServiceImpl.class);

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketGenerator ticketGenerator;
    private final SepayConfig sepayConfig;
    private final TicketTypeStatusService ticketTypeStatusService;

    public SepayServiceImpl(
            OrderRepository orderRepository,
            PaymentRepository paymentRepository,
            TicketTypeRepository ticketTypeRepository,
            TicketGenerator ticketGenerator,
            SepayConfig sepayConfig,
            TicketTypeStatusService ticketTypeStatusService) {
        this.orderRepository      = orderRepository;
        this.paymentRepository    = paymentRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.ticketGenerator      = ticketGenerator;
        this.sepayConfig          = sepayConfig;
        this.ticketTypeStatusService = ticketTypeStatusService;
    }

    // ----------------------------------------------------------------
    // Tạo QR URL
    // Format nội dung: {PREFIX}-{orderId} — ví dụ: ORDER-123
    // ----------------------------------------------------------------
    @Override
    public CreateQrResponse createQr(Long orderId, Long userId) {

        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderId, "ORDER_NOT_FOUND"));

        // Nội dung chuyển khoản — SePay dùng để match về webhook
        String description = sepayConfig.getPaymentPrefix()
                + order.getOrderCode().replace("-", "");

        // Build QR URL theo chuẩn SePay
        // https://qr.sepay.vn/img?acc={ACCOUNT_NUMBER}&bank={BANK_CODE}&amount={amount}&des={description}
        String qrUrl = UriComponentsBuilder
                .fromHttpUrl(sepayConfig.getQrBaseUrl())
                .queryParam("acc",    sepayConfig.getBankAccountNumber())
                .queryParam("bank",   sepayConfig.getBankShortName())
                .queryParam("amount", order.getFinalAmount().toPlainString())
                .queryParam("des",      description)
                .queryParam("template", "compact")  // giao diện QR gọn
                .toUriString();

        log.info("[SePay] Created QR for order {} - amount: {} - desc: {}",
                order.getOrderCode(), order.getFinalAmount(), description);

        return new CreateQrResponse(
                qrUrl,
                order.getOrderId(),
                order.getOrderCode(),
                description
        );
    }

    // ----------------------------------------------------------------
    // Lấy trạng thái thanh toán
    // ----------------------------------------------------------------
    @Override
    public PaymentStatusResponse getPaymentStatus(Long orderId, Long userId) {
        Order order = orderRepository.findByOrderIdAndUserUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderId, "ORDER_NOT_FOUND"));

        PaymentStatusResponse res = new PaymentStatusResponse();
        res.setOrderId(order.getOrderId());
        res.setOrderCode(order.getOrderCode());

        res.setStatus(switch (order.getOrderStatus()) {
            case CONFIRMED -> "paid";
            case CANCELLED, EXPIRED -> "cancelled";
            default -> "pending";
        });

        if (order.getOrderStatus() == OrderStatus.CONFIRMED) {
            paymentRepository.findByOrderOrderId(orderId)
                    .ifPresent(p -> res.setPaidAmount(p.getAmount()));
        }

        return res;
    }

    // ----------------------------------------------------------------
    // Xử lý webhook từ SePay
    // QUAN TRỌNG: không được throw exception — SePay cần HTTP 200
    // ----------------------------------------------------------------
    @Override
    @Transactional
    public boolean handleWebhook(SepayWebhookRequest payload) {
        try {
            log.info("[SePay Webhook] Received: id={}, type={}, amount={}, content={}",
                    payload.getId(),
                    payload.getTransferType(),
                    payload.getTransferAmount(),
                    payload.getContent());

            if (!"in".equalsIgnoreCase(payload.getTransferType())) {
                log.info("[SePay Webhook] Ignored - transferType is not 'in'");
                return false;
            }

            if (payload.getId() == null || payload.getTransferAmount() == null) {
                log.warn("[SePay Webhook] Missing transaction id or amount");
                return false;
            }

            if (payload.getAccountNumber() == null
                    || !payload.getAccountNumber().equals(sepayConfig.getBankAccountNumber())) {
                log.warn("[SePay Webhook] Account mismatch for transaction id={}", payload.getId());
                return false;
            }

            if (paymentRepository.existsByTransactionCode(String.valueOf(payload.getId()))) {
                log.warn("[SePay Webhook] Duplicate transaction id={}", payload.getId());
                return false;
            }

            String orderCode = parseOrderCode(payload.getContent());
            if (orderCode == null) {
                log.warn("[SePay Webhook] Cannot parse orderCode from content: {}",
                        payload.getContent());
                return false;
            }

            Order order = orderRepository.findByOrderCode(orderCode).orElse(null);
            if (order == null) {
                log.warn("[SePay Webhook] Order not found: {}", orderCode);
                return false;
            }

            if (order.getExpiredAt() != null && LocalDateTime.now().isAfter(order.getExpiredAt())) {
                log.warn("[SePay Webhook] Order expired: {} - expiredAt={}",
                        orderCode, order.getExpiredAt());
                return false;
            }

            if (order.getOrderStatus() != OrderStatus.PENDING) {
                log.warn("[SePay Webhook] Order is not pending: {} - {}", orderCode, order.getOrderStatus());
                return false;
            }

            if (order.getPaymentStatus() != OrderPaymentStatus.UNPAID) {
                log.warn("[SePay Webhook] Order payment status is not unpaid: {} - {}",
                        orderCode, order.getPaymentStatus());
                return false;
            }

            if (payload.getTransferAmount().compareTo(order.getFinalAmount()) != 0) {
                log.warn("[SePay Webhook] Amount mismatch for order {}. expected={}, actual={}",
                        orderCode, order.getFinalAmount(), payload.getTransferAmount());
                return false;
            }

            processPaymentSuccess(order, payload);

            log.info("[SePay Webhook] Payment success for order: {}", orderCode);
            return true;

        } catch (Exception e) {
            // Bắt tất cả exception — không để SePay retry vô hạn
            log.error("[SePay Webhook] Unexpected error: {}", e.getMessage(), e);
            return false;
        }
    }

    // ----------------------------------------------------------------
    // Xử lý khi thanh toán thành công
    // ----------------------------------------------------------------
    private void processPaymentSuccess(Order order, SepayWebhookRequest payload) {
        LocalDateTime now = LocalDateTime.now();

        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(OrderPaymentStatus.PAID);
        order.setUpdatedAt(now);
        orderRepository.save(order);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(payload.getTransferAmount());
        payment.setPaymentMethod("SEPAY");
        payment.setProvider("SEPAY");
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionCode(String.valueOf(payload.getId()));
        payment.setResponseData(payload.getContent());
        payment.setPaidAt(now);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        paymentRepository.save(payment);

        order.getOrderItems().forEach(item -> {
            var tt = item.getTicketType();
            ticketTypeStatusService.refreshStatus(tt);
            ticketTypeRepository.save(tt);
        });

        ticketGenerator.generateTickets(order);
    }

    // ----------------------------------------------------------------
    // Parse orderCode từ nội dung chuyển khoản
    // Nội dung mẫu: "chuyen tien ORDER-ORD-A1B2C3D4-12345678 mua ve"
    // Pattern: {PREFIX}-{orderCode}
    // ----------------------------------------------------------------
    private String parseOrderCode(String content) {
        if (content == null || content.isBlank()) return null;


        String prefix  = sepayConfig.getPaymentPrefix();
        Pattern pattern = Pattern.compile(
                Pattern.quote(prefix) + "(ORD)([A-Z0-9]{8})([0-9]+)",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            return matcher.group(1).toUpperCase() + "-"
                    + matcher.group(2).toUpperCase() + "-"
                    + matcher.group(3);
        }

        return null;
    }
}
