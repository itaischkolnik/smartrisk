'use client';

import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';

interface AnalysisStatusProps {
  assessmentId: string;
}

interface StatusResponse {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  time_elapsed_seconds: number;
  last_update_seconds: number;
  is_stuck: boolean;
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

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} שניות`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} דקות`;
  };

  const getStatusDisplay = () => {
    switch (status.status) {
      case 'pending':
        return {
          icon: <FiClock className="h-5 w-5 text-yellow-500" />,
          text: 'ממתין לניתוח...',
          color: 'yellow'
        };
      case 'processing':
        return {
          icon: <FiRefreshCw className="animate-spin h-5 w-5 text-blue-500" />,
          text: 'מנתח...',
          color: 'blue'
        };
      case 'completed':
        return {
          icon: <FiCheckCircle className="h-5 w-5 text-green-500" />,
          text: 'הניתוח הושלם',
          color: 'green'
        };
      case 'failed':
        return {
          icon: <FiAlertCircle className="h-5 w-5 text-red-500" />,
          text: 'הניתוח נכשל',
          color: 'red'
        };
      default:
        return {
          icon: <FiAlertCircle className="h-5 w-5 text-gray-500" />,
          text: 'סטטוס לא ידוע',
          color: 'gray'
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const bgColor = `bg-${statusDisplay.color}-50`;
  const borderColor = `border-${statusDisplay.color}-200`;
  const textColor = `text-${statusDisplay.color}-700`;

  return (
    <div className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-lg`}>
      <div className="flex items-center space-x-2">
        {statusDisplay.icon}
        <span className="ml-2">{statusDisplay.text}</span>
        {status.status === 'processing' && (
          <span className="text-sm text-gray-500">
            ({formatTime(status.time_elapsed_seconds)})
          </span>
        )}
      </div>
      
      {status.is_stuck && (
        <div className="mt-2 text-sm text-red-600">
          <FiAlertCircle className="inline-block h-4 w-4 mr-1" />
          נראה שהניתוח נתקע. אנא נסה שוב או צור קשר עם התמיכה.
        </div>
      )}
      
      {status.status === 'failed' && status.error_message && (
        <div className="mt-2 text-sm">
          שגיאה: {status.error_message}
        </div>
      )}
    </div>
  );
} 