import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import {
  createGrade,
  getGradesByStudent,
  getGradesByClass,
  updateGrade,
  deleteGrade,
  getStudentReport,
} from '../controllers/gradeController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create grade (Teacher and Admin only)
router.post('/', requireRole(['TEACHER', 'ADMIN']), createGrade);

// Get grades by student (Admin, Teacher, and the student themselves)
router.get('/student/:studentId', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getGradesByStudent);

// Get grades by class (Teacher and Admin only)
router.get('/class/:classId', requireRole(['TEACHER', 'ADMIN']), getGradesByClass);

// Get student report (Admin, Teacher, and the student themselves)
router.get('/report/:studentId', requireRole(['ADMIN', 'TEACHER', 'STUDENT']), getStudentReport);

// Update grade (Teacher and Admin only)
router.put('/:id', requireRole(['TEACHER', 'ADMIN']), updateGrade);

// Delete grade (Teacher and Admin only)
router.delete('/:id', requireRole(['TEACHER', 'ADMIN']), deleteGrade);

export default router;
