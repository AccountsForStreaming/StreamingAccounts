import { Router } from 'express';
import { auth, db } from '../config/firebase';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Verify token endpoint
router.post('/verify', async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw createError('Token is required', 400);
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    // Get or create user document
    const userRef = db.collection('users').doc(decodedToken.uid);
    const userDoc = await userRef.get();
    
    let userData;
    if (!userDoc.exists) {
      // Create new user document
      userData = {
        email: decodedToken.email,
        displayName: decodedToken.name || '',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
    }

    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: userData?.displayName || decodedToken.name,
        isAdmin: userData?.isAdmin || false,
      },
    });
  } catch (error: any) {
    next(createError('Invalid token', 401));
  }
});

// Set custom claims (admin only)
router.post('/set-claims', async (req, res, next) => {
  try {
    const { uid, claims } = req.body;
    
    // This should be protected and only callable by existing admins
    // For now, we'll allow it for initial setup
    await auth.setCustomUserClaims(uid, claims);
    
    res.json({
      success: true,
      message: 'Custom claims set successfully',
    });
  } catch (error: any) {
    next(createError('Failed to set custom claims', 500));
  }
});

export default router;
