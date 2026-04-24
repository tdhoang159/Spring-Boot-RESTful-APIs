package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.EventApproval;

import java.util.List;

@Repository
public interface EventApprovalRepository extends JpaRepository<EventApproval, Long> {
    // Đổi từ findEventIdsByStatus thành:
    //List<Long> findByApprovalStatus(ApprovalStatus approvalStatus);
    //List<EventApproval> findByApprovalStatus(ApprovalStatus status);
    @Query("SELECT ea.event.eventId FROM EventApproval ea WHERE ea.approvalStatus = :status")
    List<Long> findEventIdsByApprovalStatus(@Param("status") ApprovalStatus status);
}
