'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AnalysisButtonProps {
  assessmentId: string;
}

export default function AnalysisButton({ assessmentId }: AnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      
      const response = await fetch(`/api/assessment/${assessmentId}/analyze`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start analysis');
      }

      const data = await response.json();
      
      // Show success message
      toast.success(
        'הניתוח החל! תקבל אימייל כשהניתוח יהיה מוכן.',
        {
          duration: 5000,
          position: 'bottom-center',
        }
      );

      // Optional: Redirect to a status page or dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error(
        'אירעה שגיאה בהתחלת הניתוח. אנא נסה שוב.',
        {
          duration: 5000,
          position: 'bottom-center',
        }
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <button
      onClick={handleAnalysis}
      disabled={isAnalyzing}
      className={`
        w-full px-4 py-2 text-white font-medium rounded-lg
        ${isAnalyzing
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
        }
        transition-colors duration-200
      `}
    >
      {isAnalyzing ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          מנתח...
        </div>
      ) : (
        'שלח לניתוח'
      )}
    </button>
  );
} 