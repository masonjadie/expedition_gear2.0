-- Heritage Store: Products Table Update Script
-- Use this script in MySQL Workbench to sync your 'products' table.

USE heritage_store;

-- 1. Drop existing 'products' table to ensure correct structure
DROP TABLE IF EXISTS products;

-- 2. Create the 'products' table (plural) with the correct structure
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Insert the NEW inventory
INSERT INTO products (name, price, description, image, category) VALUES
('Hiking Boots', 32.00, 'Rugged durability for the toughest trails.', 'https://images.unsplash.com/photo-1520639889313-72147519968a?auto=format&fit=crop&w=600&q=80&fm=webp', 'Hiking'),
('XTR Camping Tent', 129.00, 'Spacious 4-person tent with weather-shield technology.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80&fm=webp', 'Camping'),
('AX Sleeping Bag', 25.00, 'Compact and lightweight for summer backpacking.', 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&w=600&q=80&fm=webp', 'Camping'),
('Wintern Gore-Tex Jacket', 45.00, 'Breathable, waterproof protection for extreme conditions.', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80&fm=webp', 'Apparel'),
('TXZ Hiking backpack', 35.00, 'Ergonomic design with built-in hydration sleeve.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80&fm=webp', 'Hiking'),
('TX Helmet', 30.00, 'Lightweight climbing helmet for maximum safety.', 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=600&q=80&fm=webp', 'Hiking');

-- Also update the 'product' (singular) table that the server uses
DROP TABLE IF EXISTS product;
CREATE TABLE product LIKE products;
INSERT INTO product SELECT * FROM products;
