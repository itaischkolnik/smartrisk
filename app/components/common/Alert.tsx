import React from 'react';
import { createPortal } from 'react-dom';

interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const Alert: React.FC<AlertProps> = ({ isOpen, onClose, message, type = 'info' }) => {
  if (!isOpen) return null;

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
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white';
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

  const alertContent = (
    <>
      <div className="fixed inset-0 z-[9999] bg-black/50" onClick={onClose} />
      <div 
        className="fixed left-1/2 top-1/2 z-[10000] w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2"
        style={{ margin: 0 }}
      >
        <div className={`${getAlertStyle()} w-full transform rounded-xl border-2 shadow-2xl transition-all duration-200 ease-out`}>
          <div className="px-8 py-6 text-center">
            {getIconStyle()}
            <p className="text-xl font-bold mb-6">{message}</p>
            <button
              onClick={onClose}
              className={`w-full ${getButtonStyle()} font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 text-lg shadow-lg`}
            >
              אישור
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Only run on client side
  if (typeof document !== 'undefined') {
    return createPortal(alertContent, document.body);
  }

  return null;
};

export default Alert; 