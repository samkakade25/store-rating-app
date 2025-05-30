import express from 'express';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

router.get('/stores', authMiddleware, async (req, res) => {
    try {
        const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;
        const userId = req.user.id;

        let query = `SELECT s.*, COALESCE(AVG(r.rating), 0) AS average_rating
                     FROM stores s
                     LEFT JOIN ratings r ON s.id = r.store_id
                     WHERE s.owner_id = $1`;
        const values = [userId];
        let valueIndex = 2;

        if (name) {
            values.push(`%${name}%`);
            query += ` AND s.name ILIKE $${valueIndex++}`;
        }
        if (email) {
            values.push(`%${email}%`);
            query += ` AND s.email ILIKE $${valueIndex++}`;
        }
        if (address) {
            values.push(`%${address}%`);
            query += ` AND s.address ILIKE $${valueIndex++}`;
        }

        query += ` GROUP BY s.id ORDER BY s.${sortBy} ${order.toUpperCase()}`;
        const stores = await pool.query(query, values);
        res.json(stores.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Error fetching stores' });
    }
});

router.get('/ratings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const ratings = await pool.query(
            `SELECT r.*, s.name as store_name 
             FROM ratings r 
             JOIN stores s ON r.store_id = s.id 
             WHERE s.owner_id = $1 
             ORDER BY r.created_at DESC`,
            [userId]
        );
        res.json(ratings.rows);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ message: 'Error fetching ratings' });
    }
});

router.post('/stores', authMiddleware, async (req, res) => {
    const { name, email, address } = req.body;
    const ownerId = req.user.id;

    // Basic validation (customize as needed)
    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Store name must be 20-60 characters' });
    }
    if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (address && address.length > 400) {
        return res.status(400).json({ message: 'Address must be under 400 characters' });
    }

    try {
        // Check if email exists
        const existingStore = await pool.query('SELECT * FROM stores WHERE email = $1', [email]);
        if (existingStore.rows.length > 0) {
            return res.status(400).json({ message: 'Store email already exists' });
        }

        // Insert store
        await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)',
            [name, email, address || null, ownerId]
        );

        res.status(201).json({ message: 'Store created successfully' });
    } catch (error) {
        console.error('Error adding store:', error);
        res.status(500).json({ message: 'Error adding store' });
    }
});

export default router;