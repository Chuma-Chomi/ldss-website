import { Router } from 'express';
import {
  createClass,
  deleteClass,
  getClass,
  listClasses,
  updateClass,
} from '../controllers/classController';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.get('/', requireRole([Role.ADMIN, Role.TEACHER]), listClasses);
router.get('/:id', requireRole([Role.ADMIN, Role.TEACHER]), getClass);
router.post('/', requireRole(Role.ADMIN), createClass);
router.put('/:id', requireRole(Role.ADMIN), updateClass);
router.delete('/:id', requireRole(Role.ADMIN), deleteClass);

export default router;
