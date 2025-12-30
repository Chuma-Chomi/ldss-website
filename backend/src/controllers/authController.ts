import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';

// User types based on ID patterns
interface UserIdentity {
  id: string;
  role: 'ADMIN' | 'STAFF' | 'LEARNER';
  departmentId?: string;
  name: string;
}

// JWT Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Determine user identity based on ID pattern
function determineUserIdentity(identifier: string): UserIdentity | null {
  // Admin: TS Number == 202501
  if (identifier === '202501') {
    return {
      id: '202501',
      role: 'ADMIN',
      departmentId: 'admin-dept',
      name: 'Administrator'
    };
  }

  // Staff: TS Number pattern starting with 2025001
  if (identifier.startsWith('2025001') && identifier.length >= 7) {
    return {
      id: identifier,
      role: 'STAFF',
      departmentId: 'staff-dept',
      name: `Staff ${identifier}`
    };
  }

  // Learner: Learner ID pattern (e.g., 202500123456)
  if (identifier.startsWith('2025') && identifier.length >= 12) {
    return {
      id: identifier,
      role: 'LEARNER',
      departmentId: 'learner-dept',
      name: `Learner ${identifier}`
    };
  }

  return null;
}

// Verify password based on role
async function verifyPassword(role: string, password: string): Promise<boolean> {
  const rolePasswords = {
    'ADMIN': 'LDSSadmin123',
    'STAFF': 'LDSSstaff123',
    'LEARNER': 'LDSS2025'
  };

  const expectedPassword = rolePasswords[role as keyof typeof rolePasswords];
  if (!expectedPassword) return false;

  return password === expectedPassword;
}

// Generate JWT token
function generateJWT(user: UserIdentity): string {
  const payload = {
    id: user.id,
    role: user.role,
    departmentId: user.departmentId,
    name: user.name
  };

  const secret = process.env.JWT_SECRET || 'super-secret-ldss-key';
  console.log('Generating JWT with secret:', secret);
  return jwt.sign(payload, secret, {
    expiresIn: '24h'
  });
}

// Login endpoint
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  // Validate input
  if (!identifier || !password) {
    throw new ApiError(400, 'Identifier and password are required');
  }

  // Determine user identity based on ID pattern
  const user = determineUserIdentity(identifier);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials - User not found');
  }

  // Verify password
  const isPasswordValid = await verifyPassword(user.role, password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials - Incorrect password');
  }

  // Generate JWT token
  const token = generateJWT(user);

  // Set HttpOnly cookie with JWT (for backup)
  res.cookie('jwt', token, COOKIE_OPTIONS);

  // Return user info and token (for localStorage)
  const responseData = {
    success: true,
    token: token,
    user: {
      id: user.id,
      role: user.role,
      departmentId: user.departmentId,
      name: user.name
    },
    message: 'Login successful'
  };
  res.json(responseData);
});

// Logout endpoint
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Clear the JWT cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user (for token validation)
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // User is attached to request by auth middleware
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(401, 'User not authenticated');
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      role: user.role,
      departmentId: user.departmentId,
      name: user.name
    }
  });
});

// Refresh token endpoint
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user) {
    throw new ApiError(401, 'User not authenticated');
  }

  // Generate new token
  const newToken = generateJWT({
    id: user.id,
    role: user.role,
    departmentId: user.departmentId,
    name: user.name
  });

  // Set new cookie
  res.cookie('jwt', newToken, COOKIE_OPTIONS);

  res.json({
    success: true,
    message: 'Token refreshed successfully'
  });
});
