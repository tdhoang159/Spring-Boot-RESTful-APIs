package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketCode(String ticketCode);

    Optional<Ticket> findByTicketCodeAndOwnerUserUserId(String ticketCode, Long userId);

    List<Ticket> findByOwnerUserUserIdOrderByIssuedAtDesc(Long userId);

    @Query("""
            select distinct t
            from Ticket t
            join fetch t.event
            join fetch t.ticketType
            join fetch t.orderItem oi
            join fetch oi.order
            where t.ownerUser.userId = :userId
            order by t.issuedAt desc
            """)
    List<Ticket> findMyTicketsDetailed(@Param("userId") Long userId);

    @Query("""
            select t
            from Ticket t
            join fetch t.event
            join fetch t.ticketType
            join fetch t.orderItem oi
            join fetch oi.order
            where t.ticketCode = :ticketCode
              and t.ownerUser.userId = :userId
            """)
    Optional<Ticket> findMyTicketByCodeDetailed(
            @Param("ticketCode") String ticketCode,
            @Param("userId") Long userId);

    boolean existsByTicketCode(String ticketCode);

    boolean existsByEventEventId(Long eventId);

    boolean existsByTicketType_TicketTypeId(Long ticketTypeId);
}
