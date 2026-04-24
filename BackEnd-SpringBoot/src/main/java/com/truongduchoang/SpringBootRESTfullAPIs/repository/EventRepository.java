package com.truongduchoang.SpringBootRESTfullAPIs.repository;


import java.util.Optional;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndEventIdNot(String slug, Long eventId);

    boolean existsByCategoryCategoryId(Long categoryId);

    boolean existsByOrganizerOrganizerId(Long organizerId);

    //List<Long> findEventIdsByStatus(ApprovalStatus approvalStatus);

    Page<Event> findAll(Specification<Event> spec, Pageable pageable);

    Optional<Event> findBySlugAndApprovalStatus(String slug, ApprovalStatus approvalStatus);


}
