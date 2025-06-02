import express from 'express';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';
import { getStores, rateStore } from '../controllers/userController.js';

const router = express.Router();

// Get all stores with overall rating and user's submitted rating
router.get('/stores', authMiddleware, getStores);

// Submit or update a rating for a store
router.post('/stores/:storeId/rate', authMiddleware, rateStore);

export default router;