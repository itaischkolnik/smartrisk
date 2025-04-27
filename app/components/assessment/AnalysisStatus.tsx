'use client';

import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw, FiHome } from 'react-icons/fi';
import Link from 'next/link';

interface AnalysisStatusProps {
  assessmentId: string;
}

interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  time_elapsed_seconds: number;
  last_update_seconds: number;
  is_stuck: boolean;
  progress?: {
    step: string;
    details: string;
  };
}

export default function AnalysisStatus({ assessmentId }: AnalysisStatusProps) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      const response = await fetch(`/api/assessment/${assessmentId}/status`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch status');
      }
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
    }
  };

  useEffect(() => {
    // Check status immediately
    checkStatus();

    // Then check every 10 seconds if not completed or failed
    const interval = setInterval(() => {
      if (status?.status !== 'completed' && status?.status !== 'failed') {
        checkStatus();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [assessmentId, status?.status]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} שניות`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} דקות`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <FiAlertCircle className="h-5 w-5 text-red-500 ml-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex justify-center items-center h-12">
        <FiRefreshCw className="animate-spin h-5 w-5 text-blue-500" />
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (status.status) {
      case 'pending':
        return {
          icon: <FiClock className="h-5 w-5 text-gray-500 ml-2" />,
          text: 'ממתין לעיבוד...',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
      case 'processing':
        return {
          icon: <FiRefreshCw className="animate-spin h-5 w-5 text-blue-500 ml-2" />,
          text: 'מנתח את העסק...',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
      case 'completed':
        return {
          icon: <FiCheckCircle className="h-5 w-5 text-green-500 ml-2" />,
          text: 'הניתוח הושלם בהצלחה! ניתן לצפות בתוצאות בדוח שנשלח למייל.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700'
        };
      case 'failed':
        return {
          icon: <FiAlertCircle className="h-5 w-5 text-red-500 ml-2" />,
          text: 'הניתוח נכשל',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      default:
        return {
          icon: <FiClock className="h-5 w-5 text-gray-500 ml-2" />,
          text: 'מצב לא ידוע',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`${statusDisplay.bgColor} border ${statusDisplay.borderColor} ${statusDisplay.textColor} px-4 py-3 rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {statusDisplay.icon}
          <span className="font-medium">{statusDisplay.text}</span>
        </div>
        {status.status === 'completed' && (
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <FiHome className="h-5 w-5 text-green-600" title="חזרה ללוח הבקרה" />
          </Link>
        )}
      </div>
      
      {status.status === 'processing' && (
        <div className="text-sm">
          <p>זמן שחלף: {formatTime(status.time_elapsed_seconds)}</p>
          {status.progress && (
            <p className="mt-1">
              {status.progress.step}: {status.progress.details}
            </p>
          )}
        </div>
      )}

      {status.status === 'failed' && status.error_message && (
        <p className="text-sm mt-1">
          שגיאה: {status.error_message}
        </p>
      )}

      {status.is_stuck && (
        <p className="text-sm mt-1 text-yellow-600">
          נראה שהניתוח נתקע. אנא נסה שוב או צור קשר עם התמיכה.
        </p>
      )}
    </div>
  );
} 