package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.PaymentResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.models.*;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.*;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.OrderRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.PaymentRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketTypeRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.PaymentService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.VNPayService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final VNPayService vnPayService;

    public PaymentServiceImpl(
            OrderRepository orderRepository,
            TicketRepository ticketRepository,
            PaymentRepository paymentRepository,
            TicketTypeRepository ticketTypeRepository,
            VNPayService vnPayService) {
        this.orderRepository      = orderRepository;
        this.ticketRepository     = ticketRepository;
        this.paymentRepository    = paymentRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.vnPayService         = vnPayService;
    }

    // ================================================================
    // IPN — VNPay gọi về server
    // ================================================================
//   server @Override
//    @Transactional
//    public String handleIpnCallback(Map<String, String> params) {
//
//        // 1. Verify chữ ký
//        if (!vnPayService.verifyCallback(params)) {
//            return "RspCode=97&Message=Invalid Checksum";
//        }
//
//        // 2. Tìm Order theo orderCode
//        String txnRef = params.get("vnp_TxnRef");
//        Order order = orderRepository.findByOrderCode(txnRef)
//                .orElse(null);
//        if (order == null) {
//            return "RspCode=01&Message=Order Not Found";
//        }
//
//        // 3. Tránh xử lý 2 lần
//        if (order.getOrderStatus() != OrderStatus.PENDING) {
//            return "RspCode=02&Message=Order Already Confirmed";
//        }
//
//        // 4. Kiểm tra số tiền
//        long vnpAmount    = Long.parseLong(params.get("vnp_Amount"));
//        long expectAmount = order.getFinalAmount()
//                .multiply(BigDecimal.valueOf(100)).longValue();
//        if (vnpAmount != expectAmount) {
//            return "RspCode=04&Message=Invalid Amount";
//        }
//
//        // 5. Xử lý theo kết quả
//        String responseCode       = params.get("vnp_ResponseCode");
//        String transactionStatus  = params.get("vnp_TransactionStatus");
//        String transactionCode    = params.get("vnp_TransactionNo");
//        boolean isSuccess = "00".equals(responseCode)
//                && "00".equals(transactionStatus);
//
//        if (isSuccess) {
//            processSuccess(order, transactionCode, params.toString());
//        } else {
//            processFailed(order, transactionCode, params.toString());
//        }
//
//        return "RspCode=00&Message=Confirm Success";
//    }

    @Override
    @Transactional
    public String handleIpnCallback(Map<String, String> params) {

        // 1. Verify chữ ký
        if (!vnPayService.verifyCallback(params)) {
            return "RspCode=97&Message=Invalid Checksum";
        }

        // 2. Tìm Order theo orderCode (txnRef = orderCode)
        String txnRef = params.get("vnp_TxnRef");  // ← Đây là orderCode
        Order order = orderRepository.findByOrderCode(txnRef)
                .orElse(null);
        if (order == null) {
            return "RspCode=01&Message=Order Not Found";
        }

        // 3. Tránh xử lý 2 lần
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            return "RspCode=02&Message=Order Already Confirmed";
        }

        // 4. Kiểm tra số tiền
        long vnpAmount    = Long.parseLong(params.get("vnp_Amount"));
        long expectAmount = order.getFinalAmount()
                .multiply(BigDecimal.valueOf(100)).longValue();
        if (vnpAmount != expectAmount) {
            return "RspCode=04&Message=Invalid Amount";
        }

        // 5. Xử lý theo kết quả
        String responseCode       = params.get("vnp_ResponseCode");
        String transactionStatus  = params.get("vnp_TransactionStatus");
        String transactionCode    = params.get("vnp_TransactionNo");
        boolean isSuccess = "00".equals(responseCode)
                && "00".equals(transactionStatus);

        if (isSuccess) {
            processSuccess(order, transactionCode, params.toString());
        } else {
            processFailed(order, transactionCode, params.toString());
        }

        return "RspCode=00&Message=Confirm Success";
    }


    // ================================================================
    // Return URL — user redirect về sau thanh toán
    // ================================================================
    @Override
    public PaymentResponse handleReturnUrl(Map<String, String> params) {

        // Verify chữ ký
        if (!vnPayService.verifyCallback(params)) {
            return PaymentResponse.failed(
                    params.get("vnp_TxnRef"), "Chữ ký không hợp lệ");
        }

        String txnRef = params.get("vnp_TxnRef");
        Order order = orderRepository.findByOrderCode(txnRef)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found", "ORDER_NOT_FOUND"));

        // Đọc trạng thái hiện tại
        return switch (order.getOrderStatus()) {
            case CONFIRMED -> {
                Payment payment = paymentRepository
                        .findByOrderOrderId(order.getOrderId())
                        .orElse(null);
                yield PaymentResponse.success(
                        order.getOrderCode(),
                        order.getFinalAmount(),
                        payment != null ? payment.getPaidAt() : null);
            }
            case CANCELLED ->
                    PaymentResponse.failed(order.getOrderCode(),
                            "Thanh toán thất bại hoặc bị hủy");
            default ->
                    PaymentResponse.pending(order.getOrderCode());
        };
    }

    // ================================================================
    // Xử lý thanh toán thành công
    // ================================================================
    private void processSuccess(Order order,
                                String transactionCode,
                                String responseData) {
        LocalDateTime now = LocalDateTime.now();

        // Cập nhật Order
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(OrderPaymentStatus.PAID);
        order.setUpdatedAt(now);
        orderRepository.save(order);

        // Tạo bản ghi Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getFinalAmount());
        payment.setPaymentMethod("VNPAY");
        payment.setProvider("VNPAY");
        payment.setPaymentStatus(PaymentStatus.SUCCESS);
        payment.setTransactionCode(transactionCode);
        payment.setResponseData(responseData);
        payment.setPaidAt(now);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        paymentRepository.save(payment);

        // Cập nhật TicketType — đánh dấu SOLD_OUT nếu hết vé
//        for (OrderItem item : order.getOrderItems()) {
//            TicketType tt = item.getTicketType();
//            if (tt.getQuantitySold() >= tt.getQuantityTotal()) {
//                tt.setStatus(TicketTypeStatus.SOLD_OUT);
//                ticketTypeRepository.save(tt);
//            }
//        }
// Cập nhật TicketType — đánh dấu SOLD_OUT nếu hết vé
        for (OrderItem item : order.getOrderItems()) {
            TicketType tt = item.getTicketType();
            if (tt != null && tt.getQuantitySold() >= tt.getQuantityTotal()) {
                tt.setStatus(TicketTypeStatus.SOLD_OUT);
                ticketTypeRepository.save(tt);
            }
        }


        // ✅ Sinh vé + QR code
        generateTickets(order);
    }

    /**
     * Sinh vé tự động với QR code thực sự
     * - Mỗi vé có mã code, QR code Base64 riêng
     * - QR code sinh từ ticket code
     */
    private void generateTickets(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            TicketType ticketType = item.getTicketType();

            // Sinh từng vé theo số lượng đã mua
            for (int i = 0; i < item.getQuantity(); i++) {
                String ticketCode = generateTicketCode();
                String qrCode = generateQRCode(ticketCode);  // ✅ Sinh QR code thực sự

                Ticket ticket = new Ticket();
                ticket.setOrderItem(item);
                ticket.setEvent(order.getEvent());
                ticket.setTicketType(ticketType);
                ticket.setOwnerUser(order.getUser());

                ticket.setTicketCode(ticketCode);
                ticket.setQrCode(qrCode);  // ✅ Lưu QR code Base64
                ticket.setAttendeeName(order.getBuyerName());
                ticket.setAttendeeEmail(order.getBuyerEmail());
                ticket.setStatus(TicketStatus.VALID);
                ticket.setIssuedAt(LocalDateTime.now());

                ticketRepository.save(ticket);
            }
        }
    }

    /**
     * Sinh QR code từ ticket code
     * - Encode thành hình ảnh PNG
     * - Chuyển thành Base64 string để lưu DB
     * - Format: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
     */
    private String generateQRCode(String ticketCode) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                    ticketCode,
                    BarcodeFormat.QR_CODE,
                    300,  // Chiều rộng
                    300   // Chiều cao
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] imageBytes = outputStream.toByteArray();

            // Chuyển thành Base64
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            return "data:image/png;base64," + base64Image;

        } catch (WriterException | IOException e) {
            System.err.println("Lỗi sinh QR code: " + e.getMessage());
            // Fallback: nếu sinh lỗi, return ticket code bình thường
            return ticketCode;
        }
    }

    /**
     * Sinh mã vé duy nhất (không trùng)
     * Format: TKT-ABC123DEF456-1713789600000
     */
    private String generateTicketCode() {
        String code;
        do {
            String uuid = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 12)
                    .toUpperCase();
            String timestamp = String.valueOf(System.currentTimeMillis());
            code = "TKT-" + uuid + "-" + timestamp;
        } while (ticketRepository.existsByTicketCode(code));

        return code;
    }

    // ================================================================
    // Xử lý thanh toán thất bại
    // ================================================================
    private void processFailed(Order order,
                               String transactionCode,
                               String responseData) {
        LocalDateTime now = LocalDateTime.now();

        // Hoàn lại quantity_sold
        for (OrderItem item : order.getOrderItems()) {
            TicketType tt = item.getTicketType();
            tt.setQuantitySold(tt.getQuantitySold() - item.getQuantity());

            if (tt.getStatus() == TicketTypeStatus.SOLD_OUT
                    && tt.getQuantitySold() < tt.getQuantityTotal()) {
                tt.setStatus(TicketTypeStatus.ACTIVE);
            }
            ticketTypeRepository.save(tt);
        }

        // Cập nhật Order
        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(OrderPaymentStatus.FAILED);
        order.setUpdatedAt(now);
        orderRepository.save(order);

        // Tạo bản ghi Payment
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getFinalAmount());
        payment.setPaymentMethod("VNPAY");
        payment.setProvider("VNPAY");
        payment.setPaymentStatus(PaymentStatus.FAILED);
        payment.setTransactionCode(transactionCode);
        payment.setResponseData(responseData);
        payment.setCreatedAt(now);
        payment.setUpdatedAt(now);
        paymentRepository.save(payment);
    }
}
