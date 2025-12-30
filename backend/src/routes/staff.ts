import { Router } from 'express';
import {
  createStaff,
  deleteStaff,
  getStaff,
  listStaff,
  updateStaff,
  markAttendance,
  getAttendance,
  getStaffClasses,
  submitGrades,
} from '../controllers/staffController';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Staff management
router.get('/', requireRole([Role.ADMIN, Role.TEACHER]), listStaff);
router.get('/:id', requireRole([Role.ADMIN, Role.TEACHER]), getStaff);
router.post('/', requireRole(Role.ADMIN), createStaff);
router.put('/:id', requireRole(Role.ADMIN), updateStaff);
router.delete('/:id', requireRole(Role.ADMIN), deleteStaff);

// Functional staff operations - STAFF role maps to TEACHER
router.post('/attendance/mark', requireRole(['TEACHER', 'STAFF']), markAttendance);
router.get('/attendance/:classId/:date', requireRole(['TEACHER', 'STAFF']), getAttendance);
router.get('/classes/my-classes', requireRole(['TEACHER', 'STAFF']), getStaffClasses);
router.post('/grades/submit', requireRole(['TEACHER', 'STAFF']), submitGrades);

export default router;
