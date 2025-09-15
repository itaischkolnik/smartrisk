'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiBriefcase } from 'react-icons/fi';
import { Profile } from '../../types/admin';

interface EditUserModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ profile, isOpen, onClose, onSave }) => {
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditedProfile({ ...profile });
    }
  }, [profile]);

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

  if (!isOpen || !profile || !editedProfile) return null;

  const handleSave = async () => {
    if (!editedProfile) return;
    
    setIsSaving(true);
    try {
      await onSave(editedProfile);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      // Don't throw error, just log it and let parent handle
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden',
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: '600px',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(to right, #3b82f6, #2563eb)'
            }}>
              <FiUser style={{ height: '1rem', width: '1rem', color: 'white' }} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              עריכת משתמש
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            <FiX style={{ height: '1.25rem', width: '1.25rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Basic Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                מידע בסיסי
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    שם מלא
                  </label>
                  <input
                    type="text"
                    value={editedProfile.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    אימייל
                  </label>
                  <input
                    type="email"
                    value={editedProfile.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    טלפון
                  </label>
                  <input
                    type="tel"
                    value={editedProfile.mobile_phone || ''}
                    onChange={(e) => handleInputChange('mobile_phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    מנוי
                  </label>
                  <select
                    value={editedProfile.subscription}
                    onChange={(e) => handleInputChange('subscription', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  >
                    <option value="חינם">חינם</option>
                    <option value="יזם">יזם</option>
                    <option value="איש עסקים">איש עסקים</option>
                    <option value="מקצועי">מקצועי</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    הערכות בשימוש השנה
                  </label>
                  <input
                    type="number"
                    value={editedProfile.assessments_used_this_year || 0}
                    onChange={(e) => handleInputChange('assessments_used_this_year', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                    min="0"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    תאריך איפוס אחרון
                  </label>
                  <input
                    type="date"
                    value={editedProfile.last_assessment_reset_date ? new Date(editedProfile.last_assessment_reset_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('last_assessment_reset_date', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    מיקום
                  </label>
                  <input
                    type="text"
                    value={editedProfile.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151', 
                    marginBottom: '0.5rem' 
                  }}>
                    עיסוק
                  </label>
                  <input
                    type="text"
                    value={editedProfile.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      textAlign: 'right'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isSaving ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditUserModal;
