// components/analysis/file-upload.tsx
'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  disabled?: boolean;
}

export function FileUpload({
  onFileSelect,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.docx', '.doc', '.txt'],
  disabled = false,
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedTypes.includes(fileExtension)) {
      return `File type must be one of: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        return;
      }

      onFileSelect(file);
    },
    [maxSizeMB, acceptedTypes, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset input so same file can be selected again
      e.target.value = '';
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer'
        )}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={acceptedTypes.join(',')}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />

        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div
            className={cn(
              'p-4 rounded-full',
              isDragActive ? 'bg-blue-100' : 'bg-gray-100'
            )}
          >
            {isDragActive ? (
              <Upload className="h-8 w-8 text-blue-600" />
            ) : (
              <FileText className="h-8 w-8 text-gray-600" />
            )}
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {isDragActive ? 'Drop file here' : 'Drag and drop your file here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">or click to browse</p>
          </div>

          {/* Accepted formats */}
          <div className="text-xs text-gray-500">
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
            <p>Maximum size: {maxSizeMB}MB</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-start space-x-2 bg-red-50 border border-red-200 rounded-md p-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}