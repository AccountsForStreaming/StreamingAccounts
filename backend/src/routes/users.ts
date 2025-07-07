import { Router } from 'express';

const router = Router();

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

export default router;
