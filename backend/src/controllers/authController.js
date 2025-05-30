import bcrypt from 'bcryptjsjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { body, validationResult } from 'express-validator';


export const signup = async (req, res) => {
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
        if (!['user', 'store_owner'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Only user or store_owner allowed' });
        }

        // Check if email exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await pool.query(
            'INSERT INTO users (name, email, address, password, role) VALUES ($1, $2, $3, $4, $5)',
            [name, email, address || null, hashedPassword, role]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

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