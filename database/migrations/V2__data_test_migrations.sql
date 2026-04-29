-- Seed master/reference test data (idempotent).
-- Target users: 1 ADMIN, 3 ORGANIZER, 3 ATTENDEE.
-- Event timeline (fixed):
--   start_time: 2026-05-14
--   end_time:   2026-05-15
--   registration_deadline: 2026-05-13 23:59:59

SET @seed_password_hash = '$2a$10$VIiVqq59Iu1d9T9BvyeBx.CQKJRt8brI9eksosjtIZR1XOoSV1Z22';

-- Roles
INSERT INTO roles (role_id, role_name, description, created_at)
VALUES
    (1, 'ADMIN', 'System administrator', NOW()),
    (2, 'ORGANIZER', 'Event organizer', NOW()),
    (3, 'ATTENDEE', 'Event attendee', NOW())
ON DUPLICATE KEY UPDATE
    description = VALUES(description);

-- Users (1 admin, 3 organizers, 3 attendees)
INSERT INTO users (role_id, full_name, email, phone, password_hash, avatar_url, status, email_verified_at, last_login_at, created_at, updated_at)
SELECT r.role_id, s.full_name, s.email, s.phone, @seed_password_hash, NULL, 'ACTIVE', NOW(), DATE_SUB(NOW(), INTERVAL s.last_login_days DAY), NOW(), NOW()
FROM (
    SELECT 'ADMIN' AS role_name, 'Admin QA' AS full_name, 'admin.qa@event.local' AS email, '0901000001' AS phone, 1 AS last_login_days
    UNION ALL SELECT 'ORGANIZER', 'Organizer One', 'organizer.one@event.local', '0901000002', 2
    UNION ALL SELECT 'ORGANIZER', 'Organizer Two', 'organizer.two@event.local', '0901000003', 3
    UNION ALL SELECT 'ORGANIZER', 'Organizer Three', 'organizer.three@event.local', '0901000004', 4
    UNION ALL SELECT 'ATTENDEE', 'Attendee One', 'attendee.one@event.local', '0901000005', 1
    UNION ALL SELECT 'ATTENDEE', 'Attendee Two', 'attendee.two@event.local', '0901000006', 2
    UNION ALL SELECT 'ATTENDEE', 'Attendee Three', 'attendee.three@event.local', '0901000007', 3
) s
JOIN roles r ON r.role_name = s.role_name
LEFT JOIN users u ON u.email = s.email
WHERE u.user_id IS NULL;

-- Organizer profiles (3 organizers)
INSERT INTO organizer_profiles (
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
    s.organization_name,
    s.tax_code,
    s.website,
    s.description,
    s.address,
    s.bank_account_name,
    s.bank_account_number,
    s.bank_name,
    s.is_verified,
    NOW(),
    NOW()
FROM (
    SELECT 'organizer.one@event.local' AS email, 'One Events Co.' AS organization_name, 'TAX-ONE-001' AS tax_code, 'https://one-events.local' AS website, 'Organizer One profile.' AS description, 'District 1, Ho Chi Minh City' AS address, 'Organizer One' AS bank_account_name, '970400001001' AS bank_account_number, 'Vietcombank' AS bank_name, TRUE AS is_verified
    UNION ALL SELECT 'organizer.two@event.local', 'Two Studio JSC', 'TAX-TWO-002', 'https://two-studio.local', 'Organizer Two profile.', 'Ba Dinh, Ha Noi', 'Organizer Two', '970400001002', 'ACB', TRUE
    UNION ALL SELECT 'organizer.three@event.local', 'Three Community Hub', 'TAX-THR-003', 'https://three-hub.local', 'Organizer Three profile.', 'Hai Chau, Da Nang', 'Organizer Three', '970400001003', 'Techcombank', TRUE
) s
JOIN users u ON u.email = s.email
LEFT JOIN organizer_profiles op ON op.user_id = u.user_id
WHERE op.organizer_id IS NULL;

-- Categories (10)
INSERT INTO categories (category_name, description, status, created_at)
SELECT s.category_name, s.description, 'ACTIVE', NOW()
FROM (
    SELECT 'Conference' AS category_name, 'Conference and summit events.' AS description
    UNION ALL SELECT 'Workshop', 'Hands-on workshop sessions.'
    UNION ALL SELECT 'Music', 'Concert and live music events.'
    UNION ALL SELECT 'Networking', 'Networking and meetup events.'
    UNION ALL SELECT 'Sports', 'Sports and competition events.'
    UNION ALL SELECT 'Technology', 'Technology-focused events.'
    UNION ALL SELECT 'Education', 'Education and training events.'
    UNION ALL SELECT 'Startup', 'Startup and founder events.'
    UNION ALL SELECT 'Marketing', 'Marketing and growth events.'
    UNION ALL SELECT 'Community', 'Community and social events.'
) s
LEFT JOIN categories c ON c.category_name = s.category_name
WHERE c.category_id IS NULL;

-- Events (10)
INSERT INTO events (
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
    s.title,
    s.slug,
    s.short_description,
    s.description,
    s.banner_url,
    s.venue_name,
    s.venue_address,
    s.city,
    'OFFLINE',
    NULL,
    '2026-05-14 08:00:00',
    '2026-05-15 18:00:00',
    '2026-05-13 23:59:59',
    'PUBLISHED',
    'APPROVED',
    NOW(),
    NOW()
FROM (
    SELECT 'organizer.one@event.local' AS organizer_email, 'Conference' AS category_name, 'Tech Leadership Summit 2026' AS title, 'tech-leadership-summit-2026' AS slug, 'Leadership summit for engineering managers.' AS short_description, 'A full-day summit on leadership, architecture, and delivery excellence.' AS description, 'https://images.example.com/events/tech-leadership-summit-2026.jpg' AS banner_url, 'Saigon Convention Center' AS venue_name, '799 Nguyen Van Linh' AS venue_address, 'Ho Chi Minh City' AS city
    UNION ALL SELECT 'organizer.two@event.local', 'Workshop', 'React Performance Bootcamp', 'react-performance-bootcamp', 'Hands-on React optimization workshop.', 'Deep dive into rendering, memoization, and performance profiling.' , 'https://images.example.com/events/react-performance-bootcamp.jpg', 'Innovation Lab Hanoi', '12 Duy Tan', 'Ha Noi'
    UNION ALL SELECT 'organizer.three@event.local', 'Music', 'Indie Acoustic Night', 'indie-acoustic-night', 'Acoustic showcase with indie artists.', 'Evening acoustic performances and artist interaction.', 'https://images.example.com/events/indie-acoustic-night.jpg', 'River Stage', '88 Bach Dang', 'Da Nang'
    UNION ALL SELECT 'organizer.one@event.local', 'Networking', 'Product Leaders Meetup', 'product-leaders-meetup', 'Monthly meetup for product leaders.', 'Talks and networking for PMs and product leaders.', 'https://images.example.com/events/product-leaders-meetup.jpg', 'Central Hall', '45 Le Loi', 'Ho Chi Minh City'
    UNION ALL SELECT 'organizer.two@event.local', 'Sports', 'City Run 10K', 'city-run-10k', '10K race event for runners.', 'Community race with finisher kit and medals.', 'https://images.example.com/events/city-run-10k.jpg', 'Sports Park', '9 Vo Nguyen Giap', 'Da Nang'
    UNION ALL SELECT 'organizer.three@event.local', 'Technology', 'Cloud Native Day', 'cloud-native-day', 'Cloud native platform and DevOps topics.', 'Sessions on Kubernetes, observability, and platform engineering.', 'https://images.example.com/events/cloud-native-day.jpg', 'Tech Hub', '2 Tran Hung Dao', 'Ha Noi'
    UNION ALL SELECT 'organizer.one@event.local', 'Education', 'AI for Business Class', 'ai-for-business-class', 'AI practical class for business users.', 'Practical AI use cases for operations and growth teams.', 'https://images.example.com/events/ai-for-business-class.jpg', 'Learning Center', '101 Nguyen Trai', 'Ho Chi Minh City'
    UNION ALL SELECT 'organizer.two@event.local', 'Startup', 'Founder Pitch Night', 'founder-pitch-night', 'Pitch and feedback session for founders.', 'Early-stage founders pitch to mentors and investors.', 'https://images.example.com/events/founder-pitch-night.jpg', 'Startup Hub', '33 Lang Ha', 'Ha Noi'
    UNION ALL SELECT 'organizer.three@event.local', 'Marketing', 'Growth Marketing Lab', 'growth-marketing-lab', 'Workshop on growth channels and attribution.', 'Practical growth experiments and analytics setup.', 'https://images.example.com/events/growth-marketing-lab.jpg', 'Digital House', '77 Vo Van Kiet', 'Da Nang'
    UNION ALL SELECT 'organizer.one@event.local', 'Community', 'Volunteer Connect Day', 'volunteer-connect-day', 'Community volunteer networking event.', 'Connect NGOs, volunteers, and local initiatives.', 'https://images.example.com/events/volunteer-connect-day.jpg', 'Community Center', '11 Pham Ngu Lao', 'Ho Chi Minh City'
) s
JOIN users u ON u.email = s.organizer_email
JOIN organizer_profiles op ON op.user_id = u.user_id
JOIN categories c ON c.category_name = s.category_name
LEFT JOIN events e ON e.slug = s.slug
WHERE e.event_id IS NULL;

-- Event approvals (10)
INSERT INTO event_approvals (
    event_id,
    reviewed_by,
    approval_status,
    review_note,
    reviewed_at
)
SELECT
    e.event_id,
    admin_user.user_id,
    'APPROVED',
    CONCAT('Approved for QA seed: ', e.slug),
    DATE_SUB(e.start_time, INTERVAL 2 DAY)
FROM events e
JOIN users admin_user ON admin_user.email = 'admin.qa@event.local'
LEFT JOIN event_approvals ea ON ea.event_id = e.event_id AND ea.reviewed_by = admin_user.user_id AND ea.approval_status = 'APPROVED'
WHERE e.slug IN (
    'tech-leadership-summit-2026',
    'react-performance-bootcamp',
    'indie-acoustic-night',
    'product-leaders-meetup',
    'city-run-10k',
    'cloud-native-day',
    'ai-for-business-class',
    'founder-pitch-night',
    'growth-marketing-lab',
    'volunteer-connect-day'
)
AND ea.approval_id IS NULL;

-- Commission configs (base data for order_commissions in V3)
INSERT INTO commission_configs (
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
    s.commission_name,
    s.commission_type,
    s.commission_value,
    s.status,
    s.apply_from,
    s.apply_to,
    admin_user.user_id,
    NOW()
FROM (
    SELECT 'Standard Platform Fee' AS commission_name, 'PERCENT' AS commission_type, 5.00 AS commission_value, 'ACTIVE' AS status, '2026-01-01 00:00:00' AS apply_from, NULL AS apply_to
    UNION ALL SELECT 'Fixed Processing Fee', 'FIXED', 10000.00, 'ACTIVE', '2026-01-01 00:00:00', NULL
) s
JOIN users admin_user ON admin_user.email = 'admin.qa@event.local'
LEFT JOIN commission_configs cc ON cc.commission_name = s.commission_name
WHERE cc.commission_id IS NULL;


-- ==================== TRANSACTIONAL SEED SECTION ====================

-- Seed transactional test data (idempotent).
-- Target rows per table in this script:
-- ticket_types: 10
-- orders: 10
-- order_items: 10
-- payments: 10
-- tickets: 10
-- order_commissions: 10
-- Event date rule already set in V2:
--   start: 2026-05-14, end: 2026-05-15, registration_deadline: 2026-05-13 23:59:59
-- Ticket sale window in this script:
--   sale_end_time: 2026-05-13 23:59:59

-- Ticket types (10, 1 per event)
INSERT INTO ticket_types (
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
    s.ticket_name,
    s.description,
    s.price,
    s.quantity_total,
    0,
    s.max_per_order,
    '2026-05-01 00:00:00',
    '2026-05-13 23:59:59',
    'ON_SALE',
    NOW(),
    NOW()
FROM (
    SELECT 'tech-leadership-summit-2026' AS event_slug, 'Standard Pass' AS ticket_name, 'General access pass for the summit.' AS description, 399000.00 AS price, 300 AS quantity_total, 5 AS max_per_order
    UNION ALL SELECT 'react-performance-bootcamp', 'Bootcamp Pass', 'Workshop pass with printed materials.', 349000.00, 200, 3
    UNION ALL SELECT 'indie-acoustic-night', 'Concert Ticket', 'Standing ticket for acoustic night.', 259000.00, 250, 4
    UNION ALL SELECT 'product-leaders-meetup', 'Meetup Entry', 'Networking and talk sessions access.', 149000.00, 220, 2
    UNION ALL SELECT 'city-run-10k', 'Runner Bib', 'Race bib and finisher kit.', 499000.00, 500, 1
    UNION ALL SELECT 'cloud-native-day', 'Conference Pass', 'Day pass for all cloud-native sessions.', 299000.00, 280, 3
    UNION ALL SELECT 'ai-for-business-class', 'Class Seat', 'Class seat with workbook included.', 279000.00, 180, 2
    UNION ALL SELECT 'founder-pitch-night', 'Pitch Night Entry', 'Entry pass for founders and guests.', 199000.00, 210, 2
    UNION ALL SELECT 'growth-marketing-lab', 'Lab Seat', 'Hands-on growth marketing workshop seat.', 229000.00, 170, 2
    UNION ALL SELECT 'volunteer-connect-day', 'Community Pass', 'Community networking event pass.', 99000.00, 260, 6
) s
JOIN events e ON e.slug = s.event_slug
LEFT JOIN ticket_types tt ON tt.event_id = e.event_id AND tt.ticket_name = s.ticket_name
WHERE tt.ticket_type_id IS NULL;

-- Orders (10)
INSERT INTO orders (
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
    e.event_id,
    s.order_code,
    s.total_amount,
    s.discount_amount,
    s.final_amount,
    'CONFIRMED',
    'PAID',
    buyer.full_name,
    buyer.email,
    buyer.phone,
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY),
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY)
FROM (
    SELECT 'ORD-202605-0001' AS order_code, 'attendee.one@event.local' AS buyer_email, 'tech-leadership-summit-2026' AS event_slug, 399000.00 AS total_amount, 0.00 AS discount_amount, 399000.00 AS final_amount, 10 AS days_ago
    UNION ALL SELECT 'ORD-202605-0002', 'attendee.two@event.local', 'react-performance-bootcamp', 349000.00, 0.00, 349000.00, 9
    UNION ALL SELECT 'ORD-202605-0003', 'attendee.three@event.local', 'indie-acoustic-night', 259000.00, 10000.00, 249000.00, 8
    UNION ALL SELECT 'ORD-202605-0004', 'attendee.one@event.local', 'product-leaders-meetup', 149000.00, 0.00, 149000.00, 7
    UNION ALL SELECT 'ORD-202605-0005', 'attendee.two@event.local', 'city-run-10k', 499000.00, 20000.00, 479000.00, 6
    UNION ALL SELECT 'ORD-202605-0006', 'attendee.three@event.local', 'cloud-native-day', 299000.00, 0.00, 299000.00, 5
    UNION ALL SELECT 'ORD-202605-0007', 'attendee.one@event.local', 'ai-for-business-class', 279000.00, 0.00, 279000.00, 4
    UNION ALL SELECT 'ORD-202605-0008', 'attendee.two@event.local', 'founder-pitch-night', 199000.00, 0.00, 199000.00, 3
    UNION ALL SELECT 'ORD-202605-0009', 'attendee.three@event.local', 'growth-marketing-lab', 229000.00, 0.00, 229000.00, 2
    UNION ALL SELECT 'ORD-202605-0010', 'attendee.one@event.local', 'volunteer-connect-day', 99000.00, 0.00, 99000.00, 1
) s
JOIN users buyer ON buyer.email = s.buyer_email
JOIN events e ON e.slug = s.event_slug
LEFT JOIN orders o ON o.order_code = s.order_code
WHERE o.order_id IS NULL;

-- Order items (10)
INSERT INTO order_items (
    order_id,
    ticket_type_id,
    unit_price,
    quantity,
    subtotal
)
SELECT
    o.order_id,
    tt.ticket_type_id,
    s.unit_price,
    1,
    s.unit_price
FROM (
    SELECT 'ORD-202605-0001' AS order_code, 'tech-leadership-summit-2026' AS event_slug, 399000.00 AS unit_price
    UNION ALL SELECT 'ORD-202605-0002', 'react-performance-bootcamp', 349000.00
    UNION ALL SELECT 'ORD-202605-0003', 'indie-acoustic-night', 259000.00
    UNION ALL SELECT 'ORD-202605-0004', 'product-leaders-meetup', 149000.00
    UNION ALL SELECT 'ORD-202605-0005', 'city-run-10k', 499000.00
    UNION ALL SELECT 'ORD-202605-0006', 'cloud-native-day', 299000.00
    UNION ALL SELECT 'ORD-202605-0007', 'ai-for-business-class', 279000.00
    UNION ALL SELECT 'ORD-202605-0008', 'founder-pitch-night', 199000.00
    UNION ALL SELECT 'ORD-202605-0009', 'growth-marketing-lab', 229000.00
    UNION ALL SELECT 'ORD-202605-0010', 'volunteer-connect-day', 99000.00
) s
JOIN orders o ON o.order_code = s.order_code
JOIN events e ON e.slug = s.event_slug AND e.event_id = o.event_id
JOIN ticket_types tt ON tt.event_id = e.event_id
LEFT JOIN order_items oi ON oi.order_id = o.order_id AND oi.ticket_type_id = tt.ticket_type_id
WHERE oi.order_item_id IS NULL;

-- Payments (10)
INSERT INTO payments (
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
    o.order_id,
    s.payment_method,
    s.provider,
    s.transaction_code,
    s.amount,
    'SUCCESS',
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY),
    s.response_data,
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY),
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY)
FROM (
    SELECT 'ORD-202605-0001' AS order_code, 'BANK_TRANSFER' AS payment_method, 'SePay Sandbox' AS provider, 'PAY-202605-0001' AS transaction_code, 399000.00 AS amount, 10 AS days_ago, '{"status":"success","seed":"v3","order":"ORD-202605-0001"}' AS response_data
    UNION ALL SELECT 'ORD-202605-0002', 'CARD', 'VNPAY Sandbox', 'PAY-202605-0002', 349000.00, 9, '{"status":"success","seed":"v3","order":"ORD-202605-0002"}'
    UNION ALL SELECT 'ORD-202605-0003', 'EWALLET', 'MoMo Sandbox', 'PAY-202605-0003', 249000.00, 8, '{"status":"success","seed":"v3","order":"ORD-202605-0003"}'
    UNION ALL SELECT 'ORD-202605-0004', 'BANK_TRANSFER', 'SePay Sandbox', 'PAY-202605-0004', 149000.00, 7, '{"status":"success","seed":"v3","order":"ORD-202605-0004"}'
    UNION ALL SELECT 'ORD-202605-0005', 'CARD', 'Stripe Sandbox', 'PAY-202605-0005', 479000.00, 6, '{"status":"success","seed":"v3","order":"ORD-202605-0005"}'
    UNION ALL SELECT 'ORD-202605-0006', 'BANK_TRANSFER', 'SePay Sandbox', 'PAY-202605-0006', 299000.00, 5, '{"status":"success","seed":"v3","order":"ORD-202605-0006"}'
    UNION ALL SELECT 'ORD-202605-0007', 'CARD', 'VNPAY Sandbox', 'PAY-202605-0007', 279000.00, 4, '{"status":"success","seed":"v3","order":"ORD-202605-0007"}'
    UNION ALL SELECT 'ORD-202605-0008', 'EWALLET', 'MoMo Sandbox', 'PAY-202605-0008', 199000.00, 3, '{"status":"success","seed":"v3","order":"ORD-202605-0008"}'
    UNION ALL SELECT 'ORD-202605-0009', 'BANK_TRANSFER', 'SePay Sandbox', 'PAY-202605-0009', 229000.00, 2, '{"status":"success","seed":"v3","order":"ORD-202605-0009"}'
    UNION ALL SELECT 'ORD-202605-0010', 'BANK_TRANSFER', 'SePay Sandbox', 'PAY-202605-0010', 99000.00, 1, '{"status":"success","seed":"v3","order":"ORD-202605-0010"}'
) s
JOIN orders o ON o.order_code = s.order_code
LEFT JOIN payments p ON p.order_id = o.order_id
WHERE p.payment_id IS NULL;

-- Tickets (10) - real usable ticket codes for scan/check-in
INSERT INTO tickets (
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
    oi.order_item_id,
    o.event_id,
    oi.ticket_type_id,
    buyer.user_id,
    s.ticket_code,
    CONCAT('QR-', s.ticket_code),
    buyer.full_name,
    buyer.email,
    'VALID',
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY),
    NULL
FROM (
    SELECT 'ORD-202605-0001' AS order_code, 'TCK-202605-0001' AS ticket_code, 10 AS days_ago
    UNION ALL SELECT 'ORD-202605-0002', 'TCK-202605-0002', 9
    UNION ALL SELECT 'ORD-202605-0003', 'TCK-202605-0003', 8
    UNION ALL SELECT 'ORD-202605-0004', 'TCK-202605-0004', 7
    UNION ALL SELECT 'ORD-202605-0005', 'TCK-202605-0005', 6
    UNION ALL SELECT 'ORD-202605-0006', 'TCK-202605-0006', 5
    UNION ALL SELECT 'ORD-202605-0007', 'TCK-202605-0007', 4
    UNION ALL SELECT 'ORD-202605-0008', 'TCK-202605-0008', 3
    UNION ALL SELECT 'ORD-202605-0009', 'TCK-202605-0009', 2
    UNION ALL SELECT 'ORD-202605-0010', 'TCK-202605-0010', 1
) s
JOIN orders o ON o.order_code = s.order_code
JOIN users buyer ON buyer.user_id = o.user_id
JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN tickets t ON t.ticket_code = s.ticket_code
WHERE t.ticket_id IS NULL;

-- Order commissions (10)
INSERT INTO order_commissions (
    order_id,
    commission_id,
    commission_type,
    commission_value,
    commission_amount,
    created_at
)
SELECT
    o.order_id,
    cc.commission_id,
    'PERCENT',
    5.00,
    ROUND(o.final_amount * 0.05, 2),
    DATE_SUB(NOW(), INTERVAL s.days_ago DAY)
FROM (
    SELECT 'ORD-202605-0001' AS order_code, 10 AS days_ago
    UNION ALL SELECT 'ORD-202605-0002', 9
    UNION ALL SELECT 'ORD-202605-0003', 8
    UNION ALL SELECT 'ORD-202605-0004', 7
    UNION ALL SELECT 'ORD-202605-0005', 6
    UNION ALL SELECT 'ORD-202605-0006', 5
    UNION ALL SELECT 'ORD-202605-0007', 4
    UNION ALL SELECT 'ORD-202605-0008', 3
    UNION ALL SELECT 'ORD-202605-0009', 2
    UNION ALL SELECT 'ORD-202605-0010', 1
) s
JOIN orders o ON o.order_code = s.order_code
JOIN commission_configs cc ON cc.commission_name = 'Standard Platform Fee'
LEFT JOIN order_commissions oc ON oc.order_id = o.order_id AND oc.commission_id = cc.commission_id
WHERE oc.order_commission_id IS NULL;

-- Keep quantity_sold aligned with seeded tickets
UPDATE ticket_types tt
LEFT JOIN (
    SELECT ticket_type_id, COUNT(*) AS sold_count
    FROM tickets
    GROUP BY ticket_type_id
) sold ON sold.ticket_type_id = tt.ticket_type_id
SET tt.quantity_sold = COALESCE(sold.sold_count, 0),
    tt.updated_at = NOW();

