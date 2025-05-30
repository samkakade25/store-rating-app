import express from 'express';
import { signup, login, updatePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/password', authMiddleware, updatePassword);

export default router;