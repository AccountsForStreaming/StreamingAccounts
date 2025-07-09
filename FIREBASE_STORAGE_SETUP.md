# Firebase Storage Setup Guide

## 1. Enable Firebase Storage

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Navigate to **Build** > **Storage**
4. Click **Get started**
5. Choose your security rules (start in test mode for now)
6. Select a Cloud Storage location (choose the same region as your Firestore)

## 2. Configure Storage Rules

Replace the default rules in the Firebase Console with these production-ready rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload product images
    match /products/{imageId} {
      allow read: if true; // Anyone can read product images
      allow write: if request.auth != null 
                   && request.auth.token.admin == true // Only admins can upload
                   && isValidImage(resource, request.resource);
    }
    
    // Helper function to validate image uploads
    function isValidImage(existingResource, newResource) {
      return newResource.size <= 5 * 1024 * 1024 // Max 5MB
             && newResource.contentType.matches('image/.*'); // Only images
    }
  }
}
```

## 3. Set Admin Claims (Backend)

Add this to your backend to set admin claims for users who should be able to upload images:

```typescript
// In your backend, add this function to set admin claims
import { auth } from 'firebase-admin/auth';

export async function setAdminClaim(uid: string, isAdmin: boolean = true) {
  try {
    await auth().setCustomUserClaims(uid, { admin: isAdmin });
    console.log(`Admin claim set for user ${uid}: ${isAdmin}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    throw error;
  }
}

// Call this for your admin users:
// setAdminClaim('your-admin-user-uid', true);
```

## 4. Environment Variables

Make sure your `.env` file has the storage bucket:

```env
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

## 5. Temporary Development Rules (For Testing)

If you want to test without admin claims first, use these temporary rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{imageId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size <= 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

**⚠️ Important**: Change to production rules with admin claims before going live!

## 6. Storage Structure

Your uploaded images will be stored with this structure:

```
gs://your-project.appspot.com/
└── products/
    ├── new_1641234567890_abc123.jpg
    ├── product-456_1641234567891_def456.png
    └── ...
```

## 7. CORS Configuration (If Needed)

If you encounter CORS issues, configure your storage bucket:

```bash
# Install Google Cloud SDK first
gsutil cors set cors.json gs://your-project.appspot.com
```

Create `cors.json`:
```json
[
  {
    "origin": ["https://your-domain.com", "http://localhost:5173"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## 8. Testing the Upload

1. Deploy your changes
2. Go to the admin panel
3. Try adding a new product with an image
4. Check Firebase Storage console to see the uploaded image
5. Verify the image displays correctly in your product list

## Features Included

✅ **Drag & Drop Upload**: Easy image selection  
✅ **Progress Indicator**: Real-time upload progress  
✅ **Image Validation**: File type and size validation  
✅ **Auto Resize**: Large images are automatically resized  
✅ **Preview**: Instant image preview  
✅ **Error Handling**: Clear error messages  
✅ **Security**: Proper Firebase Storage rules  
✅ **Cleanup**: Old images are deleted when replaced  

## Next Steps

1. Set up Firebase Storage (steps 1-2)
2. Configure admin claims for your user account
3. Test the image upload functionality
4. Switch to production storage rules
5. Monitor storage usage in Firebase Console

Your product images will now be stored securely in Firebase Storage with proper access controls!
