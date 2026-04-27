package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.OrganizerProfile;

@Repository
public interface OrganizerProfileRepository extends JpaRepository<OrganizerProfile, Long> {
    Optional<OrganizerProfile> findByUser_UserId(Long userId);
}
