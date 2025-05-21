import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { body, validationResult } from 'express-validator';


export const signup = [
    body('name').isLength({ min: 20, max: 60 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('password').isLength({ min: 8, max: 16}).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { name, email, address, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                `INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
            [name, email, hashedPassword, address, 'user']
        );
            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ token, user });
        } catch (error) {
            res.status(500).json({ message: 'Error signing up' });
        }
    }
];

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error){
        res.status(500).json({ message: 'Error logging in' });
    }
};

export const updatePassword = [
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() });

        const { password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('UPDATE users SET password = $1 WHERE id = $2',[hashedPassword, req.user.id]);
            res.json({ message: 'Password updated' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating password' });
        }
    }
];