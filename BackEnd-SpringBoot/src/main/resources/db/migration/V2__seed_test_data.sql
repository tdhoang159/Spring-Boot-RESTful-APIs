-- Seed test data for environments that already have the schema available.
-- This script is written to be idempotent and safe to execute in databases where
-- the schema may not exist yet. If required tables are missing, each block becomes a no-op.
-- Default test password for all seeded users: 123456
-- Chạy mysql command line client -> use database_name -> source src/main/resources/db/migration/V2__seed_test_data.sql;

SET @seed_password_hash = '$2a$10$VIiVqq59Iu1d9T9BvyeBx.CQKJRt8brI9eksosjtIZR1XOoSV1Z22';

SET @roles_table_exists = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name = 'roles'
);
SET @admin_role_sql = IF(
    @roles_table_exists > 0,
    "INSERT INTO roles (role_id, role_name, description, created_at)
     SELECT next_role_id, 'ADMIN', 'System administrator', NOW()
     FROM (SELECT COALESCE(MAX(role_id), 0) + 1 AS next_role_id FROM roles) next_role
     WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'ADMIN')",
    "SELECT 1"
);
PREPARE stmt FROM @admin_role_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @organizer_role_sql = IF(
    @roles_table_exists > 0,
    "INSERT INTO roles (role_id, role_name, description, created_at)
     SELECT next_role_id, 'ORGANIZER', 'Event organizer', NOW()
     FROM (SELECT COALESCE(MAX(role_id), 0) + 1 AS next_role_id FROM roles) next_role
     WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'ORGANIZER')",
    "SELECT 1"
);
PREPARE stmt FROM @organizer_role_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @attendee_role_sql = IF(
    @roles_table_exists > 0,
    "INSERT INTO roles (role_id, role_name, description, created_at)
     SELECT next_role_id, 'ATTENDEE', 'Event attendee', NOW()
     FROM (SELECT COALESCE(MAX(role_id), 0) + 1 AS next_role_id FROM roles) next_role
     WHERE NOT EXISTS (SELECT 1 FROM roles WHERE role_name = 'ATTENDEE')",
    "SELECT 1"
);
PREPARE stmt FROM @attendee_role_sql;
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
        "INSERT INTO users (role_id, full_name, email, phone, password_hash, status, email_verified_at, created_at, updated_at) ",
        "SELECT r.role_id, seeded_users.full_name, seeded_users.email, seeded_users.phone, '", @seed_password_hash, "', 'ACTIVE', NOW(), NOW(), NOW() ",
        "FROM (",
        "    SELECT 'ADMIN' AS role_name, 'Admin Test' AS full_name, 'admin.test@event.local' AS email, '0900000001' AS phone ",
        "    UNION ALL ",
        "    SELECT 'ORGANIZER' AS role_name, 'Organizer Test' AS full_name, 'organizer.test@event.local' AS email, '0900000002' AS phone ",
        "    UNION ALL ",
        "    SELECT 'ATTENDEE' AS role_name, 'Attendee Test' AS full_name, 'attendee.test@event.local' AS email, '0900000003' AS phone ",
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
    "INSERT INTO organizer_profiles (user_id, organization_name, description, address, is_verified, created_at, updated_at)
     SELECT u.user_id, 'Test Organizer Co.', 'Organizer profile for migration testing.', 'Ho Chi Minh City, Vietnam', 'PUBLISHED', NOW(), NOW()
     FROM users u
     WHERE u.email = 'organizer.test@event.local'
       AND NOT EXISTS (
           SELECT 1 FROM organizer_profiles op WHERE op.user_id = u.user_id
       )",
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
     SELECT 'Conference', 'Default category for migration test event.', 'ACTIVE', NOW()
     FROM dual
     WHERE NOT EXISTS (SELECT 1 FROM categories WHERE category_name = 'Conference')",
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
        venue_name,
        venue_address,
        city,
        location_type,
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
        'Migration Test Event',
        'migration-test-event',
        'Sample event seeded automatically from Flyway migration.',
        'This event is created as SQL seed data to support quick API testing after database migration.',
        'Seed Hall',
        '123 Test Street',
        'Ho Chi Minh City',
        'OFFLINE',
        DATE_ADD(NOW(), INTERVAL 7 DAY),
        DATE_ADD(DATE_ADD(NOW(), INTERVAL 7 DAY), INTERVAL 3 HOUR),
        DATE_ADD(NOW(), INTERVAL 6 DAY),
        'PUBLISHED',
        'APPROVED',
        NOW(),
        NOW()
     FROM organizer_profiles op
     JOIN users u ON u.user_id = op.user_id
     JOIN categories c ON c.category_name = 'Conference'
     WHERE u.email = 'organizer.test@event.local'
       AND NOT EXISTS (SELECT 1 FROM events WHERE slug = 'migration-test-event')",
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
        'Standard Ticket',
        'Default seeded ticket type for migration testing.',
        199000.00,
        100,
        0,
        5,
        NOW(),
        DATE_ADD(NOW(), INTERVAL 6 DAY),
        'ACTIVE',
        NOW(),
        NOW()
     FROM events e
     WHERE e.slug = 'migration-test-event'
       AND NOT EXISTS (
           SELECT 1
           FROM ticket_types tt
           WHERE tt.event_id = e.event_id
             AND tt.ticket_name = 'Standard Ticket'
       )",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_type_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
