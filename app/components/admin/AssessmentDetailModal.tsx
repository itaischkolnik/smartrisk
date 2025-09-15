'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiFileText, FiUser, FiCalendar, FiBriefcase, FiMapPin, FiMail, FiPhone, FiDownload, FiTrash2 } from 'react-icons/fi';
import { Assessment, AssessmentData, File, Profile } from '../../types/admin';
import { getFieldLabel, getSectionLabel, getValueLabel } from '@/utils/fieldLabels';

interface AssessmentDetailModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
}

const AssessmentDetailModal: React.FC<AssessmentDetailModalProps> = ({ assessment, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

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

  // Early return after all hooks
  if (!isOpen || !assessment || !mounted) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-blue-600 bg-blue-100';
      case 'submitted':
      case 'submitted_to_webhook':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
      case 'analyzed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'בטיוטא';
      case 'submitted':
        return 'הוגש';
      case 'submitted_to_webhook':
        return 'נשלחה';
      case 'processing':
        return 'בתהליך';
      case 'completed':
        return 'הושלם';
      case 'analyzed':
        return 'הושלם';
      default:
        return status;
    }
  };

  const translateValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === '') return '';
    
    // Try to get value label first
    const valueLabel = getValueLabel(key, String(value));
    if (valueLabel !== String(value)) {
      return valueLabel;
    }
    
    // Convert to string for comparison
    const stringValue = String(value).toLowerCase();
    
    // Marital status translations
    if (key.includes('marital') || key.includes('status')) {
      switch (stringValue) {
        case 'single':
          return 'רווק/ה';
        case 'married':
          return 'נשוי/אה';
        case 'divorced':
          return 'גרוש/ה';
        case 'widowed':
          return 'אלמן/ה';
        case 'separated':
          return 'מופרד/ת';
        default:
          return String(value);
      }
    }
    
    // Occupation/Job translations
    if (key.includes('occupation') || key.includes('job') || key.includes('work')) {
      switch (stringValue) {
        case 'employee':
          return 'עובד/ת שכיר/ה';
        case 'self-employed':
          return 'עצמאי/ת';
        case 'business owner':
          return 'בעל/ת עסק';
        case 'freelancer':
          return 'פרילנסר/ית';
        case 'student':
          return 'סטודנט/ית';
        case 'unemployed':
          return 'מובטל/ת';
        case 'retired':
          return 'פנסיונר/ית';
        default:
          return String(value);
      }
    }
    
    // Financial capability translations
    if (key.includes('financial') || key.includes('capability') || key.includes('income')) {
      switch (stringValue) {
        case 'low':
          return 'נמוך';
        case 'medium':
          return 'בינוני';
        case 'high':
          return 'גבוה';
        case 'very high':
          return 'גבוה מאוד';
        default:
          return String(value);
      }
    }
    
    // Boolean translations
    if (typeof value === 'boolean') {
      return value ? 'כן' : 'לא';
    }
    
    // Default: return original value
    return String(value);
  };

  const renderSectionData = (sectionData: AssessmentData) => {
    const data = sectionData.data;
    if (!data) return null;

    return (
      <div key={sectionData.id} className="bg-white/60 rounded-xl p-4 border border-gray-200/50">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 capitalize flex items-center">
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
          {getSectionLabel(sectionData.section)}
        </h4>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => {
            if (value === null || value === undefined || value === '') return null;
            
            return (
              <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50/50 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <span className="text-sm font-semibold text-gray-700 capitalize min-w-fit">
                  {getFieldLabel(key)}:
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {translateValue(key, value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
      data-modal="assessment-detail"
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
          zIndex: 100000
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
                {assessment.business_name}
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">מזהה הערכה: {assessment.id}</p>
            </div>
          </div>
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

        {/* Content */}
        <div className="flex-1 flex p-8" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Left Column - Basic Info (Static) */}
            <div className="space-y-6">
              {/* Status */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-semibold text-gray-900">סטטוס</h3>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(assessment.status)}`}>
                    {getStatusText(assessment.status)}
                  </span>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-blue-500 rounded-xl mr-3">
                    <FiBriefcase className="w-5 h-5 text-white" />
                  </div>
                  פרטי העסק
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">שם העסק:</span>
                    <span className="text-sm text-gray-900 font-medium">{assessment.business_name}</span>
                  </div>
                  {assessment.profiles && assessment.profiles.occupation && (
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">עיסוק:</span>
                      <span className="text-sm text-gray-900 font-medium">{translateValue('occupation', assessment.profiles.occupation)}</span>
                    </div>
                  )}
                  {assessment.profiles && assessment.profiles.location && (
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">מיקום:</span>
                      <span className="text-sm text-gray-900 font-medium">{translateValue('location', assessment.profiles.location)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <div className="p-2 bg-purple-500 rounded-xl mr-3">
                    <FiCalendar className="w-5 h-5 text-white" />
                  </div>
                  תאריכים חשובים
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                    <span className="text-sm font-semibold text-gray-700">נוצר:</span>
                    <span className="text-sm text-gray-900 font-medium">{formatDate(assessment.created_at)}</span>
                  </div>
                  {assessment.updated_at && (
                    <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl">
                      <span className="text-sm font-semibold text-gray-700">עודכן:</span>
                      <span className="text-sm text-gray-900 font-medium">{formatDate(assessment.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Assessment Data (Scrollable) */}
            <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Summary */}
              {assessment.summary && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-emerald-500 rounded-xl mr-3">
                      <FiFileText className="w-5 h-5 text-white" />
                    </div>
                    סיכום
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed p-4 bg-white/60 rounded-xl">{assessment.summary}</p>
                </div>
              )}

              {/* Assessment Data Sections */}
              {assessment.assessment_data && assessment.assessment_data.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-amber-500 rounded-xl mr-3">
                      <FiFileText className="w-5 h-5 text-white" />
                    </div>
                    נתוני ההערכה
                  </h3>
                  <div className="space-y-4">
                    {assessment.assessment_data.map(renderSectionData)}
                  </div>
                </div>
              )}

              {/* Files */}
              {assessment.files && assessment.files.length > 0 && (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200/50 shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="p-2 bg-cyan-500 rounded-xl mr-3">
                      <FiDownload className="w-5 h-5 text-white" />
                    </div>
                    קבצים שהועלו
                  </h3>
                  <div className="space-y-3">
                    {assessment.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <FiFileText className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{file.file_name}</p>
                            <p className="text-xs text-gray-500 font-medium">{formatFileSize(file.file_size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl transition-all duration-200 hover:shadow-sm"
                          >
                            <FiDownload className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

export default AssessmentDetailModal;
