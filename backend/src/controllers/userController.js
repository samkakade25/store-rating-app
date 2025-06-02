import pool from '../db.js';

export const getStores = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, address, sortBy = 'name', order = 'asc' } = req.query;

        let query = `
            SELECT s.id, s.name, s.address,
                COALESCE(AVG(r.rating), 0) AS overall_rating,
                (
                    SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id
                ) AS user_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const params = [userId];
        let paramIndex = 2;

        if (name) {
            query += ` AND s.name ILIKE $${paramIndex++}`;
            params.push(`%${name}%`);
        }
        if (address) {
            query += ` AND s.address ILIKE $${paramIndex++}`;
            params.push(`%${address}%`);
        }

        query += ` GROUP BY s.id, s.name, s.address ORDER BY s.${sortBy} ${order.toUpperCase()}`;

        const stores = await pool.query(query, params);
        res.json(stores.rows);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Error fetching stores' });
    }
};

export const rateStore = async (req, res) => {
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
};
