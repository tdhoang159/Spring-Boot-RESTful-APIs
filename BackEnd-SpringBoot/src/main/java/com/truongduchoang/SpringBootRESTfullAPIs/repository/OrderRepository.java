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

    Optional<Order> findByOrderCodeAndUserUserId(String orderCode, Long userId);

    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);

    boolean existsByOrderCode(String orderCode);

    boolean existsByEventEventId(Long eventId);

    List<Order> findByUserUserId(Long userId);


}
