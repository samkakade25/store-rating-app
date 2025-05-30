import express from 'express';
import { getDashboard, addUser, addStore, getUsers, getStores } from '../controllers/adminController.js';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';
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
router.post('/users', authMiddleware, adminMiddleware, addUser);
router.post('/stores', authMiddleware, adminMiddleware, addStore);
router.get('/users', authMiddleware, adminMiddleware, getUsers);
router.get('/stores', authMiddleware, adminMiddleware, getStores);

export default router;