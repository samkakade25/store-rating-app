import express from 'express';
import { getDashboard, addUser, addStore, getUsers, getStores } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import pool from '../db.js';

const router = express.Router();

// Middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Admin routes
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboard);
router.post('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, address, password, role } = req.body;
        
        // Validate input
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into database
        const result = await pool.query(
            'INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, email, address, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});
router.post('/stores', authMiddleware, adminMiddleware, addStore);
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', order = 'asc' } = req.query;
        
        // Validate sortBy to prevent SQL injection
        const allowedSortFields = ['name', 'email', 'role', 'created_at'];
        if (!allowedSortFields.includes(sortBy)) {
            return res.status(400).json({ message: 'Invalid sort field' });
        }

        let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
        const values = [];
        
        if (name) {
            values.push(`%${name}%`);
            query += ` AND name ILIKE $${values.length}`;
        }
        
        if (email) {
            values.push(`%${email}%`);
            query += ` AND email ILIKE $${values.length}`;
        }
        
        if (address) {
            values.push(`%${address}%`);
            query += ` AND address ILIKE $${values.length}`;
        }
        
        if (role) {
            values.push(role);
            query += ` AND role = $${values.length}`;
        }
        
        query += ` ORDER BY ${sortBy} ${order.toUpperCase()} LIMIT 100`;
        
        console.log('Executing query:', query); // Debug log
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});
router.get('/stores', authMiddleware, adminMiddleware, getStores);

export default router;