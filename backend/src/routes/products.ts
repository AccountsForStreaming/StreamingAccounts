import { Router } from 'express';
import { db } from '../config/firebase';
import { auth, admin } from '../middleware/auth';
import type { Product } from '../types';

const router = Router();

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const productsSnapshot = await db
      .collection('products')
      .get();

    const products = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Handle date conversion safely
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
      };
    }) as Product[];

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDoc = await db.collection('products').doc(id).get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const productData = productDoc.data();
    const product: Product = {
      id: productDoc.id,
      ...productData,
      createdAt: productData?.createdAt.toDate(),
      updatedAt: productData?.updatedAt.toDate(),
    } as Product;

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post('/', auth, admin, async (req, res, next) => {
  try {
    const { name, description, price, stockCount, category, imageUrl } = req.body;

    // Validate input
    if (!name || !description || !price || !stockCount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const productData: Omit<Product, 'id'> = {
      name,
      description,
      price: parseFloat(price),
      stockCount: parseInt(stockCount),
      category,
      imageUrl: imageUrl || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('products').add(productData);
    
    const product: Product = {
      id: docRef.id,
      ...productData,
    };

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Update product (admin only)
router.put('/:id', auth, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Remove read-only fields
    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date();

    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await productRef.update(updateData);

    const updatedDoc = await productRef.get();
    const product: Product = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      createdAt: updatedDoc.data()?.createdAt.toDate(),
      updatedAt: updatedDoc.data()?.updatedAt.toDate(),
    } as Product;

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', auth, admin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const productRef = db.collection('products').doc(id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete by setting isActive to false
    await productRef.update({ 
      isActive: false,
      updatedAt: new Date(),
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
