const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// Check Database Connection
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the expedition_gear database.');
        connection.release();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

checkConnection();

// --- Auth Routes ---

app.post('/api/register', async (req, res) => {
    const { name, email, password_hash } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, password_hash]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password_hash } = req.body;
    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ? AND password_hash = ?',
            [email, password_hash]
        );
        if (users.length > 0) {
            const user = users[0];
            delete user.password_hash; // Don't send hash back
            res.json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

// --- Product Routes ---

app.get('/api/products', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM product ORDER BY id ASC');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products', details: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { name, price, description, image, category } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO product (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
            [name, price, description, image, category]
        );
        res.status(201).json({ message: 'Product created', productId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create product', details: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM product WHERE id = ?', [id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product', details: err.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image, category } = req.body;
    try {
        await pool.query(
            'UPDATE product SET name = ?, price = ?, description = ?, image = ?, category = ? WHERE id = ?',
            [name, price, description, image, category, id]
        );
        res.json({ message: 'Product updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product', details: err.message });
    }
});

// --- Order Routes ---

app.post('/api/orders', async (req, res) => {
    const { user_id, total_amount, status, items } = req.body;
    try {
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
                [user_id || 1, total_amount, status || 'Paid']
            );

            // In a full implementation, we'd also insert into an order_items table here
            // For now, we'll just log successful order creation

            await connection.commit();
            res.status(201).json({ message: 'Order created successfully', orderId: orderResult.insertId });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (err) {
        res.status(500).json({ error: 'Order failed', details: err.message });
    }
});

app.get('/api/orders/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
            [user_id]
        );
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
