import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudent,
  listStudents,
  updateStudent,
} from '../controllers/studentController';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.get('/', requireRole([Role.ADMIN, Role.TEACHER]), listStudents);
router.get('/:id', requireRole([Role.ADMIN, Role.TEACHER]), getStudent);
router.post('/', requireRole(Role.ADMIN), createStudent);
router.put('/:id', requireRole(Role.ADMIN), updateStudent);
router.delete('/:id', requireRole(Role.ADMIN), deleteStudent);

export default router;
