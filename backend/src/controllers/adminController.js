import bcrypt from 'bcrypt';
import db from '../db.js';

export const getDashboard = async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) AS count FROM users');
        const [stores] = await db.query('SELECT COUNT(*) AS count FROM stores');
        const [ratings] = await db.query('SELECT COUNT(*) AS count FROM ratings');

        res.json({
            totalUsers: users[0].count,
            totalStores: stores[0].count,
            totalRatings: ratings[0].count,
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addUser = async (req, res) => {
    const { name, email, address, password, role } = req.body;

    try {
        // Validate input
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: 'Name must be 20-60 characters' });
        }
        if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (address && address.length > 400) {
            return res.status(400).json({ message: 'Address must be under 400 characters' });
        }
        if (!password || !password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)) {
            return res.status(400).json({ message: 'Password must be 8-16 characters with at least one uppercase letter and one special character' });
        }
        if (!['admin', 'user', 'store_owner'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if email exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await db.query(
            'INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, address || null, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        // Validate input
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ message: 'Name must be 20-60 characters' });
        }
        if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (address && address.length > 400) {
            return res.status(400).json({ message: 'Address must be under 400 characters' });
        }
        if (!owner_id || isNaN(owner_id)) {
            return res.status(400).json({ message: 'Valid owner ID required' });
        }

        // Check if owner exists and is a store_owner
        const [owner] = await db.query('SELECT * FROM users WHERE id = ? AND role = ?', [owner_id, 'store_owner']);
        if (owner.length === 0) {
            return res.status(400).json({ message: 'Invalid store owner' });
        }

        // Check if email exists
        const [existingStore] = await db.query('SELECT * FROM stores WHERE email = ?', [email]);
        if (existingStore.length > 0) {
            return res.status(400).json({ message: 'Store email already exists' });
        }

        // Insert store
        await db.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
            [name, email, address || null, owner_id]
        );

        res.status(201).json({ message: 'Store created successfully' });
    } catch (error) {
        console.error('Add store error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;

    try {
        let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
        const params = [];

        if (name) {
            query += ' AND name LIKE ?';
            params.push(`%${name}%`);
        }
        if (email) {
            query += ' AND email LIKE ?';
            params.push(`%${email}%`);
        }
        if (address) {
            query += ' AND address LIKE ?';
            params.push(`%${address}%`);
        }
        if (role) {
            query += ' AND role = ?';
            params.push(role);
        }

        query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;

        const [users] = await db.query(query, params);
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStores = async (req, res) => {
    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;

    try {
        let query = `
            SELECT s.id, s.name, s.email, s.address, AVG(r.rating) as rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [];

        if (name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }
        if (email) {
            query += ' AND s.email LIKE ?';
            params.push(`%${email}%`);
        }
        if (address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${address}%`);
        }

        query += ` GROUP BY s.id, s.name, s.email, s.address ORDER BY ${sortBy} ${order.toUpperCase()}`;

        const [stores] = await db.query(query, params);
        res.json(stores);
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

