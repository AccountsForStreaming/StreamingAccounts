import { Request, Response, NextFunction } from 'express';
import { auth as firebaseAuth } from '../config/firebase';
import { createError } from './errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    isAdmin: boolean;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Get user document to check admin status
    const userDoc = await firebaseAuth.getUser(decodedToken.uid);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      isAdmin: userDoc.customClaims?.isAdmin || false,
    };

    next();
  } catch (error: any) {
    next(createError('Invalid or expired token', 401));
  }
};

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return next(createError('Admin access required', 403));
  }
  next();
};

// Export aliases
export const auth = authMiddleware;
export const admin = adminMiddleware;
