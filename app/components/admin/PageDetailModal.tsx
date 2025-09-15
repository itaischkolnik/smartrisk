'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiEdit, FiSave, FiEye, FiEyeOff, FiFileText, FiGlobe, FiCalendar, FiUser } from 'react-icons/fi';
import { Page } from '../../types/admin';

interface PageDetailModalProps {
  page: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (updatedPage: Partial<Page>) => void;
  onDelete?: (pageId: string) => void;
  startInEditMode?: boolean; // New prop to start in edit mode
}

const PageDetailModal: React.FC<PageDetailModalProps> = ({
  page,
  isOpen,
  onClose,
  onSave,
  onDelete,
  startInEditMode = false
}) => {
  // Add CSS styles to ensure white text
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .save-button-white-text,
      .save-button-white-text *,
      .save-button-white-text span,
      .save-button-white-text svg {
        color: white !important;
        fill: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [formData, setFormData] = useState<Partial<Page>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper to strictly convert various truthy/falsy representations coming from DB into a boolean
  const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_description: page.meta_description || '',
        is_published: normalizeBool(page.is_published)
      });
    }
  }, [page]);

  // Reset edit mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsEditing(startInEditMode);
    } else {
      setIsEditing(false);
    }
  }, [isOpen, startInEditMode]);

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

  const handleInputChange = (field: keyof Page, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!page || !onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      // Close the modal completely after successful save
      onClose();
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!page || !onDelete) return;
    
    if (!confirm('האם אתה בטוח שברצונך למחוק דף זה? פעולה זו אינה הפיכה.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(page.id);
      onClose();
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_description: page.meta_description || '',
        is_published: page.is_published
      });
    }
  };

  // Early return after all hooks
  if (!isOpen || !page || !mounted) {
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
      data-modal="page-detail"
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto flex flex-col border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxHeight: '90vh',
          maxWidth: '90vw',
          width: '100%',
          position: 'relative',
          zIndex: 100000,
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <FiFileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {isEditing ? 'עריכת דף' : page.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {isEditing ? 'ערוך את פרטי הדף' : `כתובת: /${page.slug}`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary btn-sm flex items-center space-x-2 space-x-reverse"
              >
                <FiEdit className="h-4 w-4" />
                <span>ערוך</span>
              </button>
            )}
            <button
              onClick={onClose}
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
        </div>

        {/* Content */}
        <div className="flex-1 flex p-8" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="w-full overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {isEditing ? (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    כותרת הדף *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input-field w-full text-right"
                    placeholder="הכנס כותרת לדף"
                  />
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
                      value={formData.slug || ''}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="input-field flex-1 text-right"
                      placeholder="כתובת-הדף"
                    />
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    תיאור מטא
                  </label>
                  <textarea
                    value={formData.meta_description || ''}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    className="input-field w-full text-right"
                    rows={3}
                    placeholder="תיאור קצר של הדף למנועי חיפוש"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    תוכן הדף *
                  </label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="input-field w-full text-right"
                    rows={12}
                    placeholder="הכנס את תוכן הדף כאן..."
                  />
                </div>

                {/* Published Status */}
                <div className="flex items-center space-x-3 space-x-reverse">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={Boolean(formData.is_published)}
                    onChange={(e) => handleInputChange('is_published', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                    דף מפורסם
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Page Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FiFileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">כותרת</p>
                        <p className="text-lg font-semibold text-gray-900">{page.title}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FiGlobe className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">כתובת</p>
                        <p className="text-lg font-semibold text-gray-900">/{page.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="h-5 w-5 flex items-center justify-center">
                        {normalizeBool(page.is_published) ? (
                          <FiEye className="h-5 w-5 text-green-500" />
                        ) : (
                          <FiEyeOff className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">סטטוס</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          normalizeBool(page.is_published) ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {normalizeBool(page.is_published) ? 'מפורסם' : 'בטיוטא'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">תאריך יצירה</p>
                        <p className="text-sm text-gray-900">
                          {new Date(page.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">תאריך עדכון</p>
                        <p className="text-sm text-gray-900">
                          {new Date(page.updated_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>

                    {/* Removed created_by section since this property doesn't exist in the Page interface */}
                  </div>
                </div>

                {/* Meta Description */}
                {page.meta_description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2 text-right">תיאור מטא</p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-right">
                      {page.meta_description}
                    </p>
                  </div>
                )}

                {/* Content Preview */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2 text-right">תוכן הדף</p>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <div 
                      className="text-gray-900 text-right prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-8 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 flex-row-reverse">
          {/* Save / Cancel (right side in RTL) */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {isEditing && (
              <>
                <button
                  onClick={handleCancel}
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
                   onClick={handleSave}
                   className="save-button-white-text"
                   style={{
                     padding: '0.75rem 1.5rem',
                     color: 'white',
                     background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
                     borderRadius: '0.75rem',
                     border: 'none',
                     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                     fontWeight: '600',
                     fontSize: '0.875rem',
                     cursor: 'pointer',
                     boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.5rem',
                     textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                   }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span style={{ color: 'white' }}>שומר...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="h-4 w-4" style={{ color: 'white' }} />
                      <span style={{ color: 'white' }}>שמור</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          {/* Delete button on the left (if not editing) */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {!isEditing && onDelete && (
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.75rem 1.5rem',
                  color: '#dc2626',
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  border: '1px solid #fca5a5',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#f87171';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#fca5a5';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'מוחק...' : 'מחק דף'}
              </button>
            )}
          </div>
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

export default PageDetailModal;
