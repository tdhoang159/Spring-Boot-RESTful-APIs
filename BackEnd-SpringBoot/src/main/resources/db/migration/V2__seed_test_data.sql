-- Seed reference data and base sample data for the event management schema.
-- This script is idempotent and only inserts rows that do not exist yet.
-- Default test password for all seeded users: 123456
-- Note: roles only seed 3 rows because RoleName currently supports ADMIN, ORGANIZER, ATTENDEE.
-- Chay mysql command line client -> use database_name -> source src/main/resources/db/migration/V2__seed_test_data.sql;

SET @seed_password_hash = '$2a$10$VIiVqq59Iu1d9T9BvyeBx.CQKJRt8brI9eksosjtIZR1XOoSV1Z22';

SET @roles_table_exists = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'roles'
);
SET @roles_sql = IF(
    @roles_table_exists = 1,
    "INSERT INTO roles (role_id, role_name, description, created_at)
     VALUES
        (1, 'ADMIN', 'System administrator', NOW()),
        (2, 'ORGANIZER', 'Event organizer', NOW()),
        (3, 'ATTENDEE', 'Event attendee', NOW())
     ON DUPLICATE KEY UPDATE
        description = VALUES(description)",
    "SELECT 1"
);
PREPARE stmt FROM @roles_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @users_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('users', 'roles')
);
SET @users_sql = IF(
    @users_tables_exist = 2,
    CONCAT(
        "INSERT INTO users (role_id, full_name, email, phone, password_hash, avatar_url, status, email_verified_at, last_login_at, created_at, updated_at) ",
        "SELECT r.role_id, seeded_users.full_name, seeded_users.email, seeded_users.phone, '", @seed_password_hash, "', seeded_users.avatar_url, seeded_users.status, seeded_users.email_verified_at, seeded_users.last_login_at, NOW(), NOW() ",
        "FROM (",
        " SELECT 'ADMIN' AS role_name, 'Admin Test' AS full_name, 'admin.test@event.local' AS email, '0900000001' AS phone, NULL AS avatar_url, 'ACTIVE' AS status, NOW() AS email_verified_at, DATE_SUB(NOW(), INTERVAL 1 DAY) AS last_login_at",
        " UNION ALL SELECT 'ORGANIZER', 'Organizer Test', 'organizer.test@event.local', '0900000002', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)",
        " UNION ALL SELECT 'ORGANIZER', 'Organizer Alpha', 'organizer.alpha@event.local', '0900000003', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)",
        " UNION ALL SELECT 'ORGANIZER', 'Organizer Beta', 'organizer.beta@event.local', '0900000004', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 4 DAY)",
        " UNION ALL SELECT 'ORGANIZER', 'Organizer Gamma', 'organizer.gamma@event.local', '0900000005', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 5 DAY)",
        " UNION ALL SELECT 'ORGANIZER', 'Organizer Delta', 'organizer.delta@event.local', '0900000006', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 6 DAY)",
        " UNION ALL SELECT 'ATTENDEE', 'Attendee Test', 'attendee.test@event.local', '0900000007', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 1 DAY)",
        " UNION ALL SELECT 'ATTENDEE', 'Attendee Alpha', 'attendee.alpha@event.local', '0900000008', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 2 DAY)",
        " UNION ALL SELECT 'ATTENDEE', 'Attendee Beta', 'attendee.beta@event.local', '0900000009', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY)",
        " UNION ALL SELECT 'ATTENDEE', 'Attendee Gamma', 'attendee.gamma@event.local', '0900000010', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 4 DAY)",
        " UNION ALL SELECT 'ATTENDEE', 'Attendee Delta', 'attendee.delta@event.local', '0900000011', NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL 5 DAY)",
        ") seeded_users ",
        "JOIN roles r ON r.role_name = seeded_users.role_name ",
        "LEFT JOIN users existing_users ON existing_users.email = seeded_users.email ",
        "WHERE existing_users.user_id IS NULL"
    ),
    "SELECT 1"
);
PREPARE stmt FROM @users_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @organizer_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('organizer_profiles', 'users')
);
SET @organizer_sql = IF(
    @organizer_tables_exist = 2,
    "INSERT INTO organizer_profiles (
        user_id,
        organization_name,
        tax_code,
        website,
        description,
        address,
        bank_account_name,
        bank_account_number,
        bank_name,
        is_verified,
        created_at,
        updated_at
     )
     SELECT
        u.user_id,
        seeded_profiles.organization_name,
        seeded_profiles.tax_code,
        seeded_profiles.website,
        seeded_profiles.description,
        seeded_profiles.address,
        seeded_profiles.bank_account_name,
        seeded_profiles.bank_account_number,
        seeded_profiles.bank_name,
        seeded_profiles.is_verified,
        NOW(),
        NOW()
     FROM (
        SELECT 'organizer.test@event.local' AS email, 'Test Organizer Co.' AS organization_name, 'TAX-ORG-001' AS tax_code, 'https://test-organizer.local' AS website, 'Organizer profile for smoke testing.' AS description, 'Ho Chi Minh City, Vietnam' AS address, 'Organizer Test' AS bank_account_name, '970400000001' AS bank_account_number, 'Vietcombank' AS bank_name, TRUE AS is_verified
        UNION ALL SELECT 'organizer.alpha@event.local', 'Alpha Events Studio', 'TAX-ORG-002', 'https://alpha-events.local', 'Specialized in tech and workshop events.', 'Ha Noi, Vietnam', 'Organizer Alpha', '970400000002', 'ACB', TRUE
        UNION ALL SELECT 'organizer.beta@event.local', 'Beta Creative House', 'TAX-ORG-003', 'https://beta-creative.local', 'Creative partner for online experiences.', 'Da Nang, Vietnam', 'Organizer Beta', '970400000003', 'Techcombank', TRUE
        UNION ALL SELECT 'organizer.gamma@event.local', 'Gamma Community Hub', 'TAX-ORG-004', 'https://gamma-community.local', 'Community and networking event organizer.', 'Can Tho, Vietnam', 'Organizer Gamma', '970400000004', 'MB Bank', FALSE
        UNION ALL SELECT 'organizer.delta@event.local', 'Delta Sports Agency', 'TAX-ORG-005', 'https://delta-sports.local', 'Sports race and outdoor experience operator.', 'Nha Trang, Vietnam', 'Organizer Delta', '970400000005', 'BIDV', TRUE
     ) seeded_profiles
     JOIN users u ON u.email = seeded_profiles.email
     LEFT JOIN organizer_profiles existing_profiles ON existing_profiles.user_id = u.user_id
     WHERE existing_profiles.organizer_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @organizer_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @categories_table_exists = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'categories'
);
SET @category_sql = IF(
    @categories_table_exists = 1,
    "INSERT INTO categories (category_name, description, status, created_at)
     SELECT seeded_categories.category_name, seeded_categories.description, seeded_categories.status, NOW()
     FROM (
        SELECT 'Conference' AS category_name, 'Professional conference and summit events.' AS description, 'ACTIVE' AS status
        UNION ALL SELECT 'Workshop', 'Hands-on classes and guided training sessions.', 'ACTIVE'
        UNION ALL SELECT 'Music', 'Concerts and live performance events.', 'ACTIVE'
        UNION ALL SELECT 'Networking', 'Community meetups and networking nights.', 'ACTIVE'
        UNION ALL SELECT 'Sports', 'Races, competitions, and outdoor sports events.', 'ACTIVE'
     ) seeded_categories
     LEFT JOIN categories existing_categories ON existing_categories.category_name = seeded_categories.category_name
     WHERE existing_categories.category_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @category_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @events_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('events', 'organizer_profiles', 'categories', 'users')
);
SET @event_sql = IF(
    @events_tables_exist = 4,
    "INSERT INTO events (
        organizer_id,
        category_id,
        title,
        slug,
        short_description,
        description,
        banner_url,
        venue_name,
        venue_address,
        city,
        location_type,
        meeting_url,
        start_time,
        end_time,
        registration_deadline,
        publish_status,
        approval_status,
        created_at,
        updated_at
     )
     SELECT
        op.organizer_id,
        c.category_id,
        seeded_events.title,
        seeded_events.slug,
        seeded_events.short_description,
        seeded_events.description,
        seeded_events.banner_url,
        seeded_events.venue_name,
        seeded_events.venue_address,
        seeded_events.city,
        seeded_events.location_type,
        seeded_events.meeting_url,
        DATE_ADD(NOW(), INTERVAL seeded_events.start_in_days DAY),
        DATE_ADD(DATE_ADD(NOW(), INTERVAL seeded_events.start_in_days DAY), INTERVAL seeded_events.duration_hours HOUR),
        DATE_ADD(NOW(), INTERVAL seeded_events.registration_offset_days DAY),
        seeded_events.publish_status,
        seeded_events.approval_status,
        NOW(),
        NOW()
     FROM (
        SELECT 'organizer.test@event.local' AS organizer_email, 'Conference' AS category_name, 'Migration Test Event' AS title, 'migration-test-event' AS slug, 'Sample event used for API and UI testing.' AS short_description, 'This event is seeded automatically to validate attendee browsing, detail, order, and ticket flows.' AS description, 'https://images.example.com/events/migration-test-event.jpg' AS banner_url, 'Seed Hall' AS venue_name, '123 Test Street' AS venue_address, 'Ho Chi Minh City' AS city, 'OFFLINE' AS location_type, NULL AS meeting_url, 7 AS start_in_days, 3 AS duration_hours, 6 AS registration_offset_days, 'PUBLISHED' AS publish_status, 'APPROVED' AS approval_status
        UNION ALL SELECT 'organizer.alpha@event.local', 'Workshop', 'React Builder Bootcamp', 'react-builder-bootcamp', 'Intensive workshop for React engineers.', 'A practical workshop covering reusable component design, routing, and testing strategies.', 'https://images.example.com/events/react-builder-bootcamp.jpg', 'Alpha Lab', '45 Innovation Avenue', 'Ha Noi', 'OFFLINE', NULL, 10, 6, 8, 'PUBLISHED', 'APPROVED'
        UNION ALL SELECT 'organizer.beta@event.local', 'Music', 'Acoustic Sunset Live', 'acoustic-sunset-live', 'An intimate acoustic music night.', 'A live acoustic performance designed for community engagement and ticketing flow validation.', 'https://images.example.com/events/acoustic-sunset-live.jpg', 'Riverside Stage', '88 River Road', 'Da Nang', 'OFFLINE', NULL, 12, 4, 11, 'PUBLISHED', 'APPROVED'
        UNION ALL SELECT 'organizer.gamma@event.local', 'Networking', 'Startup Networking Night', 'startup-networking-night', 'Curated meetup for startup builders and investors.', 'An evening meetup focused on founders, operators, and investors with structured networking sessions.', 'https://images.example.com/events/startup-networking-night.jpg', 'Gamma Hub', '12 Community Square', 'Can Tho', 'OFFLINE', NULL, 15, 3, 13, 'PUBLISHED', 'APPROVED'
        UNION ALL SELECT 'organizer.delta@event.local', 'Sports', 'City Marathon 2026', 'city-marathon-2026', 'Community marathon with multiple race formats.', 'An outdoor sports event with limited registration and race-day checkin use cases.', 'https://images.example.com/events/city-marathon-2026.jpg', 'Delta Sports Complex', '5 Coastal Drive', 'Nha Trang', 'OFFLINE', NULL, 20, 5, 18, 'PUBLISHED', 'APPROVED'
     ) seeded_events
     JOIN users u ON u.email = seeded_events.organizer_email
     JOIN organizer_profiles op ON op.user_id = u.user_id
     JOIN categories c ON c.category_name = seeded_events.category_name
     LEFT JOIN events existing_events ON existing_events.slug = seeded_events.slug
     WHERE existing_events.event_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @event_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @ticket_types_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('ticket_types', 'events')
);
SET @ticket_type_sql = IF(
    @ticket_types_tables_exist = 2,
    "INSERT INTO ticket_types (
        event_id,
        ticket_name,
        description,
        price,
        quantity_total,
        quantity_sold,
        max_per_order,
        sale_start_time,
        sale_end_time,
        status,
        created_at,
        updated_at
     )
     SELECT
        e.event_id,
        seeded_ticket_types.ticket_name,
        seeded_ticket_types.description,
        seeded_ticket_types.price,
        seeded_ticket_types.quantity_total,
        seeded_ticket_types.quantity_sold,
        seeded_ticket_types.max_per_order,
        DATE_SUB(e.start_time, INTERVAL seeded_ticket_types.sale_open_days_before_event DAY),
        DATE_SUB(e.start_time, INTERVAL seeded_ticket_types.sale_close_days_before_event DAY),
        seeded_ticket_types.status,
        NOW(),
        NOW()
     FROM (
        SELECT 'migration-test-event' AS event_slug, 'Migration Standard' AS ticket_name, 'Default ticket for migration smoke tests.' AS description, 199000.00 AS price, 100 AS quantity_total, 0 AS quantity_sold, 5 AS max_per_order, 14 AS sale_open_days_before_event, 1 AS sale_close_days_before_event, 'ON_SALE' AS status
        UNION ALL SELECT 'react-builder-bootcamp', 'Bootcamp Pass', 'Workshop admission with materials included.', 349000.00, 80, 0, 2, 20, 1, 'ON_SALE'
        UNION ALL SELECT 'acoustic-sunset-live', 'Sunset Live Ticket', 'Standing area access for the acoustic concert.', 259000.00, 120, 0, 4, 10, 1, 'ON_SALE'
        UNION ALL SELECT 'startup-networking-night', 'Networking Entry', 'Standard entry to the networking event.', 149000.00, 150, 0, 3, 14, 1, 'ON_SALE'
        UNION ALL SELECT 'city-marathon-2026', 'Marathon Bib', 'Runner bib and starter kit for the marathon.', 499000.00, 300, 0, 1, 30, 2, 'ON_SALE'
     ) seeded_ticket_types
     JOIN events e ON e.slug = seeded_ticket_types.event_slug
     LEFT JOIN ticket_types existing_ticket_types ON existing_ticket_types.event_id = e.event_id AND existing_ticket_types.ticket_name = seeded_ticket_types.ticket_name
     WHERE existing_ticket_types.ticket_type_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_type_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @event_approvals_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('event_approvals', 'events', 'users')
);
SET @event_approval_sql = IF(
    @event_approvals_tables_exist = 3,
    "INSERT INTO event_approvals (
        event_id,
        reviewed_by,
        approval_status,
        review_note,
        reviewed_at
     )
     SELECT
        e.event_id,
        reviewer.user_id,
        seeded_approvals.approval_status,
        seeded_approvals.review_note,
        DATE_SUB(e.start_time, INTERVAL seeded_approvals.review_days_before_event DAY)
     FROM (
        SELECT 'migration-test-event' AS event_slug, 'admin.test@event.local' AS reviewer_email, 'APPROVED' AS approval_status, 'Seeded and approved for public listing tests.' AS review_note, 6 AS review_days_before_event
        UNION ALL SELECT 'react-builder-bootcamp', 'admin.test@event.local', 'APPROVED', 'Workshop event approved for attendee browsing.', 8
        UNION ALL SELECT 'acoustic-sunset-live', 'admin.test@event.local', 'APPROVED', 'Music event approved for content showcase.', 9
        UNION ALL SELECT 'startup-networking-night', 'admin.test@event.local', 'APPROVED', 'Networking event approved with organizer verification.', 10
        UNION ALL SELECT 'city-marathon-2026', 'admin.test@event.local', 'APPROVED', 'Sports event approved for checkin and ticket tests.', 12
     ) seeded_approvals
     JOIN events e ON e.slug = seeded_approvals.event_slug
     JOIN users reviewer ON reviewer.email = seeded_approvals.reviewer_email
     LEFT JOIN event_approvals existing_approvals ON existing_approvals.event_id = e.event_id AND existing_approvals.reviewed_by = reviewer.user_id AND existing_approvals.approval_status = seeded_approvals.approval_status
     WHERE existing_approvals.approval_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @event_approval_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @commission_configs_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('commission_configs', 'users')
);
SET @commission_config_sql = IF(
    @commission_configs_tables_exist = 2,
    "INSERT INTO commission_configs (
        commission_name,
        commission_type,
        commission_value,
        status,
        apply_from,
        apply_to,
        created_by,
        created_at
     )
     SELECT
        seeded_commissions.commission_name,
        seeded_commissions.commission_type,
        seeded_commissions.commission_value,
        seeded_commissions.status,
        DATE_ADD(NOW(), INTERVAL seeded_commissions.apply_from_days DAY),
        CASE
            WHEN seeded_commissions.apply_to_days IS NULL THEN NULL
            ELSE DATE_ADD(NOW(), INTERVAL seeded_commissions.apply_to_days DAY)
        END,
        creator.user_id,
        NOW()
     FROM (
        SELECT 'Standard Platform Fee' AS commission_name, 'PERCENT' AS commission_type, 5.00 AS commission_value, 'ACTIVE' AS status, -30 AS apply_from_days, NULL AS apply_to_days, 'admin.test@event.local' AS creator_email
        UNION ALL SELECT 'Workshop Boost Fee', 'PERCENT', 7.50, 'ACTIVE', -20, 90, 'admin.test@event.local'
        UNION ALL SELECT 'Music Campaign Flat Fee', 'FIXED', 15000.00, 'ACTIVE', -15, 60, 'admin.test@event.local'
        UNION ALL SELECT 'Networking Partner Fee', 'FIXED', 10000.00, 'ACTIVE', -10, 45, 'admin.test@event.local'
        UNION ALL SELECT 'Legacy Inactive Fee', 'PERCENT', 3.00, 'INACTIVE', -180, -30, 'admin.test@event.local'
     ) seeded_commissions
     JOIN users creator ON creator.email = seeded_commissions.creator_email
     LEFT JOIN commission_configs existing_commissions ON existing_commissions.commission_name = seeded_commissions.commission_name
     WHERE existing_commissions.commission_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @commission_config_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @email_campaigns_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('email_campaigns', 'events', 'users')
);
SET @email_campaign_sql = IF(
    @email_campaigns_tables_exist = 3,
    "INSERT INTO email_campaigns (
        event_id,
        created_by,
        subject,
        content,
        send_status,
        scheduled_at,
        sent_at,
        created_at
     )
     SELECT
        e.event_id,
        creator.user_id,
        seeded_campaigns.subject,
        seeded_campaigns.content,
        seeded_campaigns.send_status,
        CASE
            WHEN seeded_campaigns.scheduled_in_hours IS NULL THEN NULL
            ELSE DATE_ADD(NOW(), INTERVAL seeded_campaigns.scheduled_in_hours HOUR)
        END,
        CASE
            WHEN seeded_campaigns.sent_hours_ago IS NULL THEN NULL
            ELSE DATE_SUB(NOW(), INTERVAL seeded_campaigns.sent_hours_ago HOUR)
        END,
        NOW()
     FROM (
        SELECT 'migration-test-event' AS event_slug, 'organizer.test@event.local' AS creator_email, 'Migration test event reminder' AS subject, 'Reminder email content for migration test attendees.' AS content, 'SENT' AS send_status, NULL AS scheduled_in_hours, 48 AS sent_hours_ago
        UNION ALL SELECT 'react-builder-bootcamp', 'organizer.alpha@event.local', 'Bootcamp materials preview', 'Workshop participants receive prep materials and schedule details.', 'SCHEDULED', 12, NULL
        UNION ALL SELECT 'acoustic-sunset-live', 'organizer.beta@event.local', 'Concert lineup reveal', 'Announcing the acoustic lineup and venue opening time.', 'DRAFT', NULL, NULL
        UNION ALL SELECT 'startup-networking-night', 'organizer.gamma@event.local', 'Networking agenda and speaker intro', 'Sharing the session agenda and checkin window.', 'SENT', NULL, 24
        UNION ALL SELECT 'city-marathon-2026', 'organizer.delta@event.local', 'Race kit pickup notice', 'Instructions for kit pickup and race day checkin.', 'FAILED', 6, NULL
     ) seeded_campaigns
     JOIN events e ON e.slug = seeded_campaigns.event_slug
     JOIN users creator ON creator.email = seeded_campaigns.creator_email
     LEFT JOIN email_campaigns existing_campaigns ON existing_campaigns.event_id = e.event_id AND existing_campaigns.subject = seeded_campaigns.subject
     WHERE existing_campaigns.campaign_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @email_campaign_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @notifications_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('notifications', 'users')
);
SET @notification_sql = IF(
    @notifications_tables_exist = 2,
    "INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at,
        read_at
     )
     SELECT
        u.user_id,
        seeded_notifications.title,
        seeded_notifications.message,
        seeded_notifications.type,
        seeded_notifications.is_read,
        DATE_SUB(NOW(), INTERVAL seeded_notifications.created_hours_ago HOUR),
        CASE
            WHEN seeded_notifications.read_hours_ago IS NULL THEN NULL
            ELSE DATE_SUB(NOW(), INTERVAL seeded_notifications.read_hours_ago HOUR)
        END
     FROM (
        SELECT 'admin.test@event.local' AS email, 'Seed data loaded' AS title, 'Reference and transactional sample data have been inserted successfully.' AS message, 'SYSTEM' AS type, TRUE AS is_read, 72 AS created_hours_ago, 70 AS read_hours_ago
        UNION ALL SELECT 'organizer.test@event.local', 'Event approved', 'Migration Test Event is approved and visible to attendees.', 'EVENT', FALSE, 48, NULL
        UNION ALL SELECT 'organizer.alpha@event.local', 'Campaign scheduled', 'Bootcamp materials preview campaign has been scheduled.', 'SYSTEM', FALSE, 24, NULL
        UNION ALL SELECT 'attendee.test@event.local', 'Order ready for review', 'Your seeded order can now be used to test ticket and order screens.', 'ORDER', FALSE, 12, NULL
        UNION ALL SELECT 'attendee.alpha@event.local', 'Payment received', 'A sample successful payment was created for your account.', 'PAYMENT', TRUE, 8, 6
     ) seeded_notifications
     JOIN users u ON u.email = seeded_notifications.email
     LEFT JOIN notifications existing_notifications ON existing_notifications.user_id = u.user_id AND existing_notifications.title = seeded_notifications.title
     WHERE existing_notifications.notification_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @notification_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
