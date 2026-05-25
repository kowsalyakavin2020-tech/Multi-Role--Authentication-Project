CREATE DATABASE IF NOT EXISTS multi_role_db;

USE multi_role_db;

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    mobile VARCHAR(15) UNIQUE,
    role VARCHAR(20),
    location VARCHAR(100),
    business_name VARCHAR(100),
    business_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(10) PRIMARY KEY,
    vendor_id VARCHAR(10),
    supplier_id VARCHAR(10),
    product_id VARCHAR(10),
    quantity INT,
    status VARCHAR(20) DEFAULT 'Pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES users(user_id),
    FOREIGN KEY (supplier_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);