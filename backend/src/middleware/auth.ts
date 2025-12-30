import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
  departmentId?: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-ldss-key';
console.log('Auth middleware using JWT_SECRET:', JWT_SECRET);

// Extract JWT from HttpOnly cookie or Authorization header
function extractJWT(req: Request): string | null {
  // First check HttpOnly cookie (preferred)
  const cookieToken = req.cookies?.jwt;
  if (cookieToken) return cookieToken;
  
  // Fallback to Authorization header (for localStorage tokens)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

// Authentication middleware
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractJWT(req);
    console.log('🔐 Auth middleware - Token extracted:', !!token, 'Length:', token?.length);
    console.log('🔐 Auth middleware - Path:', req.path);
    console.log('🔐 Auth middleware - Has cookie:', !!req.cookies?.jwt);
    console.log('🔐 Auth middleware - Has auth header:', !!req.headers.authorization);

    if (!token) {
      console.log('❌ Auth middleware - No token found');
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided' 
      });
    }

    // Verify JWT token
    console.log('🔐 Auth middleware - Verifying token with secret:', JWT_SECRET.substring(0, 10) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    console.log('✅ Auth middleware - Token verified successfully:', decoded.id, decoded.role);
    
    // Attach user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware - Error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('❌ Auth middleware - JsonWebTokenError:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      console.log('❌ Auth middleware - TokenExpiredError');
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    } else {
      console.log('❌ Auth middleware - Unknown error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Authentication error' 
      });
    }
  }
};

// Map auth roles to Prisma roles
const mapAuthRoleToPrismaRole = (authRole: string): string => {
  const roleMap: Record<string, string> = {
    'ADMIN': 'ADMIN',
    'STAFF': 'TEACHER',
    'LEARNER': 'STUDENT'
  };
  return roleMap[authRole] || authRole;
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const allowedRolesUpper = allowedRoles.map(r => r.toUpperCase());

  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    // Map the user's auth role to Prisma role for comparison
    const userPrismaRole = mapAuthRoleToPrismaRole(req.user.role);
    const userRoleUpper = userPrismaRole.toUpperCase();

    // Check if user role matches any allowed role
    if (!allowedRolesUpper.includes(userRoleUpper)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Admin-specific middleware (TS Number must be 202501)
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN' || req.user.id !== '202501') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    });
  }
  next();
};

// Staff-specific middleware (TS Number must start with 2025001)
export const requireStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'STAFF' || !req.user.id.startsWith('2025001')) {
    return res.status(403).json({ 
      success: false,
      message: 'Staff access required' 
    });
  }
  next();
};

// Learner-specific middleware (Learner ID must start with 2025 and be 12+ digits)
export const requireLearner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'LEARNER' || !req.user.id.startsWith('2025') || req.user.id.length < 12) {
    return res.status(403).json({ 
      success: false,
      message: 'Learner access required' 
    });
  }
  next();
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractJWT(req);
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};
