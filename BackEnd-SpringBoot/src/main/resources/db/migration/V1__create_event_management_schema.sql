CREATE TABLE IF NOT EXISTS roles (
    role_id BIGINT NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id),
    CONSTRAINT uk_roles_role_name UNIQUE (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    role_id BIGINT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    avatar_url VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    email_verified_at DATETIME,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (user_id),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS organizer_profiles (
    organizer_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    tax_code VARCHAR(50),
    website VARCHAR(255),
    description TEXT,
    address VARCHAR(255),
    bank_account_name VARCHAR(150),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (organizer_id),
    CONSTRAINT uk_organizer_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_organizer_profiles_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGINT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS events (
    event_id BIGINT NOT NULL AUTO_INCREMENT,
    organizer_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    banner_url VARCHAR(255),
    venue_name VARCHAR(200),
    venue_address VARCHAR(255),
    city VARCHAR(100),
    location_type VARCHAR(20) NOT NULL,
    meeting_url VARCHAR(255),
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    registration_deadline DATETIME,
    publish_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (event_id),
    CONSTRAINT uk_events_slug UNIQUE (slug),
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES organizer_profiles(organizer_id),
    CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket_types (
    ticket_type_id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    ticket_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(12,2) NOT NULL,
    quantity_total INT NOT NULL,
    quantity_sold INT NOT NULL DEFAULT 0,
    max_per_order INT NOT NULL,
    sale_start_time DATETIME,
    sale_end_time DATETIME,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (ticket_type_id),
    CONSTRAINT fk_ticket_types_event FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    order_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    order_code VARCHAR(50) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL,
    order_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    buyer_name VARCHAR(150) NOT NULL,
    buyer_email VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(20),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (order_id),
    CONSTRAINT uk_orders_order_code UNIQUE (order_code),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_event FOREIGN KEY (event_id) REFERENCES events(event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGINT NOT NULL AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    ticket_type_id BIGINT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_items_ticket_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT NOT NULL AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    transaction_code VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    paid_at DATETIME,
    response_data TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    PRIMARY KEY (payment_id),
    CONSTRAINT uk_payments_order_id UNIQUE (order_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id BIGINT NOT NULL AUTO_INCREMENT,
    order_item_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    ticket_type_id BIGINT NOT NULL,
    owner_user_id BIGINT NOT NULL,
    ticket_code VARCHAR(100) NOT NULL,
    qr_code VARCHAR(255),
    attendee_name VARCHAR(150) NOT NULL,
    attendee_email VARCHAR(150),
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked_in_at DATETIME,
    PRIMARY KEY (ticket_id),
    CONSTRAINT uk_tickets_ticket_code UNIQUE (ticket_code),
    CONSTRAINT fk_tickets_order_item FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id),
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_tickets_ticket_type FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id),
    CONSTRAINT fk_tickets_owner_user FOREIGN KEY (owner_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS checkins (
    checkin_id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    checked_in_by BIGINT NOT NULL,
    checkin_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gate_name VARCHAR(100),
    note VARCHAR(255),
    PRIMARY KEY (checkin_id),
    CONSTRAINT fk_checkins_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id),
    CONSTRAINT fk_checkins_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_checkins_checked_in_by FOREIGN KEY (checked_in_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_approvals (
    approval_id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    reviewed_by BIGINT NOT NULL,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    review_note VARCHAR(500),
    reviewed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (approval_id),
    CONSTRAINT fk_event_approvals_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_event_approvals_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS commission_configs (
    commission_id BIGINT NOT NULL AUTO_INCREMENT,
    commission_name VARCHAR(100) NOT NULL,
    commission_type VARCHAR(20) NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    apply_from DATETIME NOT NULL,
    apply_to DATETIME,
    created_by BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (commission_id),
    CONSTRAINT fk_commission_configs_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_commissions (
    order_commission_id BIGINT NOT NULL AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    commission_id BIGINT NOT NULL,
    commission_type VARCHAR(20) NOT NULL,
    commission_value DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (order_commission_id),
    CONSTRAINT fk_order_commissions_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_order_commissions_config FOREIGN KEY (commission_id) REFERENCES commission_configs(commission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_campaigns (
    campaign_id BIGINT NOT NULL AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    send_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    scheduled_at DATETIME,
    sent_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (campaign_id),
    CONSTRAINT fk_email_campaigns_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_email_campaigns_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    PRIMARY KEY (notification_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO roles (role_id, role_name, description, created_at)
VALUES
    (1, 'ADMIN', 'System administrator', NOW()),
    (2, 'ORGANIZER', 'Event organizer', NOW()),
    (3, 'ATTENDEE', 'Event attendee', NOW())
ON DUPLICATE KEY UPDATE
    role_name = VALUES(role_name),
    description = VALUES(description);
