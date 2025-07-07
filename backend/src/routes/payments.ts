import { Router } from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth';

const router = Router();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create Stripe payment intent
router.post('/stripe/create-intent', auth, async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: (req as any).user.uid,
      },
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Create PayPal order
router.post('/paypal/create-order', auth, async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // For now, return a mock response
    // In a real implementation, you would use PayPal SDK
    res.json({
      success: true,
      data: {
        orderID: `paypal_${Date.now()}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
