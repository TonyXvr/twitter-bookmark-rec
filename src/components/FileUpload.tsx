import React, { useState, useRef } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Only accept JSON files
    const isValidType = file.type === 'application/json' || file.name.endsWith('.json');
    
    if (!isValidType) {
      setError('Please upload a JSON file');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileUploaded(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileUploaded(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive 
            ? 'border-deep-blue-500 bg-deep-blue-50 dark:bg-deep-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700'
        } transition-colors duration-200 ease-in-out dark:bg-gray-800/50`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-deep-blue-100 dark:bg-deep-blue-900/50 p-4 rounded-full">
            <Upload size={32} className="text-deep-blue-600 dark:text-deep-blue-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Upload your bookmarks file
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag and drop your JSON file here, or click to browse
            </p>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <FileJson size={16} className="mr-1" />
                <span>JSON</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`px-4 py-2 bg-deep-blue-600 text-white rounded-md hover:bg-deep-blue-700 dark:bg-deep-blue-700 dark:hover:bg-deep-blue-800 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Analyzing...' : 'Select File'}
          </button>
          
          {error && (
            <div className="flex items-center text-red-500 dark:text-red-400 text-sm mt-2">
              <AlertCircle size={16} className="mr-1" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Upload a JSON file exported from your browser bookmarks or Twitter bookmarks</p>
        <p className="mt-1">
          <a 
            href="https://chromewebstore.google.com/detail/export-twitter-bookmarks/fondehlfbfbcegdjhoefhfbkaeengcgd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-deep-blue-600 dark:text-deep-blue-400 hover:underline"
          >
            Get the Export Twitter Bookmarks extension
          </a>
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
