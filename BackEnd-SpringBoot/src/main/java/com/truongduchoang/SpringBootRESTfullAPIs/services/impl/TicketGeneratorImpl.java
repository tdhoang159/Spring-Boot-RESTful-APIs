package com.truongduchoang.SpringBootRESTfullAPIs.services.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import com.truongduchoang.SpringBootRESTfullAPIs.models.OrderItem;
import com.truongduchoang.SpringBootRESTfullAPIs.models.Ticket;
import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.TicketStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.repository.TicketRepository;
import com.truongduchoang.SpringBootRESTfullAPIs.services.TicketGenerator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class TicketGeneratorImpl implements TicketGenerator {

    private final TicketRepository ticketRepository;

    public TicketGeneratorImpl(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Override
    public void generateTickets(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            TicketType ticketType = item.getTicketType();

            for (int i = 0; i < item.getQuantity(); i++) {
                String ticketCode = generateTicketCode();
                String qrCode = generateQrCode(ticketCode);

                Ticket ticket = new Ticket();
                ticket.setOrderItem(item);
                ticket.setEvent(order.getEvent());
                ticket.setTicketType(ticketType);
                ticket.setOwnerUser(order.getUser());
                ticket.setTicketCode(ticketCode);
                ticket.setQrCode(qrCode);
                ticket.setAttendeeName(order.getBuyerName());
                ticket.setAttendeeEmail(order.getBuyerEmail());
                ticket.setStatus(TicketStatus.VALID);
                ticket.setIssuedAt(LocalDateTime.now());

                ticketRepository.save(ticket);
            }
        }
    }

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

    private String generateQrCode(String ticketCode) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                    ticketCode,
                    BarcodeFormat.QR_CODE,
                    300,
                    300
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] imageBytes = outputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
        } catch (WriterException | IOException e) {
            return ticketCode;
        }
    }
}
