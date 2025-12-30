import { Router } from 'express';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  listAnnouncements,
  updateAnnouncement,
} from '../controllers/announcementController';
import { authenticate, requireRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.get('/', listAnnouncements);
router.get('/:id', getAnnouncement);
router.post('/', requireRole([Role.ADMIN, Role.TEACHER]), createAnnouncement);
router.put('/:id', requireRole([Role.ADMIN, Role.TEACHER]), updateAnnouncement);
router.delete('/:id', requireRole(Role.ADMIN), deleteAnnouncement);

export default router;
