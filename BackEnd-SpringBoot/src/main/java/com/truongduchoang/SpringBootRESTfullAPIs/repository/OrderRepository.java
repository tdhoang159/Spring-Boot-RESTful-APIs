package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;
import java.util.Optional;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);

    Optional<Order> findByOrderCodeAndUserUserId(String orderCode, Long userId);

    Optional<Order> findByOrderIdAndUserUserId(Long orderId, Long userId);

    boolean existsByOrderCode(String orderCode);

    boolean existsByEventEventId(Long eventId);

    List<Order> findByUserUserId(Long userId);

    @Query("""
            select distinct o
            from Order o
            left join fetch o.event
            left join fetch o.orderItems oi
            left join fetch oi.ticketType
            where o.user.userId = :userId
            order by o.createdAt desc
            """)
    List<Order> findMyOrdersWithItems(@Param("userId") Long userId);

    @Query("""
            select distinct o
            from Order o
            left join fetch o.event
            left join fetch o.orderItems oi
            left join fetch oi.ticketType
            where o.orderCode = :orderCode
              and o.user.userId = :userId
            """)
    Optional<Order> findMyOrderByCodeWithItems(
            @Param("orderCode") String orderCode,
            @Param("userId") Long userId);

    List<Order> findByEvent_EventIdOrderByCreatedAtDesc(Long eventId);

    List<Order> findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);
}
