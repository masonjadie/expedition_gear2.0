-- Expedition Gear Database Schema
-- For School Project: MOD4

CREATE DATABASE IF NOT EXISTS expedition_gear;
USE expedition_gear;

-- 1. Users Table
-- Requirements: ID, name, email, encrypted password
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Table
-- Requirements: ID, name, price, description, image
CREATE TABLE IF NOT EXISTS product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
-- Requirements: basic structure only
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data for Products
INSERT INTO product (name, price, description, image, category) VALUES
('Expedition Gore-Tex Jacket', 45.00, 'Ultimate protection for high-altitude climbing.', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80&fm=webp', 'Apparel'),
('Ultra-Light Titanium Stove', 35.00, 'Minimalist cooking solution for weight-conscious hikers.', 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=600&q=80&fm=webp', 'Handcrafted'),
('Packable Down Sleeping Bag', 25.00, 'Superior warmth-to-weight ratio.', 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&w=600&q=80&fm=webp', 'Handcrafted'),
('Multi-Tool Survival Kit', 22.00, 'Everything you need in a compact package.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80&fm=webp', 'Essentials'),
('Merino Wool Baselayer', 18.00, 'Premium moisture-wicking comfort.', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80&fm=webp', 'Apparel'),
('Solar Power Bank 20,000mAh', 30.00, 'Keep your devices charged anywhere.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80&fm=webp', 'Essentials'),
('Lightweight Hiking Socks', 28.00, 'Blister protection and ultimate durability.', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80&fm=webp', 'Apparel'),
('Limited Edition Topo Map', 60.00, 'A beautifully crafted topographical map.', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80&fm=webp', 'Collectors');
