'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-right shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiX className="h-5 w-5" />
          </button>
          
          {/* Content */}
          <div className="flex items-center justify-center mb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          
          {/* Action button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              אישור
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
