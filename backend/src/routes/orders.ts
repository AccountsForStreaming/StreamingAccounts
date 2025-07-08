import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../config/firebase';
import { auth } from '../middleware/auth';
import type { Order, OrderItem, OrderFulfillment } from '../types';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

// Configure multer for file uploads (memory storage for Firebase)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send fulfillment email
const sendFulfillmentEmail = async (order: Order, fulfillment: OrderFulfillment) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.userEmail,
      subject: `Order #${order.id} - Account Details Delivered`,
      html: `
        <h2>Your Account Details Are Ready!</h2>
        <p>Dear Customer,</p>
        <p>Your order #${order.id} has been fulfilled. Here are your account details:</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Account Information</h3>
          <p><strong>Email:</strong> ${fulfillment.accountDetails.email}</p>
          <p><strong>Password:</strong> ${fulfillment.accountDetails.password}</p>
          ${fulfillment.accountDetails.additionalInfo ? `<p><strong>Additional Info:</strong> ${fulfillment.accountDetails.additionalInfo}</p>` : ''}
        </div>
        
        <p><strong>Important:</strong> Please change the password after your first login for security.</p>
        
        <p>If you have any questions, please contact our support team.</p>
        
        <p>Best regards,<br>StreamAccts Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending fulfillment email:', error);
    // Don't throw error - email failure shouldn't prevent fulfillment
  }
};

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

    const orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      const order: any = {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : data.createdAt,
        updatedAt: (data.updatedAt as any)?.toDate ? (data.updatedAt as any).toDate() : data.updatedAt,
      };

      // Convert fulfillment date if exists
      if (data.fulfillment && data.fulfillment.fulfilledAt) {
        order.fulfillment = {
          ...data.fulfillment,
          fulfilledAt: (data.fulfillment.fulfilledAt as any)?.toDate ? (data.fulfillment.fulfilledAt as any).toDate() : data.fulfillment.fulfilledAt,
        };
      }

      return order;
    }) as Order[];

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
      createdAt: (orderData.createdAt as any)?.toDate ? (orderData.createdAt as any).toDate() : orderData.createdAt,
      updatedAt: (orderData.updatedAt as any)?.toDate ? (orderData.updatedAt as any).toDate() : orderData.updatedAt,
    };

    // Convert fulfillment date if exists
    if (orderData.fulfillment && orderData.fulfillment.fulfilledAt) {
      order.fulfillment = {
        ...orderData.fulfillment,
        fulfilledAt: (orderData.fulfillment.fulfilledAt as any)?.toDate ? (orderData.fulfillment.fulfilledAt as any).toDate() : orderData.fulfillment.fulfilledAt,
      };
    }

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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Only add userMessage if it exists and is not empty
    if (userMessage && userMessage.trim()) {
      (orderData as any).userMessage = userMessage.trim();
    }

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

    const orders = ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      const order: any = {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as any)?.toDate ? (data.createdAt as any).toDate() : data.createdAt,
        updatedAt: (data.updatedAt as any)?.toDate ? (data.updatedAt as any).toDate() : data.updatedAt,
      };

      // Convert fulfillment date if exists
      if (data.fulfillment && data.fulfillment.fulfilledAt) {
        order.fulfillment = {
          ...data.fulfillment,
          fulfilledAt: (data.fulfillment.fulfilledAt as any)?.toDate ? (data.fulfillment.fulfilledAt as any).toDate() : data.fulfillment.fulfilledAt,
        };
      }

      return order;
    }) as Order[];

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
      adminResponse: adminResponse || '',
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

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update userMessage if it's provided and not empty
    if (userMessage !== undefined && userMessage !== null) {
      updateData.userMessage = userMessage;
    }

    await orderRef.update(updateData);

    res.json({ success: true, message: 'Message added to order' });
  } catch (error) {
    next(error);
  }
});

// Admin: Fulfill order
router.post('/admin/:id/fulfill', auth, upload.single('screenshot'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, additionalInfo, accountTested, notes } = req.body;
    const user = (req as any).user;

    // Debug log
    console.log('Fulfillment request:', {
      email,
      password: password ? '***' : 'missing',
      additionalInfo,
      accountTested,
      notes,
      hasScreenshot: !!req.file
    });

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    // Validate required fields
    if (!email || !password || !req.file || accountTested !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, screenshot, and account tested confirmation',
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

    const orderData = orderDoc.data() as Order;

    let screenshotUrl: string;
    
    try {
      // Try to upload screenshot to Firebase Storage
      const bucket = storage.bucket();
      const fileName = `screenshots/${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
      const file = bucket.file(fileName);
      
      console.log('Uploading to Firebase Storage:', fileName);
      
      // Upload the file
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Make the file publicly accessible
      await file.makePublic();

      // Get the public URL
      screenshotUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      console.log('✅ Firebase Storage upload successful:', screenshotUrl);
      
    } catch (storageError) {
      console.error('❌ Firebase Storage upload failed:', storageError);
      
      // Fallback: Save to local storage temporarily
      const fs = require('fs');
      const uploadDir = path.join(__dirname, '../../uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const localFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
      const localFilePath = path.join(uploadDir, localFileName);
      
      fs.writeFileSync(localFilePath, req.file.buffer);
      screenshotUrl = `/uploads/${localFileName}`;
      
      console.log('⚠️  Using local storage fallback:', screenshotUrl);
      console.log('⚠️  Please enable Firebase Storage at: https://console.firebase.google.com/project/streamingaccounts-f2501/storage');
    }

    // Create fulfillment data - only include fields that have values
    const fulfillmentData: OrderFulfillment = {
      accountDetails: {
        email,
        password,
        ...(additionalInfo && { additionalInfo }),
      },
      screenshotUrl,
      accountTested: true,
      fulfilledBy: user.uid,
      fulfilledAt: new Date(),
      ...(notes && { notes }),
    };

    // Update order with fulfillment data
    await orderRef.update({
      fulfillment: fulfillmentData,
      status: 'fulfilled',
      updatedAt: new Date(),
    });

    // Send email to customer
    const updatedOrder = { ...orderData, id, fulfillment: fulfillmentData };
    await sendFulfillmentEmail(updatedOrder, fulfillmentData);

    res.json({ 
      success: true, 
      message: 'Order fulfilled successfully and email sent to customer',
      data: fulfillmentData 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
