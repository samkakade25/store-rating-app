import express from 'express';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

router.get('/stores', authMiddleware, async (req, res) => {
    try {
        const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;
        const userId = req.user.id;

        let query = 'SELECT * FROM stores WHERE owner_id = $1';
        const values = [userId];
        let valueIndex = 2;

        if (name) {
            values.push(`%${name}%`);
            query += ` AND name ILIKE $${valueIndex++}`;
        }
        if (email) {
            values.push(`%${email}%`);
            query += ` AND email ILIKE $${valueIndex++}`;
        }
        if (address) {
            values.push(`%${address}%`);
            query += ` AND address ILIKE $${valueIndex++}`;
        }

        query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
        
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

export default router;