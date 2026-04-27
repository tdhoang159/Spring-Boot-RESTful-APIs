package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;
import java.util.Optional;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.ApprovalStatus;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndEventIdNot(String slug, Long eventId);

    boolean existsByCategoryCategoryId(Long categoryId);

    boolean existsByOrganizerOrganizerId(Long organizerId);

    Page<Event> findAll(Specification<Event> spec, Pageable pageable);

    Optional<Event> findBySlugAndApprovalStatus(String slug, ApprovalStatus approvalStatus);

    List<Event> findByOrganizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);

    List<Event> findByOrganizer_OrganizerIdAndPublishStatusOrderByCreatedAtDesc(Long organizerId, PublishStatus publishStatus);
}
