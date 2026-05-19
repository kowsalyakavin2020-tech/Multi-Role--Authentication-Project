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