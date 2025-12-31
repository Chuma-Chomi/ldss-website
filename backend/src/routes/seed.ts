import { Router } from 'express';
import { seedDatabase } from '../controllers/seedController';

const router = Router();

// POST /api/seed - Seed the database
router.post('/', seedDatabase);

export default router;
