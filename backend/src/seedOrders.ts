import { v4 as uuidv4 } from 'uuid';
import { db } from './config/firebase';
import type { Order } from './types';

const seedOrders = async () => {
  try {
    console.log('Starting to seed orders...');

    // Get existing products to reference
    const productsSnapshot = await db.collection('products').limit(3).get();
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (products.length === 0) {
      console.log('No products found. Please seed products first.');
      return;
    }

    // Create test user ID (you'll need to replace this with actual user IDs)
    const testUserId1 = 'test-user-1';
    const testUserId2 = 'test-user-2';

    const testOrders: Omit<Order, 'id'>[] = [
      {
        userId: testUserId1,
        userEmail: 'user1@example.com',
        items: [
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 1,
            unitPrice: products[0].price,
            totalPrice: products[0].price,
          },
        ],
        totalAmount: products[0].price,
        status: 'paid',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_1234567890',
        userMessage: 'Hi! I just purchased this account. When will I receive the login details? Thanks!',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: testUserId2,
        userEmail: 'user2@example.com',
        items: [
          {
            productId: products[1].id,
            productName: products[1].name,
            quantity: 2,
            unitPrice: products[1].price,
            totalPrice: products[1].price * 2,
          },
        ],
        totalAmount: products[1].price * 2,
        status: 'processing',
        paymentMethod: 'paypal',
        paymentId: 'PAYID-EXAMPLE123',
        userMessage: 'I need these accounts ASAP for my project. Please prioritize my order.',
        adminResponse: 'Your order is being processed. You will receive the accounts within 24 hours.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        userId: testUserId1,
        userEmail: 'user1@example.com',
        items: [
          {
            productId: products[2].id,
            productName: products[2].name,
            quantity: 1,
            unitPrice: products[2].price,
            totalPrice: products[2].price,
          },
        ],
        totalAmount: products[2].price,
        status: 'fulfilled',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_9876543210',
        userMessage: 'Thank you for the quick delivery!',
        adminResponse: 'You\'re welcome! Enjoy your new account. Contact us if you need any help.',
        deliveredAccounts: [
          {
            productId: products[2].id,
            credentials: {
              email: 'delivered.account@example.com',
              password: 'SecurePass123!',
              additionalInfo: 'Account includes premium features. Change password after first login.',
            },
            deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          },
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        userId: testUserId2,
        userEmail: 'user2@example.com',
        items: [
          {
            productId: products[0].id,
            productName: products[0].name,
            quantity: 1,
            unitPrice: products[0].price,
            totalPrice: products[0].price,
          },
          {
            productId: products[1].id,
            productName: products[1].name,
            quantity: 1,
            unitPrice: products[1].price,
            totalPrice: products[1].price,
          },
        ],
        totalAmount: products[0].price + products[1].price,
        status: 'pending',
        paymentMethod: 'stripe',
        paymentId: 'pi_test_pending123',
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ];

    // Add orders to Firestore
    const batch = db.batch();
    
    for (const orderData of testOrders) {
      const orderId = uuidv4();
      const orderRef = db.collection('orders').doc(orderId);
      batch.set(orderRef, orderData);
      console.log(`Added order: ${orderId}`);
    }

    await batch.commit();
    console.log('✅ Successfully seeded test orders!');
    
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
  }
};

// Run the seeding function
seedOrders().then(() => {
  console.log('Seeding completed');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
