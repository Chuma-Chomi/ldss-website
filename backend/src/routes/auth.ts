import { Router } from 'express';
import { login, logout, getCurrentUser, refreshToken } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.post('/refresh', authenticate, refreshToken);

export default router;
