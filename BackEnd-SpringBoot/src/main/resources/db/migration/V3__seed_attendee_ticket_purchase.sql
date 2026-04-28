-- Seed transactional sample data for attendee purchase, payment, ticket, checkin, and commission flows.
-- This migration is idempotent and only inserts rows when the referenced parent seed records exist.
-- Chay mysql command line client -> use database_name -> source src/main/resources/db/migration/V3__seed_attendee_ticket_purchase.sql;

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
        buyer.user_id,
        event_seed.event_id,
        seeded_orders.order_code,
        seeded_orders.total_amount,
        seeded_orders.discount_amount,
        seeded_orders.final_amount,
        seeded_orders.order_status,
        seeded_orders.payment_status,
        buyer.full_name,
        buyer.email,
        buyer.phone,
        DATE_SUB(NOW(), INTERVAL seeded_orders.created_days_ago DAY),
        DATE_SUB(NOW(), INTERVAL seeded_orders.updated_days_ago DAY)
     FROM (
        SELECT 'attendee.test@event.local' AS buyer_email, 'migration-test-event' AS event_slug, 'ORD-SEED-001' AS order_code, 199000.00 AS total_amount, 0.00 AS discount_amount, 199000.00 AS final_amount, 'CONFIRMED' AS order_status, 'PAID' AS payment_status, 5 AS created_days_ago, 5 AS updated_days_ago
        UNION ALL SELECT 'attendee.alpha@event.local', 'react-builder-bootcamp', 'ORD-SEED-002', 349000.00, 0.00, 349000.00, 'CONFIRMED', 'PAID', 4, 4
        UNION ALL SELECT 'attendee.beta@event.local', 'acoustic-sunset-live', 'ORD-SEED-003', 259000.00, 10000.00, 249000.00, 'CONFIRMED', 'PAID', 3, 3
        UNION ALL SELECT 'attendee.gamma@event.local', 'startup-networking-night', 'ORD-SEED-004', 149000.00, 0.00, 149000.00, 'CONFIRMED', 'PAID', 2, 2
        UNION ALL SELECT 'attendee.delta@event.local', 'city-marathon-2026', 'ORD-SEED-005', 499000.00, 20000.00, 479000.00, 'CONFIRMED', 'PAID', 1, 1
     ) seeded_orders
     JOIN users buyer ON buyer.email = seeded_orders.buyer_email
     JOIN events event_seed ON event_seed.slug = seeded_orders.event_slug
     LEFT JOIN orders existing_orders ON existing_orders.order_code = seeded_orders.order_code
     WHERE existing_orders.order_id IS NULL",
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
        seeded_items.unit_price,
        seeded_items.quantity,
        seeded_items.subtotal
     FROM (
        SELECT 'ORD-SEED-001' AS order_code, 'migration-test-event' AS event_slug, 199000.00 AS unit_price, 1 AS quantity, 199000.00 AS subtotal
        UNION ALL SELECT 'ORD-SEED-002', 'react-builder-bootcamp', 349000.00, 1, 349000.00
        UNION ALL SELECT 'ORD-SEED-003', 'acoustic-sunset-live', 259000.00, 1, 259000.00
        UNION ALL SELECT 'ORD-SEED-004', 'startup-networking-night', 149000.00, 1, 149000.00
        UNION ALL SELECT 'ORD-SEED-005', 'city-marathon-2026', 499000.00, 1, 499000.00
     ) seeded_items
     JOIN orders order_seed ON order_seed.order_code = seeded_items.order_code
     JOIN events event_seed ON event_seed.slug = seeded_items.event_slug AND event_seed.event_id = order_seed.event_id
     JOIN ticket_types ticket_type_seed ON ticket_type_seed.event_id = event_seed.event_id
     LEFT JOIN order_items existing_items ON existing_items.order_id = order_seed.order_id AND existing_items.ticket_type_id = ticket_type_seed.ticket_type_id
     WHERE existing_items.order_item_id IS NULL",
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
        seeded_payments.payment_method,
        seeded_payments.provider,
        seeded_payments.transaction_code,
        seeded_payments.amount,
        seeded_payments.payment_status,
        DATE_SUB(NOW(), INTERVAL seeded_payments.paid_days_ago DAY),
        seeded_payments.response_data,
        DATE_SUB(NOW(), INTERVAL seeded_payments.created_days_ago DAY),
        DATE_SUB(NOW(), INTERVAL seeded_payments.updated_days_ago DAY)
     FROM (
        SELECT 'ORD-SEED-001' AS order_code, 'BANK_TRANSFER' AS payment_method, 'SeedBank Gateway' AS provider, 'PAY-SEED-001' AS transaction_code, 199000.00 AS amount, 'SUCCESS' AS payment_status, 5 AS paid_days_ago, '{\"status\":\"success\",\"source\":\"seed\",\"order\":\"ORD-SEED-001\"}' AS response_data, 5 AS created_days_ago, 5 AS updated_days_ago
        UNION ALL SELECT 'ORD-SEED-002', 'CARD', 'VNPAY Sandbox', 'PAY-SEED-002', 349000.00, 'SUCCESS', 4, '{\"status\":\"success\",\"source\":\"seed\",\"order\":\"ORD-SEED-002\"}', 4, 4
        UNION ALL SELECT 'ORD-SEED-003', 'EWALLET', 'MoMo Sandbox', 'PAY-SEED-003', 249000.00, 'SUCCESS', 3, '{\"status\":\"success\",\"source\":\"seed\",\"order\":\"ORD-SEED-003\"}', 3, 3
        UNION ALL SELECT 'ORD-SEED-004', 'BANK_TRANSFER', 'SeedBank Gateway', 'PAY-SEED-004', 149000.00, 'SUCCESS', 2, '{\"status\":\"success\",\"source\":\"seed\",\"order\":\"ORD-SEED-004\"}', 2, 2
        UNION ALL SELECT 'ORD-SEED-005', 'CARD', 'Stripe Sandbox', 'PAY-SEED-005', 479000.00, 'SUCCESS', 1, '{\"status\":\"success\",\"source\":\"seed\",\"order\":\"ORD-SEED-005\"}', 1, 1
     ) seeded_payments
     JOIN orders order_seed ON order_seed.order_code = seeded_payments.order_code
     LEFT JOIN payments existing_payments ON existing_payments.order_id = order_seed.order_id
     WHERE existing_payments.payment_id IS NULL",
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
SET @ticket_sql = IF(
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
        seeded_tickets.ticket_code,
        seeded_tickets.qr_code,
        seeded_tickets.attendee_name,
        seeded_tickets.attendee_email,
        seeded_tickets.status,
        DATE_SUB(NOW(), INTERVAL seeded_tickets.issued_days_ago DAY),
        DATE_SUB(NOW(), INTERVAL seeded_tickets.checked_in_days_ago DAY)
     FROM (
        SELECT 'ORD-SEED-001' AS order_code, 'TCK-SEED-001' AS ticket_code, 'QR-TCK-SEED-001' AS qr_code, 'Attendee Test' AS attendee_name, 'attendee.test@event.local' AS attendee_email, 'USED' AS status, 5 AS issued_days_ago, 4 AS checked_in_days_ago
        UNION ALL SELECT 'ORD-SEED-002', 'TCK-SEED-002', 'QR-TCK-SEED-002', 'Attendee Alpha', 'attendee.alpha@event.local', 'USED', 4, 3
        UNION ALL SELECT 'ORD-SEED-003', 'TCK-SEED-003', 'QR-TCK-SEED-003', 'Attendee Beta', 'attendee.beta@event.local', 'USED', 3, 2
        UNION ALL SELECT 'ORD-SEED-004', 'TCK-SEED-004', 'QR-TCK-SEED-004', 'Attendee Gamma', 'attendee.gamma@event.local', 'USED', 2, 1
        UNION ALL SELECT 'ORD-SEED-005', 'TCK-SEED-005', 'QR-TCK-SEED-005', 'Attendee Delta', 'attendee.delta@event.local', 'USED', 1, 0
     ) seeded_tickets
     JOIN orders order_seed ON order_seed.order_code = seeded_tickets.order_code
     JOIN order_items order_item_seed ON order_item_seed.order_id = order_seed.order_id
     JOIN events event_seed ON event_seed.event_id = order_seed.event_id
     JOIN ticket_types ticket_type_seed ON ticket_type_seed.ticket_type_id = order_item_seed.ticket_type_id
     JOIN users attendee ON attendee.email = seeded_tickets.attendee_email
     LEFT JOIN tickets existing_tickets ON existing_tickets.ticket_code = seeded_tickets.ticket_code
     WHERE existing_tickets.ticket_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @checkins_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('checkins', 'tickets', 'events', 'users')
);
SET @checkin_sql = IF(
    @checkins_tables_exist = 4,
    "INSERT INTO checkins (
        ticket_id,
        event_id,
        checked_in_by,
        checkin_time,
        gate_name,
        note
     )
     SELECT
        t.ticket_id,
        e.event_id,
        checker.user_id,
        DATE_SUB(NOW(), INTERVAL seeded_checkins.checked_in_hours_ago HOUR),
        seeded_checkins.gate_name,
        seeded_checkins.note
     FROM (
        SELECT 'TCK-SEED-001' AS ticket_code, 'migration-test-event' AS event_slug, 'organizer.test@event.local' AS checker_email, 72 AS checked_in_hours_ago, 'Gate A' AS gate_name, 'Seed checkin for migration test event.' AS note
        UNION ALL SELECT 'TCK-SEED-002', 'react-builder-bootcamp', 'organizer.alpha@event.local', 60, 'Workshop Gate', 'Checked in during workshop morning session.'
        UNION ALL SELECT 'TCK-SEED-003', 'acoustic-sunset-live', 'organizer.beta@event.local', 36, 'Concert Entry', 'Checked in before live performance.'
        UNION ALL SELECT 'TCK-SEED-004', 'startup-networking-night', 'organizer.gamma@event.local', 24, 'Lobby Checkin', 'Guest entered during networking hour.'
        UNION ALL SELECT 'TCK-SEED-005', 'city-marathon-2026', 'organizer.delta@event.local', 2, 'Race Gate', 'Runner checked in for race kit confirmation.'
     ) seeded_checkins
     JOIN tickets t ON t.ticket_code = seeded_checkins.ticket_code
     JOIN events e ON e.slug = seeded_checkins.event_slug AND e.event_id = t.event_id
     JOIN users checker ON checker.email = seeded_checkins.checker_email
     LEFT JOIN checkins existing_checkins ON existing_checkins.ticket_id = t.ticket_id AND existing_checkins.gate_name = seeded_checkins.gate_name
     WHERE existing_checkins.checkin_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @checkin_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @order_commissions_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('order_commissions', 'orders', 'commission_configs')
);
SET @order_commission_sql = IF(
    @order_commissions_tables_exist = 3,
    "INSERT INTO order_commissions (
        order_id,
        commission_id,
        commission_type,
        commission_value,
        commission_amount,
        created_at
     )
     SELECT
        o.order_id,
        c.commission_id,
        seeded_order_commissions.commission_type,
        seeded_order_commissions.commission_value,
        seeded_order_commissions.commission_amount,
        DATE_SUB(NOW(), INTERVAL seeded_order_commissions.created_days_ago DAY)
     FROM (
        SELECT 'ORD-SEED-001' AS order_code, 'Standard Platform Fee' AS commission_name, 'PERCENT' AS commission_type, 5.00 AS commission_value, 9950.00 AS commission_amount, 5 AS created_days_ago
        UNION ALL SELECT 'ORD-SEED-002', 'Workshop Boost Fee', 'PERCENT', 7.50, 26175.00, 4
        UNION ALL SELECT 'ORD-SEED-003', 'Music Campaign Flat Fee', 'FIXED', 15000.00, 15000.00, 3
        UNION ALL SELECT 'ORD-SEED-004', 'Networking Partner Fee', 'FIXED', 10000.00, 10000.00, 2
        UNION ALL SELECT 'ORD-SEED-005', 'Standard Platform Fee', 'PERCENT', 5.00, 23950.00, 1
     ) seeded_order_commissions
     JOIN orders o ON o.order_code = seeded_order_commissions.order_code
     JOIN commission_configs c ON c.commission_name = seeded_order_commissions.commission_name
     LEFT JOIN order_commissions existing_order_commissions ON existing_order_commissions.order_id = o.order_id AND existing_order_commissions.commission_id = c.commission_id
     WHERE existing_order_commissions.order_commission_id IS NULL",
    "SELECT 1"
);
PREPARE stmt FROM @order_commission_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @ticket_type_update_tables_exist = (
    SELECT COUNT(*)
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
      AND table_name IN ('ticket_types', 'tickets')
);
SET @ticket_type_update_sql = IF(
    @ticket_type_update_tables_exist = 2,
    "UPDATE ticket_types ticket_type_seed
     LEFT JOIN (
        SELECT ticket_type_id, COUNT(*) AS sold_count
        FROM tickets
        GROUP BY ticket_type_id
     ) sold_stats ON sold_stats.ticket_type_id = ticket_type_seed.ticket_type_id
     SET ticket_type_seed.quantity_sold = COALESCE(sold_stats.sold_count, 0),
         ticket_type_seed.updated_at = NOW()",
    "SELECT 1"
);
PREPARE stmt FROM @ticket_type_update_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
