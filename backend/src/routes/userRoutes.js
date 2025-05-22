import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stores', authMiddleware, async (req, res) => {
    try {
        const stores = await pool.query(
            'SELECT * FROM stores ORDER BY name ASC'
        );
        res.json(stores.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Error fetching stores' });
    }
});

export default router;