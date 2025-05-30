import express from 'express';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

// Get all stores with overall rating and user's submitted rating
router.get('/stores', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const stores = await pool.query(
            `SELECT s.id, s.name, s.address,
                COALESCE(AVG(r.rating), 0) AS overall_rating,
                (
                    SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id
                ) AS user_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id, s.name, s.address
            ORDER BY s.name ASC`,
            [userId]
        );
        res.json(stores.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Error fetching stores' });
    }
});

// Submit or update a rating for a store
router.post('/stores/:storeId/rate', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { storeId } = req.params;
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    try {
        // Upsert rating
        await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, store_id)
             DO UPDATE SET rating = EXCLUDED.rating`,
            [userId, storeId, rating]
        );
        res.json({ message: 'Rating submitted' });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Error submitting rating' });
    }
});

export default router;