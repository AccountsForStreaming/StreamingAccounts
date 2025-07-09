import React, { useState } from 'react';
import { ExternalLink, Upload, Folder } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ImageBrowser from './ImageBrowser';

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
  const [inputMode, setInputMode] = useState<'upload' | 'url' | 'browse'>('upload');
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [showImageBrowser, setShowImageBrowser] = useState(false);

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

  const handleBrowseImages = () => {
    setShowImageBrowser(true);
  };

  const handleSelectFromBrowser = (imageUrl: string) => {
    onImageSet(imageUrl);
    setShowImageBrowser(false);
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
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setInputMode('browse')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'browse'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Folder className="w-4 h-4 inline mr-2" />
          Browse Storage
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
      ) : inputMode === 'browse' ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleBrowseImages}
            disabled={disabled}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="space-y-3">
              <Folder className="w-12 h-12 mx-auto text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Browse uploaded images
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Select from previously uploaded product images
                </p>
              </div>
            </div>
          </button>
          
          {/* Current Image Preview */}
          {currentImageUrl && (
            <div className="relative">
              <img
                src={currentImageUrl}
                alt="Selected image"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
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
      
      {/* Image Browser Modal */}
      <ImageBrowser
        isOpen={showImageBrowser}
        onClose={() => setShowImageBrowser(false)}
        onSelectImage={handleSelectFromBrowser}
        currentImageUrl={currentImageUrl}
      />
    </div>
  );
};

export default ImageInput;
