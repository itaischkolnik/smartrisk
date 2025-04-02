import React from 'react';

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
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative p-6 rounded-lg shadow-xl border ${getAlertStyle()} max-w-sm w-full mx-4`}>
        <div className="text-center">
          <p className="text-lg font-medium mb-4">{message}</p>
          <button
            onClick={onClose}
            className={`w-full ${getButtonStyle()} text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert; 