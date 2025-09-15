import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import { Page } from '../../types/admin';

interface PageModalProps {
  page?: Page | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pageData: Partial<Page>) => Promise<void>;
  mode: 'create' | 'edit';
}

const PageModal: React.FC<PageModalProps> = ({ page, isOpen, onClose, onSave, mode }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (page && mode === 'edit') {
      // 🔄 Ensure is_published is treated strictly as a boolean
      const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1';
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        meta_description: page.meta_description || '',
        is_published: normalizeBool(page.is_published)
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        is_published: false
      });
    }
    setError(null);
  }, [page, mode]);

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.transform = 'none';
      document.documentElement.style.filter = 'none';
      document.documentElement.style.perspective = 'none';
      document.body.style.transform = 'none';
      document.body.style.filter = 'none';
      document.body.style.perspective = 'none';
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירת הדף');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        isolation: 'isolate'
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '800px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(229, 231, 235, 0.5)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)',
          padding: '1.5rem',
          borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
        }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'הוסף דף חדש' : 'ערוך דף'}
            </h2>
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
        <div style={{ padding: '1.5rem', maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                כותרת הדף *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="כתובת-הדף"
                />
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                תיאור מטא (SEO)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="תיאור קצר של הדף לחיפוש באינטרנט"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 text-right">
                  תוכן הדף *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 space-x-reverse text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPreview ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  <span>{showPreview ? 'הסתר תצוגה מקדימה' : 'הצג תצוגה מקדימה'}</span>
                </button>
              </div>
              
              {showPreview ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[200px] text-right">
                  <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                </div>
              ) : (
                <textarea
                  required
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-mono text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="הכנס את תוכן הדף כאן... (תמיכה ב-HTML)"
                />
              )}
            </div>

            {/* Published Status */}
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="checkbox"
                id="is_published"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.is_published}
                onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
              />
              <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                פרסם דף זה
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <FiSave className="h-4 w-4" />
                <span>{loading ? 'שומר...' : 'שמור דף'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PageModal;
