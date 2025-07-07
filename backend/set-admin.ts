// Quick script to make a user admin
// Run this with: npx tsx set-admin.ts

import { initializeFirebase, auth, db } from './src/config/firebase';

const setAdminStatus = async () => {
  try {
    // Initialize Firebase
    initializeFirebase();
    
    // Get the email from command line argument or use default
    const email = process.argv[2] || 'test@example.com';
    
    console.log(`Setting admin status for: ${email}`);
    
    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    console.log(`Found user: ${userRecord.uid}`);
    
    // Set custom claims to make them admin
    await auth.setCustomUserClaims(userRecord.uid, { isAdmin: true });
    console.log('✅ Admin claims set successfully!');
    
    // Also update the user document in Firestore
    await db.collection('users').doc(userRecord.uid).update({
      isAdmin: true,
      updatedAt: new Date()
    });
    console.log('✅ User document updated in Firestore!');
    
    console.log(`\n🎉 ${email} is now an admin!`);
    console.log('👤 They may need to log out and log back in for changes to take effect.');
    
  } catch (error) {
    console.error('❌ Error setting admin status:', error);
  }
  
  process.exit(0);
};

setAdminStatus();
