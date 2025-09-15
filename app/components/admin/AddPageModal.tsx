'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSave, FiFileText, FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';

interface AddPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pageData: {
    title: string;
    slug: string;
    content: string;
    meta_description: string;
    is_published: boolean;
  }) => void;
}

const AddPageModal: React.FC<AddPageModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  // Ensure no ancestor transforms/filters interfere with fixed positioning
  useEffect(() => {
    if (!isOpen) return;

    const htmlEl = document.documentElement as HTMLElement;
    const bodyEl = document.body as HTMLElement;

    const prevHtmlTransform = htmlEl.style.transform;
    const prevBodyTransform = bodyEl.style.transform;
    const prevHtmlFilter = (htmlEl.style as CSSStyleDeclaration & { filter?: string }).filter || '';
    const prevBodyFilter = (bodyEl.style as CSSStyleDeclaration & { filter?: string }).filter || '';
    const prevHtmlPerspective = (htmlEl.style as any).perspective || '';
    const prevBodyPerspective = (bodyEl.style as any).perspective || '';

    htmlEl.style.transform = 'none';
    bodyEl.style.transform = 'none';
    (htmlEl.style as any).filter = 'none';
    (bodyEl.style as any).filter = 'none';
    (htmlEl.style as any).perspective = 'none';
    (bodyEl.style as any).perspective = 'none';

    return () => {
      htmlEl.style.transform = prevHtmlTransform;
      bodyEl.style.transform = prevBodyTransform;
      (htmlEl.style as any).filter = prevHtmlFilter;
      (bodyEl.style as any).filter = prevHtmlFilter;
      (htmlEl.style as any).perspective = prevHtmlPerspective;
      (bodyEl.style as any).perspective = prevBodyPerspective;
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    console.log('validateForm called with formData:', formData);
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'כותרת הדף היא שדה חובה';
      console.log('Title validation failed');
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'כתובת הדף היא שדה חובה';
      console.log('Slug validation failed');
    } else if (!/^[\u0590-\u05FFa-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'כתובת הדף יכולה להכיל אותיות בעברית ובאנגלית, מספרים ומקפים';
      console.log('Slug format validation failed');
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'תוכן הדף הוא שדה חובה';
      console.log('Content validation failed');
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSave = async () => {
    console.log('handleSave called with formData:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    console.log('Form validation passed, calling onSave...');
    setIsSaving(true);
    try {
      await onSave(formData);
      console.log('onSave completed successfully');
      handleClose();
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      is_published: false
    });
    setErrors({});
    onClose();
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    handleInputChange('title', value);
    
    // Auto-generate slug if it's empty or matches the old title
    if (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/\s+/g, '-')) {
      const slug = value
        .toLowerCase()
        .replace(/[^\u0590-\u05FFa-z0-9\s-]/g, '') // Remove special chars except Hebrew, English, numbers, spaces, hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      handleInputChange('slug', slug);
    }
  };

  // Early return after all hooks
  if (!isOpen || !mounted) {
    return null;
  }

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden',
        isolation: 'isolate'
      }}
      onClick={onClose}
      data-modal="add-page"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxHeight: '90vh',
          maxWidth: '90vw',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 100000,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <FiFileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                הוסף דף חדש
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">צור דף חדש במערכת ניהול התוכן</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{ 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(59, 130, 246, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <FiX style={{ 
              height: '1.25rem', 
              width: '1.25rem', 
              color: 'white',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
            }} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex p-8" style={{ 
          maxHeight: 'calc(90vh - 200px)',
          minHeight: '400px',
          overflow: 'hidden'
        }}>
          <div className="w-full space-y-6 overflow-y-auto" style={{ 
            maxHeight: 'calc(90vh - 280px)',
            paddingRight: '8px'
          }}>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                כותרת הדף *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`input-field w-full text-right ${errors.title ? 'border-red-500' : ''}`}
                placeholder="הכנס כותרת לדף"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                כתובת הדף (URL) *
              </label>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-500">/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className={`input-field flex-1 text-right ${errors.slug ? 'border-red-500' : ''}`}
                  placeholder="כתובת-הדף"
                />
              </div>
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.slug}</p>
              )}
              <p className="text-gray-500 text-sm mt-1 text-right">
                כתובת הדף תיווצר אוטומטית מהכותרת, אך ניתן לערוך אותה
              </p>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                תיאור מטא
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                className="input-field w-full text-right"
                rows={3}
                placeholder="תיאור קצר של הדף למנועי חיפוש"
              />
              <p className="text-gray-500 text-sm mt-1 text-right">
                תיאור זה יופיע בתוצאות חיפוש ויעזור למנועי חיפוש להבין את תוכן הדף
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                תוכן הדף *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className={`input-field w-full text-right ${errors.content ? 'border-red-500' : ''}`}
                rows={8}
                placeholder="הכנס את תוכן הדף כאן... ניתן להשתמש ב-HTML בסיסי"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1 text-right">{errors.content}</p>
              )}
              <p className="text-gray-500 text-sm mt-1 text-right">
                תוכן הדף יכול לכלול HTML בסיסי כמו &lt;strong&gt;, &lt;em&gt;, &lt;br&gt; וכו'
              </p>
            </div>

            {/* Published Status */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                דף מפורסם
              </label>
              <div className="flex items-center space-x-2 space-x-reverse text-gray-500">
                {formData.is_published ? (
                  <>
                    <FiEye className="h-4 w-4 text-green-500" />
                    <span className="text-sm">הדף יהיה נגיש למבקרים</span>
                  </>
                ) : (
                  <>
                    <FiEyeOff className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">הדף יהיה בטיוטא ולא יוצג למבקרים</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Always Visible */}
        <div className="flex items-center justify-end space-x-2 space-x-reverse p-8 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex-shrink-0" style={{ minHeight: '80px' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '0.75rem 1.5rem',
              color: '#6b7280',
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              border: '1px solid #d1d5db',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: '500',
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            disabled={isSaving}
          >
            ביטול
          </button>
                            <button
                    onClick={() => {
                      console.log('Create page button clicked!');
                      handleSave();
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      color: 'white',
                      backgroundColor: '#2563eb',
                      background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                      borderRadius: '0.75rem',
                      border: 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      minWidth: '140px',
                      justifyContent: 'center'
                    }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)';
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>שומר...</span>
              </>
            ) : (
              <>
                <FiSave className="h-5 w-5" />
                <span>צור עמוד</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  try {
    const portal = createPortal(modalContent, document.body);
    return portal;
  } catch (error) {
    console.error('Error creating portal:', error);
    // Fallback: render directly without portal
    return modalContent;
  }
};

export default AddPageModal;
