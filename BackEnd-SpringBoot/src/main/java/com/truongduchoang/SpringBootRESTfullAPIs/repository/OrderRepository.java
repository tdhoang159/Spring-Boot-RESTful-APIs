package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;
import java.util.Optional;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);

    Optional<Order> findByOrderCodeAndUserUserId(String orderCode, Long userId);

    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);

    boolean existsByOrderCode(String orderCode);

    boolean existsByEventEventId(Long eventId);

    List<Order> findByUserUserId(Long userId);

    List<Order> findByEvent_EventIdOrderByCreatedAtDesc(Long eventId);

    List<Order> findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);
}
