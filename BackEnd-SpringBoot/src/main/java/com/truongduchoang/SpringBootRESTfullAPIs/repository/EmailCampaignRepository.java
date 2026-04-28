package com.truongduchoang.SpringBootRESTfullAPIs.repository;

import java.util.List;

import com.truongduchoang.SpringBootRESTfullAPIs.models.enums.EmailSendStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.truongduchoang.SpringBootRESTfullAPIs.models.EmailCampaign;

@Repository
public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, Long> {
	List<EmailCampaign> findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId);

	List<EmailCampaign> findByEvent_EventIdOrderByCreatedAtDesc(Long eventId);

	Page<EmailCampaign> findByEvent_Organizer_OrganizerIdOrderByCreatedAtDesc(Long organizerId, Pageable pageable);

	Page<EmailCampaign> findByEvent_EventIdOrderByCreatedAtDesc(Long eventId, Pageable pageable);

	Page<EmailCampaign> findByEvent_Organizer_OrganizerIdAndSendStatusOrderByCreatedAtDesc(
			Long organizerId,
			EmailSendStatus sendStatus,
			Pageable pageable);

	Page<EmailCampaign> findByEvent_EventIdAndSendStatusOrderByCreatedAtDesc(
			Long eventId,
			EmailSendStatus sendStatus,
			Pageable pageable);
}
