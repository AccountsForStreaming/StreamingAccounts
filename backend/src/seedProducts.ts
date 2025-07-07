import { db } from './config/firebase';

const sampleProducts = [
  {
    name: 'Netflix Premium Account',
    description: 'Netflix Premium subscription with 4K streaming and up to 4 devices. Valid for 1 month.',
    price: 15.99,
    stockCount: 10,
    category: 'Streaming',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Spotify Premium Account',
    description: 'Spotify Premium with ad-free music streaming and offline downloads. Valid for 1 month.',
    price: 9.99,
    stockCount: 15,
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Disney+ Premium Account',
    description: 'Disney+ Premium with access to Disney, Marvel, Star Wars, and National Geographic content. Valid for 1 month.',
    price: 12.99,
    stockCount: 8,
    category: 'Streaming',
    imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'YouTube Premium Account',
    description: 'YouTube Premium with ad-free videos, YouTube Music, and offline downloads. Valid for 1 month.',
    price: 11.99,
    stockCount: 12,
    category: 'Streaming',
    imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Amazon Prime Video Account',
    description: 'Amazon Prime Video with access to thousands of movies and TV shows. Valid for 1 month.',
    price: 8.99,
    stockCount: 6,
    category: 'Streaming',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Apple Music Account',
    description: 'Apple Music with access to over 100 million songs and exclusive content. Valid for 1 month.',
    price: 10.99,
    stockCount: 9,
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedProducts() {
  try {
    console.log('Seeding products...');
    
    // Check if products already exist
    const existingProducts = await db.collection('products').limit(1).get();
    if (!existingProducts.empty) {
      console.log('Products already exist. Skipping seed.');
      return;
    }

    // Add products to Firestore
    const batch = db.batch();
    
    sampleProducts.forEach((product) => {
      const docRef = db.collection('products').doc();
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log(`Successfully seeded ${sampleProducts.length} products!`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedProducts().then(() => {
    console.log('Seeding completed.');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

export { seedProducts };
