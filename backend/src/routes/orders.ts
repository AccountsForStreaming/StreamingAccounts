import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { auth } from '../middleware/auth';
import type { Order, OrderItem } from '../types';

const router = Router();

// Get user orders
router.get('/user/:userId', auth, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = (req as any).user;

    // Ensure user can only access their own orders (unless admin)
    if (user.uid !== userId && !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const ordersSnapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Order[];

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const orderDoc = await db.collection('orders').doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const orderData = orderDoc.data() as Order;

    // Ensure user can only access their own orders (unless admin)
    if (orderData.userId !== user.uid && !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const order: Order = {
      ...orderData,
      id: orderDoc.id,
      createdAt: orderData.createdAt,
      updatedAt: orderData.updatedAt,
    };

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', auth, async (req, res, next) => {
  try {
    const { items, totalAmount, paymentMethod, paymentId, userMessage } = req.body;
    const user = (req as any).user;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items',
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount',
      });
    }

    if (!paymentMethod || !['stripe', 'paypal'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    // Create order data
    const orderId = uuidv4();
    const orderData: Omit<Order, 'id'> = {
      userId: user.uid,
      userEmail: user.email || '',
      items: items.map((item: any) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })) as OrderItem[],
      totalAmount,
      status: 'paid', // Since payment was already processed
      paymentMethod: paymentMethod as 'stripe' | 'paypal',
      paymentId,
      userMessage: userMessage || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to Firestore
    await db.collection('orders').doc(orderId).set(orderData);

    // Update product stock (if needed)
    const batch = db.batch();
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const currentStock = productDoc.data()?.stockCount || 0;
        const newStock = Math.max(0, currentStock - item.quantity);
        batch.update(productRef, { stockCount: newStock });
      }
    }
    await batch.commit();

    const order: Order = {
      id: orderId,
      ...orderData,
    };

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// Admin: Get all orders
router.get('/admin/all', auth, async (req, res, next) => {
  try {
    const user = (req as any).user;

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const ordersSnapshot = await db
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .get();

    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Order[];

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// Admin: Update order status
router.patch('/admin/:id/status', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = (req as any).user;

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const validStatuses = ['pending', 'paid', 'processing', 'fulfilled', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await orderRef.update({
      status,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
});

// Admin: Add response to user message
router.patch('/admin/:id/response', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminResponse } = req.body;
    const user = (req as any).user;

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await orderRef.update({
      adminResponse,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Admin response added' });
  } catch (error) {
    next(error);
  }
});

// User: Add message to order
router.patch('/:id/message', auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userMessage } = req.body;
    const user = (req as any).user;

    const orderRef = db.collection('orders').doc(id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    const orderData = orderDoc.data() as Order;

    // Ensure user can only update their own orders
    if (orderData.userId !== user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await orderRef.update({
      userMessage,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Message added to order' });
  } catch (error) {
    next(error);
  }
});

export default router;
