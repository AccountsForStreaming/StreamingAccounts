import React, { useState } from 'react';
import { ExternalLink, Upload } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface ImageInputProps {
  onImageSet: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onImageSet,
  currentImageUrl,
  disabled = false
}) => {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');

  const handleUrlSubmit = () => {
    onImageSet(urlInput.trim());
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setInputMode('upload')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'upload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Image
        </button>
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'url'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ExternalLink className="w-4 h-4 inline mr-2" />
          Image URL
        </button>
      </div>

      {/* Content based on selected mode */}
      {inputMode === 'upload' ? (
        <ImageUpload
          onImageUploaded={onImageSet}
          currentImageUrl={currentImageUrl}
          disabled={disabled}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={handleUrlInputChange}
              onKeyPress={handleUrlKeyPress}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Set
            </button>
          </div>
          
          {/* URL Preview */}
          {currentImageUrl && (
            <div className="relative">
              <img
                src={currentImageUrl}
                alt="Product preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Enter a direct link to an image file (JPG, PNG, WebP)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
