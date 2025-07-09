import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

export interface UploadProgress {
  progress: number;
  isComplete: boolean;
  error?: string;
  downloadURL?: string;
}

export class ImageUploadService {
  /**
   * Upload an image to Firebase Storage
   * @param file - The image file to upload
   * @param path - Storage path (e.g., 'products/product-123.jpg')
   * @returns Promise with download URL
   */
  static async uploadImage(file: File, path: string): Promise<string> {
    try {
      // Validate file type
      if (!this.isValidImageFile(file)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images only.');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please upload images smaller than 5MB.');
      }

      // Create storage reference
      const imageRef = ref(storage, path);

      // Upload file
      const snapshot = await uploadBytes(imageRef, file, {
        contentType: file.type,
      });

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload image with progress tracking
   * @param file - The image file to upload
   * @param path - Storage path
   * @param onProgress - Progress callback
   * @returns Promise with download URL
   */
  static async uploadImageWithProgress(
    file: File, 
    path: string, 
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate file
      if (!this.isValidImageFile(file)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images only.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please upload images smaller than 5MB.');
      }

      onProgress?.({ progress: 0, isComplete: false });

      // Create storage reference
      const imageRef = ref(storage, path);

      // For now, we'll simulate progress since uploadBytes doesn't provide progress
      // In a real implementation, you'd use uploadBytesResumable
      onProgress?.({ progress: 50, isComplete: false });

      // Upload file
      const snapshot = await uploadBytes(imageRef, file, {
        contentType: file.type,
      });

      onProgress?.({ progress: 90, isComplete: false });

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      onProgress?.({ progress: 100, isComplete: true, downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onProgress?.({ progress: 0, isComplete: false, error: errorMessage });
      throw error;
    }
  }

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl - The full download URL of the image
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the download URL
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('Invalid image URL format');
      }

      const imagePath = decodeURIComponent(pathMatch[1]);
      const imageRef = ref(storage, imagePath);
      
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Generate a unique filename for product images
   * @param productId - The product ID (or 'new' for new products)
   * @param file - The image file
   * @returns Unique filename
   */
  static generateProductImagePath(productId: string, file: File): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(file);
    
    return `products/${productId}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Check if file is a valid image type
   * @param file - File to validate
   * @returns boolean
   */
  private static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * Get file extension from file
   * @param file - File object
   * @returns File extension
   */
  private static getFileExtension(file: File): string {
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') return 'jpg';
    if (file.type === 'image/png') return 'png';
    if (file.type === 'image/webp') return 'webp';
    
    // Fallback to extracting from filename
    const parts = file.name.split('.');
    return parts[parts.length - 1]?.toLowerCase() || 'jpg';
  }

  /**
   * Resize image before upload (optional utility)
   * @param file - Image file
   * @param maxWidth - Maximum width
   * @param maxHeight - Maximum height
   * @param quality - JPEG quality (0-1)
   * @returns Promise with resized file
   */
  static async resizeImage(
    file: File, 
    maxWidth: number = 800, 
    maxHeight: number = 600, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw resized image
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}
