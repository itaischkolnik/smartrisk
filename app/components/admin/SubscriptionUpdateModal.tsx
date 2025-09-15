'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiUser, FiCheck } from 'react-icons/fi';
import { Profile } from '../../types/admin';

interface SubscriptionUpdateModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => Promise<void>;
}

const SubscriptionUpdateModal: React.FC<SubscriptionUpdateModalProps> = ({ profile, isOpen, onClose, onSave }) => {
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setSelectedSubscription(profile.subscription || 'חינם');
    }
  }, [profile]);

  if (!isOpen || !profile) return null;

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const updatedProfile = { ...profile, subscription: selectedSubscription };
      await onSave(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
      // Don't throw error, just log it and let parent handle
    } finally {
      setIsSaving(false);
    }
  };

  const subscriptionOptions = [
    { value: 'חינם', label: 'חינם', color: 'text-gray-600' },
    { value: 'יזם', label: 'יזם', color: 'text-blue-600' },
    { value: 'איש עסקים', label: 'איש עסקים', color: 'text-green-600' },
    { value: 'מקצועי', label: 'מקצועי', color: 'text-purple-600' },
  ];

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
          width: '500px',
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
              עדכון מנוי
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
            
            {/* User Info */}
            <div style={{ 
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FiUser style={{ height: '1rem', width: '1rem', color: '#10b981' }} />
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>משתמש</p>
                  <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>
                    {profile.full_name || 'משתמש ללא שם'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Current Subscription */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.75rem' 
              }}>
                מנוי נוכחי: <span style={{ color: '#10b981', fontWeight: '600' }}>{profile.subscription}</span>
              </label>
            </div>

            {/* Subscription Options */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '0.75rem' 
              }}>
                בחר מנוי חדש
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {subscriptionOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setSelectedSubscription(option.value)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${selectedSubscription === option.value ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedSubscription === option.value ? '#eff6ff' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedSubscription !== option.value) {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedSubscription !== option.value) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: selectedSubscription === option.value ? '#1d4ed8' : '#374151'
                    }}>
                      {option.label}
                    </span>
                    {selectedSubscription === option.value && (
                      <FiCheck style={{ height: '1rem', width: '1rem', color: '#3b82f6' }} />
                    )}
                  </div>
                ))}
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
            disabled={isSaving || selectedSubscription === profile.subscription}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: selectedSubscription === profile.subscription ? '#9ca3af' : '#3b82f6',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: selectedSubscription === profile.subscription ? 'not-allowed' : 'pointer',
              opacity: selectedSubscription === profile.subscription ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedSubscription !== profile.subscription && !isSaving) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSubscription !== profile.subscription && !isSaving) {
                e.currentTarget.style.backgroundColor = '#3b82f6';
              }
            }}
          >
            {isSaving ? 'מעדכן...' : 'עדכן מנוי'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SubscriptionUpdateModal;
