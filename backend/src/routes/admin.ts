import { Router } from 'express';
import { 
  createUser,
  getAllUsers, 
  getUsersByRole, 
  deleteUser, 
  getSystemStats, 
  updateUserStatus 
} from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all admin routes
router.use(authenticate);

// Get system statistics
router.get('/stats', getSystemStats);

// Create new user
router.post('/users', createUser);

// Get all users
router.get('/users', getAllUsers);

// Get users by role
router.get('/users/role/:role', getUsersByRole);

// Update user status
router.patch('/users/:userId/status', updateUserStatus);

// Delete user
router.delete('/users/:userId', deleteUser);

export default router;
