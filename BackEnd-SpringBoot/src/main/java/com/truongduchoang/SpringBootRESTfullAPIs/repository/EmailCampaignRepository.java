package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.EmailCampaign;

@Repository
public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, Long> {
	List<EmailCampaign> findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);

	List<EmailCampaign> findByEvent_EventIdOrderByCreatedAtDesc(Long eventId);
}
