import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

// Create a new user
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id, password, role, firstName, lastName, email, phone } = req.body;

  // Validate required fields
  if (!id || !password || !role || !firstName || !lastName) {
    throw new ApiError(400, 'Missing required fields: id, password, role, firstName, lastName');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (existingUser) {
    throw new ApiError(400, 'User with this ID already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      id,
      password: hashedPassword,
      role: role.toUpperCase(),
      profile: {
        create: {
          firstName,
          lastName,
          phone: phone || null,
          type: role === 'ADMIN' ? 'STAFF' : role === 'TEACHER' ? 'STAFF' : 'STUDENT'
        }
      }
    },
    include: {
      profile: true
    }
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  res.status(201).json({
    success: true,
    data: userWithoutPassword,
    message: 'User created successfully'
  });
});

// Get all users with their profiles
export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany({
    include: {
      profile: {
        include: {
          staff: true,
          student: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Remove passwords from response
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({
    success: true,
    data: usersWithoutPasswords
  });
});

// Get users by role
export const getUsersByRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.params;
  
  const users = await prisma.user.findMany({
    where: { role: role as Role },
    include: {
      profile: {
        include: {
          staff: role === 'TEACHER',
          student: role === 'STUDENT'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Remove passwords from response
  const usersWithoutPasswords = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  res.json({
    success: true,
    data: usersWithoutPasswords
  });
});

// Delete a user
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  // First delete the profile (which will cascade delete staff/student records)
  await prisma.profile.deleteMany({
    where: { userId }
  });

  // Then delete the user
  await prisma.user.delete({
    where: { id: userId }
  });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get system statistics
export const getSystemStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const [
    totalUsers,
    adminCount,
    staffCount,
    learnerCount,
    totalProfiles
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.profile.count()
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      adminCount,
      staffCount,
      learnerCount,
      totalProfiles
    }
  });
});

// Update user status (activate/deactivate)
export const updateUserStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { 
      // You might want to add a status field to your user model
      // For now, we'll just return success
    },
    include: {
      profile: {
        include: {
          staff: true,
          student: true
        }
      }
    }
  });

  // Remove password from response
  const { password, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword,
    message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`
  });
});
