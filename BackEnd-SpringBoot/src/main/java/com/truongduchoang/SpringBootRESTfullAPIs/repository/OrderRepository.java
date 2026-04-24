package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.Collection;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    boolean existsByEventEventId(Long eventId);

    List<Order> findByUserUserId(Long userId);

    //boolean updatePaymentInfo(Order order, String method, String paymentProofUrl);
}
