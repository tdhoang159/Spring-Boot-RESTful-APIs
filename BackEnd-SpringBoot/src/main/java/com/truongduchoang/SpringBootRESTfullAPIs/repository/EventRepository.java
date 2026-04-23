package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.Event;
import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.PublishStatus;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndEventIdNot(String slug, Long eventId);

    boolean existsByCategoryCategoryId(Long categoryId);

    boolean existsByOrganizerOrganizerId(Long organizerId);

    List<Event> findByOrganizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);

    List<Event> findByOrganizer_OrganizerIdAndPublishStatusOrderByCreatedAtDesc(Long organizerId, PublishStatus publishStatus);
}
