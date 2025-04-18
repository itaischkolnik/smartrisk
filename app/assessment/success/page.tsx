'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import AnalysisStatus from '../../components/assessment/AnalysisStatus';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('id');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FiCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              השאלון נשלח בהצלחה!
            </h1>
            <p className="text-gray-600">
              תודה שמילאת את השאלון. אנחנו מנתחים את המידע כעת.
            </p>
          </div>

          {assessmentId && (
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                סטטוס הניתוח
              </h2>
              <AnalysisStatus assessmentId={assessmentId} />
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              תקבל אימייל כשהניתוח יהיה מוכן. בינתיים, תוכל לחזור ללוח הבקרה.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              חזרה ללוח הבקרה
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 