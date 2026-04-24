package com.truongduchoang.SpringBootRESTfullAPIs.mapper;

import com.truongduchoang.SpringBootRESTfullAPIs.dto.response.TicketTypeResponse;
import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;
import org.springframework.stereotype.Component;

@Component
public class TicketTypeMapper {
    public TicketTypeResponse toTicketTypeResponse(TicketType tt) {
        TicketTypeResponse dto = new TicketTypeResponse();
        dto.setTicketTypeId(tt.getTicketTypeId());
        dto.setTicketName(tt.getTicketName());
        dto.setDescription(tt.getDescription());
        dto.setPrice(tt.getPrice());
//        dto.setQuantityTotal(tt.getQuantityTotal());
//        dto.setQuantitySold(tt.getQuantitySold());
        dto.setQuantityAvailable(
                tt.getQuantityTotal() != null && tt.getQuantitySold() != null
                        ? tt.getQuantityTotal() - tt.getQuantitySold()
                        : null
        );
        dto.setMaxPerOrder(tt.getMaxPerOrder());
        dto.setSaleStartTime(tt.getSaleStartTime());
        dto.setSaleEndTime(tt.getSaleEndTime());
        dto.setStatus(tt.getStatus() != null ? tt.getStatus().name() : null);
        return dto;
    }
}
