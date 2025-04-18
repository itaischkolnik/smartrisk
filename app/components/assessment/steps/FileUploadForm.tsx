'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiUpload, FiFile, FiTrash, FiDownload } from 'react-icons/fi';

interface UploadedFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  file_category: string;
  created_at: string;
}

const FileUploadForm: React.FC<{ assessmentId?: string }> = ({ assessmentId }) => {
  const { setValue, watch } = useFormContext();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load previously uploaded files
  useEffect(() => {
    const loadUploadedFiles = async () => {
      if (assessmentId) {
        try {
          const response = await fetch(`/api/assessment/${assessmentId}/files`);
          if (response.ok) {
            const data = await response.json();
            setUploadedFiles(data.files || []);
          }
        } catch (error) {
          console.error('Error loading uploaded files:', error);
        }
      }
    };

    loadUploadedFiles();
  }, [assessmentId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!assessmentId) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'general'); // You can make this dynamic if needed

    try {
      const response = await fetch(`/api/assessment/${assessmentId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success && data.file) {
        setUploadedFiles(prev => [...prev, data.file]);
        setSelectedFiles(prev => prev.filter(f => f.name !== file.name));
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadProgress(prev => ({ ...prev, [file.name]: -1 })); // -1 indicates error
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Start uploading the dropped files
      setUploading(true);
      for (const file of newFiles) {
        await uploadFile(file);
      }
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Start uploading the selected files
      setUploading(true);
      for (const file of newFiles) {
        await uploadFile(file);
      }
      setUploading(false);
    }
  };

  const deleteUploadedFile = async (fileId: string) => {
    if (!assessmentId) return;

    try {
      const response = await fetch(`/api/assessment/${assessmentId}/files/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">העלאת מסמכים</h2>
        <p className="mt-1 text-sm text-gray-600">
          העלה מסמכים התומכים בניתוח העסק, כגון דוחות כספיים, מסמכי בעלות, הסכמים, וכו'
        </p>
      </div>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <span>העלאת קבצים</span>
              <input
                ref={fileInputRef}
                id="file-upload"
                name="documents"
                type="file"
                className="sr-only"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
            <p className="pr-1">או גרור ושחרר</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF, DOC, XLS עד 10MB
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">קבצים שהועלו</h3>
        <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
          {uploadedFiles.map((file) => (
            <li key={file.id} className="pr-3 pl-4 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FiFile className="flex-shrink-0 h-5 w-5 text-gray-400" />
                <span className="mr-2 flex-1 w-0 truncate">{file.file_name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">{Math.round(file.file_size / 1024)} KB</span>
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500"
                >
                  <FiDownload />
                </a>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-500"
                  onClick={() => deleteUploadedFile(file.id)}
                  disabled={uploading}
                >
                  <FiTrash />
                </button>
              </div>
            </li>
          ))}
          {selectedFiles.map((file: File, index: number) => (
            <li key={`new-${index}`} className="pr-3 pl-4 py-3 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <FiFile className="flex-shrink-0 h-5 w-5 text-gray-400" />
                <span className="mr-2 flex-1 w-0 truncate">{file.name}</span>
              </div>
              <div className="flex space-x-4">
                <span className="text-gray-500">{Math.round(file.size / 1024)} KB</span>
                {uploadProgress[file.name] === -1 ? (
                  <span className="text-red-500">Upload failed</span>
                ) : uploadProgress[file.name] ? (
                  <span className="text-gray-500">{uploadProgress[file.name]}%</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUploadForm; 