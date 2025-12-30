import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';
import {
  createTimetableEntry,
  getTimetableByClass,
  getTimetableByTeacher,
  updateTimetableEntry,
  deleteTimetableEntry,
  getTodaySchedule,
} from '../controllers/timetableController';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create timetable entry (Admin only)
router.post('/', requireRole(Role.ADMIN), createTimetableEntry);

// Get timetable by class (All authenticated users)
router.get('/class/:classId', getTimetableByClass);

// Get timetable by teacher (All authenticated users)
router.get('/teacher/:teacherId', getTimetableByTeacher);

// Get today's schedule for a class (All authenticated users)
router.get('/today/:classId', getTodaySchedule);

// Update timetable entry (Admin only)
router.put('/:id', requireRole(['ADMIN']), updateTimetableEntry);

// Delete timetable entry (Admin only)
router.delete('/:id', requireRole(['ADMIN']), deleteTimetableEntry);

export default router;
