package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.OrderPaymentStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderCreateRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.request.OrderItemRequest;
import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.OrderResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.errors.ResourceNotFoundException;
import com.truongduchoang.SpringBootRESTfullAPIs.mapper.OrderMapper;
import com.truongduchoang.SpringBootRESTfullAPIs.models.*;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.*;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderService;
import com.truongduchoang.SpringBootRESTfullAPIs.services.OrderValidator;
import com.truongduchoang.SpringBootRESTfullAPIs.services.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;
    private final VNPayService vnPayService;
    private final OrderMapper orderMapper;
    private final OrderValidator orderValidator;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            EventRepository eventRepository,
            TicketTypeRepository ticketTypeRepository,
            UserRepository userRepository,
            VNPayService vnPayService,
            OrderMapper orderMapper,
            OrderValidator orderValidator) {
        this.orderRepository = orderRepository;
        this.eventRepository = eventRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.userRepository = userRepository;
        this.vnPayService = vnPayService;
        this.orderMapper = orderMapper;
        this.orderValidator = orderValidator;
    }

    // ================================================================
    // Tạo Order + paymentUrl
    // ================================================================
    @Override
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request,
                                     Long userId,
                                     HttpServletRequest httpRequest) {

        // 1. Lấy Event và User
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found", "EVENT_NOT_FOUND"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found", "USER_NOT_FOUND"));

        // 2. Validate + build OrderItems + tính tiền
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Khong thể tạo đơn hàng không có sản phẩm nào");
        }

        for (OrderItemRequest itemReq : request.getItems()) {

            TicketType ticketType = ticketTypeRepository
                    .findById(itemReq.getTicketTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "TicketType not found: " + itemReq.getTicketTypeId(),
                            "TICKET_TYPE_NOT_FOUND"));

            // Toàn bộ validation delegate sang OrderValidator
            orderValidator.validateTicketType(
                    ticketType, itemReq.getQuantity(), event.getEventId());

            BigDecimal subtotal = ticketType.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setTicketType(ticketType);
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setUnitPrice(ticketType.getPrice());
            orderItem.setSubtotal(subtotal);
            orderItems.add(orderItem);

            // Trừ tạm quantity_sold để giữ chỗ khi user đang thanh toán
            ticketType.setQuantitySold(
                    ticketType.getQuantitySold() + itemReq.getQuantity());
            ticketTypeRepository.save(ticketType);
        }

        // 3. Build Order entity
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setEvent(event);
        order.setUser(user);
        order.setBuyerName(request.getBuyerName());
        order.setBuyerEmail(request.getBuyerEmail());
        order.setBuyerPhone(request.getBuyerPhone());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setPaymentStatus(OrderPaymentStatus.UNPAID);
        order.setCreatedAt(LocalDateTime.now());

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 4. Gọi VNPayService - sinh URL thanh toán
        Map<String, String> vnPayResult =
                vnPayService.createPaymentUrl(savedOrder, httpRequest);
        String paymentUrl = vnPayResult.get("paymentUrl");
        orderRepository.save(savedOrder);

        // 5. Map sang DTO
        return orderMapper.toResponse(savedOrder, paymentUrl);
    }

    // ================================================================
    // Lấy order theo orderCode
    // ================================================================
    @Override
    public OrderResponse getOrderByCode(String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderCode, "ORDER_NOT_FOUND"));
        return orderMapper.toResponseWithoutPayment(order);
    }

    // ================================================================
    // Danh sách order của user
    // ================================================================
    @Override
    public List<OrderResponse> getMyOrders(Long userId) {
        return orderRepository.findByUserUserId(userId).stream()
                .map(orderMapper::toResponseWithoutPayment)
                .collect(Collectors.toList());
    }

    // ================================================================
    // Sinh orderCode unique
    // Format: ORD-A1B2C3D4-12345678
    // ================================================================
    private String generateOrderCode() {
        String uuid = UUID.randomUUID()
                .toString().replace("-", "")
                .substring(0, 8).toUpperCase();
        String ts = String.valueOf(System.currentTimeMillis());
        ts = ts.substring(ts.length() - 8);
        return "ORD-" + uuid + "-" + ts;
    }

    // ================================================================
    // Cập nhật payment info (phương thức cũ - nếu cần)
    // ================================================================
    @Override
    @Transactional
    public void updatePaymentInfo(List<Integer> invoiceIds, String method, MultipartFile proofImage) {
        // Phương thức này chỉ để tương thích với interface cũ
        // Logic thực tế được xử lý trong PaymentServiceImpl.handleIpnCallback()

        // Nếu cần implement, bạn có thể thêm logic tại đây
        // Hiện tại để trống để tránh lỗi
        System.out.println("updatePaymentInfo called with method: " + method);
    }

    // ================================================================
    // Xử lý VNPay Callback
    // ================================================================
    @Override
    @Transactional
    public void handleVNPayCallback(Map<String, String> params) {
        String orderCode = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        System.out.println(">>> handleVNPayCallback - orderCode: " + orderCode);
        System.out.println(">>> responseCode: " + responseCode);
        System.out.println(">>> transactionStatus: " + transactionStatus);

        // 1. Tìm Order
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found: " + orderCode, "ORDER_NOT_FOUND"));

        // 2. Kiểm tra trạng thái (tránh xử lý 2 lần)
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            System.out.println(">>> Order đã được xử lý: " + order.getOrderStatus());
            return;
        }

        // 3. Xác định thanh toán thành công hay thất bại
        boolean isSuccess = "00".equals(responseCode)
                && "00".equals(transactionStatus);

        System.out.println(">>> isSuccess: " + isSuccess);

        if (isSuccess) {
            // ✅ Thanh toán thành công - Cập nhật Order
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(OrderPaymentStatus.PAID);
            order.setUpdatedAt(LocalDateTime.now());

            System.out.println(">>> Order marked as CONFIRMED");
        } else {
            // ❌ Thanh toán thất bại - Hủy Order + Hoàn vé
            order.setOrderStatus(OrderStatus.CANCELLED);
            order.setPaymentStatus(OrderPaymentStatus.FAILED);
            order.setUpdatedAt(LocalDateTime.now());

            // Hoàn lại quantity_sold
            for (OrderItem item : order.getOrderItems()) {
                TicketType tt = item.getTicketType();
                if (tt != null) {
                    tt.setQuantitySold(tt.getQuantitySold() - item.getQuantity());
                    ticketTypeRepository.save(tt);
                }
            }

            System.out.println(">>> Order marked as CANCELLED");
        }

        orderRepository.save(order);
    }
}
