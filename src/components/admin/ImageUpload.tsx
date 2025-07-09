import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader } from 'lucide-react';
import { ImageUploadService } from '../../services/imageUpload';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImageUrl,
  className = '',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Create preview URL immediately
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Resize image if it's too large
      let fileToUpload = file;
      if (file.size > 1024 * 1024) { // If larger than 1MB, resize
        fileToUpload = await ImageUploadService.resizeImage(file, 800, 600, 0.8);
      }

      // Generate unique path for the image
      const imagePath = ImageUploadService.generateProductImagePath('new', fileToUpload);

      // Upload with progress
      const downloadURL = await ImageUploadService.uploadImageWithProgress(
        fileToUpload,
        imagePath,
        (progress) => {
          setUploadProgress(progress.progress);
          if (progress.error) {
            setError(progress.error);
          }
        }
      );

      // Clean up preview URL
      URL.revokeObjectURL(preview);
      
      // Update with the actual Firebase URL
      setPreviewUrl(downloadURL);
      onImageUploaded(downloadURL);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl(''); // Clear preview on error
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl.includes('firebase')) {
      try {
        await ImageUploadService.deleteImage(previewUrl);
      } catch (error) {
        console.warn('Failed to delete image from storage:', error);
      }
    }
    
    setPreviewUrl('');
    onImageUploaded('');
    setError(null);
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload area or image preview */}
      <div className="relative">
        {previewUrl ? (
          // Image preview
          <div className="relative group">
            <img
              src={previewUrl}
              alt="Product preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={disabled || uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                title="Change image"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload dropzone
          <div
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              disabled || uploading
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {uploading ? (
              <div className="space-y-3">
                <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Help text */}
      <div className="text-xs text-gray-500">
        <p>• Recommended size: 800x600 pixels</p>
        <p>• Supported formats: JPG, PNG, WebP</p>
        <p>• Maximum file size: 5MB</p>
        <p>• Images will be automatically optimized</p>
      </div>
    </div>
  );
};

export default ImageUpload;
