import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  markAttendance,
  getAttendanceByClass,
  getAttendanceByStudent,
  updateAttendance,
  getAttendanceReport,
} from '../controllers/attendanceController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Mark attendance (Teacher and Admin only)
router.post('/', requireRole(['TEACHER', 'ADMIN']), markAttendance);

// Get attendance by class (Teacher and Admin only)
router.get('/class/:classId', requireRole(['TEACHER', 'ADMIN']), getAttendanceByClass);

// Get attendance by student (Admin, Teacher, and the student themselves)
router.get('/student/:studentId', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getAttendanceByStudent);

// Update attendance (Teacher and Admin only)
router.put('/:id', requireRole(['TEACHER', 'ADMIN']), updateAttendance);

// Get attendance report (Teacher and Admin only)
router.get('/report/:classId', requireRole(['TEACHER', 'ADMIN']), getAttendanceReport);

export default router;
