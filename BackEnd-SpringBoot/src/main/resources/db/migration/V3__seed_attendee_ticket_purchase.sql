-- Seed a complete attendee ticket purchase flow for the existing migration test event.
-- This migration is idempotent and only inserts data when the required tables and
-- parent seed records already exist.
-- Chạy mysql command line client -> use database_name -> source src/main/resources/db/migration/V3__seed_attendee_ticket_purchase.sql;

SET @orders_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('orders', 'users', 'events')
);
SET @order_sql = IF(
    @orders_tables_exist = 3,
    "INSERT INTO orders (
        user_id,
        event_id,
        order_code,
        total_amount,
        discount_amount,
        final_amount,
        order_status,
        payment_status,
        buyer_name,
        buyer_email,
        buyer_phone,
        created_at,
        updated_at
     )
     SELECT
        attendee.user_id,
        event_seed.event_id,
        'ORD-SEED-ATTENDEE-001',
        398000.00,
        0.00,
        398000.00,
        'CONFIRMED',
        'SUCCESS',
        attendee.full_name,
        attendee.email,
        attendee.phone,
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        DATE_SUB(NOW(), INTERVAL 2 DAY)
     FROM users attendee
     JOIN events event_seed ON event_seed.slug = 'migration-test-event'
     WHERE attendee.email = 'attendee.test@event.local'
       AND NOT EXISTS (
           SELECT 1 FROM orders existing_order WHERE existing_order.order_code = 'ORD-SEED-ATTENDEE-001'
       )",
    "SELECT 1"
);
PREPARE stmt FROM @order_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @order_items_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('order_items', 'orders', 'ticket_types', 'events')
);
SET @order_item_sql = IF(
    @order_items_tables_exist = 4,
    "INSERT INTO order_items (
        order_id,
        ticket_type_id,
        unit_price,
        quantity,
        subtotal
     )
     SELECT
        order_seed.order_id,
        ticket_type_seed.ticket_type_id,
        199000.00,
        2,
        398000.00
     FROM orders order_seed
     JOIN events event_seed ON event_seed.event_id = order_seed.event_id
     JOIN ticket_types ticket_type_seed ON ticket_type_seed.event_id = event_seed.event_id
     WHERE order_seed.order_code = 'ORD-SEED-ATTENDEE-001'
       AND event_seed.slug = 'migration-test-event'
       AND ticket_type_seed.ticket_name = 'Standard Ticket'
       AND NOT EXISTS (
           SELECT 1
           FROM order_items existing_item
           WHERE existing_item.order_id = order_seed.order_id
             AND existing_item.ticket_type_id = ticket_type_seed.ticket_type_id
       )",
    "SELECT 1"
);
PREPARE stmt FROM @order_item_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @payments_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('payments', 'orders')
);
SET @payment_sql = IF(
    @payments_tables_exist = 2,
    "INSERT INTO payments (
        order_id,
        payment_method,
        provider,
        transaction_code,
        amount,
        payment_status,
        paid_at,
        response_data,
        created_at,
        updated_at
     )
     SELECT
        order_seed.order_id,
        'BANK_TRANSFER',
        'SeedBank Gateway',
        'PAY-SEED-ATTENDEE-001',
        398000.00,
        'SUCCESS',
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        '{\"status\":\"success\",\"source\":\"flyway-seed\"}',
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        DATE_SUB(NOW(), INTERVAL 2 DAY)
     FROM orders order_seed
     WHERE order_seed.order_code = 'ORD-SEED-ATTENDEE-001'
       AND NOT EXISTS (
           SELECT 1 FROM payments existing_payment WHERE existing_payment.order_id = order_seed.order_id
       )",
    "SELECT 1"
);
PREPARE stmt FROM @payment_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tickets_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('tickets', 'order_items', 'orders', 'events', 'ticket_types', 'users')
);
SET @ticket_one_sql = IF(
    @tickets_tables_exist = 6,
    "INSERT INTO tickets (
        order_item_id,
        event_id,
        ticket_type_id,
        owner_user_id,
        ticket_code,
        qr_code,
        attendee_name,
        attendee_email,
        status,
        issued_at,
        checked_in_at
     )
     SELECT
        order_item_seed.order_item_id,
        event_seed.event_id,
        ticket_type_seed.ticket_type_id,
        attendee.user_id,
        'TCK-ATT-001',
        'QR-TCK-ATT-001',
        attendee.full_name,
        attendee.email,
        'VALID',
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        NULL
     FROM order_items order_item_seed
     JOIN orders order_seed ON order_seed.order_id = order_item_seed.order_id
     JOIN events event_seed ON event_seed.event_id = order_seed.event_id
     JOIN ticket_types ticket_type_seed ON ticket_type_seed.ticket_type_id = order_item_seed.ticket_type_id
     JOIN users attendee ON attendee.user_id = order_seed.user_id
     WHERE order_seed.order_code = 'ORD-SEED-ATTENDEE-001'
       AND NOT EXISTS (SELECT 1 FROM tickets existing_ticket WHERE existing_ticket.ticket_code = 'TCK-ATT-001')",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_one_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @ticket_two_sql = IF(
    @tickets_tables_exist = 6,
    "INSERT INTO tickets (
        order_item_id,
        event_id,
        ticket_type_id,
        owner_user_id,
        ticket_code,
        qr_code,
        attendee_name,
        attendee_email,
        status,
        issued_at,
        checked_in_at
     )
     SELECT
        order_item_seed.order_item_id,
        event_seed.event_id,
        ticket_type_seed.ticket_type_id,
        attendee.user_id,
        'TCK-ATT-002',
        'QR-TCK-ATT-002',
        'Attendee Test Guest',
        'guest.attendee.test@event.local',
        'VALID',
        DATE_SUB(NOW(), INTERVAL 2 DAY),
        NULL
     FROM order_items order_item_seed
     JOIN orders order_seed ON order_seed.order_id = order_item_seed.order_id
     JOIN events event_seed ON event_seed.event_id = order_seed.event_id
     JOIN ticket_types ticket_type_seed ON ticket_type_seed.ticket_type_id = order_item_seed.ticket_type_id
     JOIN users attendee ON attendee.user_id = order_seed.user_id
     WHERE order_seed.order_code = 'ORD-SEED-ATTENDEE-001'
       AND NOT EXISTS (SELECT 1 FROM tickets existing_ticket WHERE existing_ticket.ticket_code = 'TCK-ATT-002')",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_two_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @ticket_type_update_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('ticket_types', 'events', 'tickets')
);
SET @ticket_type_update_sql = IF(
    @ticket_type_update_tables_exist = 3,
    "UPDATE ticket_types ticket_type_seed
     JOIN events event_seed ON event_seed.event_id = ticket_type_seed.event_id
     SET ticket_type_seed.quantity_sold = GREATEST(COALESCE(ticket_type_seed.quantity_sold, 0), 2),
         ticket_type_seed.updated_at = NOW()
     WHERE event_seed.slug = 'migration-test-event'
       AND ticket_type_seed.ticket_name = 'Standard Ticket'",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_type_update_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
