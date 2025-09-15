'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiUpload, FiFile, FiTrash, FiDownload, FiRefreshCw, FiCheck } from 'react-icons/fi';

interface UploadedFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  file_category: string;
  created_at: string;
}

interface SpecificFiles {
  profit_loss_year_a: UploadedFile | null;
  profit_loss_year_b: UploadedFile | null;
  profit_loss_year_c: UploadedFile | null;
  form_11: UploadedFile | null;
  form_126: UploadedFile | null;
}

const FileUploadForm: React.FC<{ assessmentId?: string }> = ({ assessmentId }) => {
  const { setValue, watch } = useFormContext();
  const [uploading, setUploading] = useState<string | null>(null); // Track which field is uploading
  const [specificFiles, setSpecificFiles] = useState<SpecificFiles>({
    profit_loss_year_a: null,
    profit_loss_year_b: null,
    profit_loss_year_c: null,
    form_11: null,
    form_126: null,
  });
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  // File input refs for each specific field
  const fileInputRefs = {
    profit_loss_year_a: useRef<HTMLInputElement>(null),
    profit_loss_year_b: useRef<HTMLInputElement>(null),
    profit_loss_year_c: useRef<HTMLInputElement>(null),
    form_11: useRef<HTMLInputElement>(null),
    form_126: useRef<HTMLInputElement>(null),
  };

  // Load previously uploaded files and categorize them
  const loadUploadedFiles = async () => {
    if (assessmentId) {
      try {
        setLoading(true);
        console.log('Loading files for assessment:', assessmentId);
        const response = await fetch(`/api/assessment/${assessmentId}/files`);
        
        if (response.ok) {
          const data = await response.json();
          const files = data.files || [];
          
          // Categorize files based on their category
          const categorizedFiles: SpecificFiles = {
            profit_loss_year_a: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_a') || null,
            profit_loss_year_b: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_b') || null,
            profit_loss_year_c: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_c') || null,
            form_11: files.find((f: UploadedFile) => f.file_category === 'form_11') || null,
            form_126: files.find((f: UploadedFile) => f.file_category === 'form_126') || null,
          };
          
          setSpecificFiles(categorizedFiles);
          console.log('Categorized files:', categorizedFiles);
        } else {
          console.error('Failed to load files:', response.status);
        }
      } catch (error) {
        console.error('Error loading uploaded files:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    let timeoutId: NodeJS.Timeout;
    
    if (assessmentId) {
      const loadFiles = async () => {
        try {
          setLoading(true);
          console.log('Loading files for assessment:', assessmentId);
          const response = await fetch(`/api/assessment/${assessmentId}/files`);
          
          if (!isMounted) return; // Check if component is still mounted
          
          if (response.ok) {
            const data = await response.json();
            const files = data.files || [];
            
            // Categorize files based on their category
            const categorizedFiles: SpecificFiles = {
              profit_loss_year_a: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_a') || null,
              profit_loss_year_b: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_b') || null,
              profit_loss_year_c: files.find((f: UploadedFile) => f.file_category === 'profit_loss_year_c') || null,
              form_11: files.find((f: UploadedFile) => f.file_category === 'form_11') || null,
              form_126: files.find((f: UploadedFile) => f.file_category === 'form_126') || null,
            };
            
            if (isMounted) {
              setSpecificFiles(categorizedFiles);
              console.log('Categorized files:', categorizedFiles);
            }
          } else {
            console.error('Failed to load files:', response.status);
          }
        } catch (error) {
          console.error('Error loading uploaded files:', error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };
      
      // Add a small delay to prevent rapid loading during transitions
      timeoutId = setTimeout(() => {
        loadFiles();
      }, 100);
    }
    
    return () => {
      setIsMounted(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [assessmentId]);

  // Cleanup effect to ensure proper unmounting
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  const uploadFile = async (file: File, category: keyof SpecificFiles) => {
    if (!assessmentId || !isMounted) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      setUploading(category);
      
      const response = await fetch(`/api/assessment/${assessmentId}/files`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success && data.file && isMounted) {
        // Update the specific file in state
        setSpecificFiles(prev => ({
          ...prev,
          [category]: data.file
        }));
        console.log(`Successfully uploaded ${category}:`, data.file);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (isMounted) {
        alert('שגיאה בהעלאת הקובץ. אנא נסה שוב.');
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) {
            setUploading(null);
          }
        }, 0);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, category: keyof SpecificFiles) => {
    const file = e.target.files?.[0];
    if (!file || !isMounted) return;

    // Validate file type - only PDF files are accepted
    if (file.type !== 'application/pdf') {
      if (isMounted) {
        alert('יש להעלות רק קבצי PDF');
      }
      return;
    }

    await uploadFile(file, category);
    
    // Clear the input only if component is still mounted
    
  };

  const deleteFile = async (category: keyof SpecificFiles, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const file = specificFiles[category];
    if (!file || !assessmentId || isDeleting || !isMounted) return;

    try {
      setIsDeleting(true);
      console.log('Deleting file with ID:', file.id);
      
      const response = await fetch(`/api/assessment/${assessmentId}/files/${file.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success && isMounted) {
        // Remove from local state
        setSpecificFiles(prev => ({
          ...prev,
          [category]: null
        }));
        console.log('File deleted successfully');
      } else if (isMounted) {
        console.error('Delete failed:', result.error);
        alert(`שגיאה במחיקת הקובץ: ${result.error || 'שגיאה לא ידועה'}`);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      if (isMounted) {
        alert('אירעה שגיאה במחיקת הקובץ. אנא נסה שוב.');
      }
    } finally {
      // Only update state if component is still mounted
      if (isMounted) {
        setTimeout(() => {
          if (isMounted) {
            setIsDeleting(false);
          }
        }, 0);
      }
    }
  };

  const FileUploadField: React.FC<{
    category: keyof SpecificFiles;
    title: string;
    description: string;
    acceptedTypes?: string;
    yearLabel?: string;
  }> = ({ category, title, description, acceptedTypes = "application/pdf", yearLabel }) => {
    const file = specificFiles[category];
    const isUploading = uploading === category;

    return (
      <div className="border border-gray-200 rounded-lg p-6" key={category}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              {file ? (
                <FiCheck className="h-5 w-5 text-green-500 ml-2" />
              ) : (
                <div className="h-5 w-5 border-2 border-gray-300 rounded ml-2"></div>
              )}
              {title}
              {yearLabel && (
                <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md">
                  {yearLabel}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>

        <div className="min-h-[120px]">
          {file ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center">
                <FiFile className="h-5 w-5 text-green-600 ml-2" />
                <span className="text-sm font-medium text-green-800">{file.file_name}</span>
                <span className="text-xs text-green-600 mr-2">({Math.round(file.file_size / 1024)} KB)</span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-500"
                  title="הורד קובץ"
                >
                  <FiDownload className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={(e) => deleteFile(category, e)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-500 disabled:opacity-50"
                  title="מחק קובץ"
                >
                  {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <FiTrash className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRefs[category]}
                type="file"
                accept={acceptedTypes}
                onChange={(e) => handleFileChange(e, category)}
                disabled={isUploading}
                className="sr-only"
                id={`file-${category}`}
              />
              <label
                htmlFor={`file-${category}`}
                className="cursor-pointer flex flex-col items-center"
              >
                {isUploading ? (
                  <div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span className="text-sm text-gray-600">מעלה קובץ...</span>
                  </div>
                ) : (
                  <div>
                    <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      לחץ להעלאת קובץ
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      קבצי PDF בלבד
                    </span>
                  </div>
                )}
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  try {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">העלאת מסמכים נדרשים</h2>
          <p className="mt-1 text-sm text-gray-600">
            אנא העלה את המסמכים הבאים לצורך ניתוח מדויק של העסק. כל מסמך יש להעלות בשדה המתאים לו.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>חשוב:</strong> העלאת המסמכים אינה חובה. ניתן לשלוח את הטופס גם ללא קבצים מצורפים.
            המסמכים יעזרו לקבל ניתוח מדויק יותר של העסק.
          </p>
        </div>

        <div className="space-y-6" key="file-upload-fields">
          <FileUploadField
            category="profit_loss_year_a"
            title="דוח רווח והפסד - שנה א' (השנה האחרונה)"
            description="דוח רווח והפסד של השנה האחרונה - קובץ PDF בלבד"
            yearLabel="שנה א'"
          />

          <FileUploadField
            category="profit_loss_year_b"
            title="דוח רווח והפסד - שנה ב' (שנה לפני האחרונה)"
            description="דוח רווח והפסד של השנה שלפני האחרונה - קובץ PDF בלבד"
            yearLabel="שנה ב'"
          />

          <FileUploadField
            category="profit_loss_year_c"
            title="דוח רווח והפסד - שנה ג' (שנתיים לפני האחרונה)"
            description="דוח רווח והפסד של שנתיים לפני האחרונה - קובץ PDF בלבד"
            yearLabel="שנה ג'"
          />

          <FileUploadField
            category="form_11"
            title="טופס י״א (טופס פחת)"
            description="טופס פחת של העסק - קובץ PDF בלבד"
          />

          <FileUploadField
            category="form_126"
            title="טופס 126 (תמחיר משכורות)"
            description="מסמך תמחיר משכורות - קובץ PDF בלבד"
          />
        </div>

        {loading && (
          <div key="loading-files" className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="mr-2 text-gray-600">טוען קבצים...</span>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error rendering FileUploadForm:', error);
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            אירעה שגיאה בטעינת טופס העלאת הקבצים. אנא רענן את העמוד ונסה שוב.
          </p>
        </div>
      </div>
    );
  }
};

export default FileUploadForm; 