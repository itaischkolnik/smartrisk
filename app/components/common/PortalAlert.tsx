'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info';
  children?: React.ReactNode;
}

const PortalAlert: React.FC<PortalAlertProps> = ({ isOpen, onClose, message, type = 'info', children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-500 text-green-800';
      case 'error':
        return 'bg-white border-red-500 text-red-800';
      default:
        return 'bg-white border-blue-500 text-blue-800';
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-[#4285F4] hover:bg-[#3367d6] focus:ring-[#4285F4] text-white !important';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      default:
        return 'bg-[#4285F4] hover:bg-[#3367d6] focus:ring-[#4285F4] text-white !important';
    }
  };

  const getIconStyle = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-12 w-12 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const isSSR = typeof window === 'undefined';

  const alertContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div 
        className="relative transform overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          margin: 'auto'
        }}
      >
        <div className={`${getAlertStyle()} w-full max-w-md rounded-xl border-2 shadow-2xl p-6`}
             style={{
               position: 'relative',
               zIndex: 100000,
               transform: 'none',
               margin: '0 auto'
             }}>
          <div className="text-center">
            {getIconStyle()}
            <p className="text-xl font-bold mb-6">{message}</p>
            {children || (
              <button
                onClick={onClose}
                style={{ backgroundColor: '#4285F4', cursor: 'pointer' }}
                className={`w-full cursor-pointer ${getButtonStyle()} font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 text-lg shadow-lg hover:cursor-pointer`}
              >
                אישור
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (isSSR || !mounted || !isOpen) return null;

  // Create portal only on client side
  return createPortal(alertContent, document.body);
};

export default PortalAlert; 