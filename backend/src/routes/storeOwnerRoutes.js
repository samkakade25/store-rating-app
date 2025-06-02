import express from 'express';
import { default as authMiddleware } from '../middleware/authMiddleware.js';
import pool from '../db.js';
import { getStores, getRatings, addStore } from '../controllers/storeOwnerController.js';

const router = express.Router();

router.get('/stores', authMiddleware, getStores);

router.get('/ratings', authMiddleware, getRatings);

router.post('/stores', authMiddleware, addStore);

export default router;