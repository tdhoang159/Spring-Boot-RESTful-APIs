package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.TicketType;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
	void deleteByEvent_EventId(Long eventId);
}
