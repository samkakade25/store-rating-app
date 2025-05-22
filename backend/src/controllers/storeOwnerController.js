import db from '../db.js';

export const addStore = async (req, res) => {
    const { name, email, address } = req.body;
    const owner_id = req.user.id;

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

        // Check if store email exists
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

export const getStores = async (req, res) => {
    const { name, email, address, sortBy = 'name', order = 'asc' } = req.query;
    const owner_id = req.user.id;

    try {
        let query = `
            SELECT s.id, s.name, s.email, s.address, AVG(r.rating) as rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE s.owner_id = ?
        `;
        const params = [owner_id];

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

export const getRatings = async (req, res) => {
    const owner_id = req.user.id;

    try {
        const [ratings] = await db.query(
            `
            SELECT r.id, r.store_id, r.user_id, r.rating, r.created_at, s.name as store_name
            FROM ratings r
            JOIN stores s ON r.store_id = s.id
            WHERE s.owner_id = ?
            ORDER BY r.created_at DESC
            `,
            [owner_id]
        );
        res.json(ratings);
    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};