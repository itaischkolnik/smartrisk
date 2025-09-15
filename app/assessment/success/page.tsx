'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

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
              תודה שמילאת את השאלון. המידע שלך נשלח בהצלחה למערכת שלנו.
            </p>
          </div>

          {assessmentId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-medium text-blue-700 mb-2">
                מספר הערכה
              </h2>
              <p className="text-blue-600 mb-4">
                מספר ההערכה שלך: <span className="font-bold">{assessmentId}</span>
              </p>
              <p className="text-gray-600">
                המידע שלך נשלח בהצלחה למערכת העיבוד שלנו יחד עם כל הקבצים שהעלית. 
                אנחנו נבדוק את הפרטים ונחזור אליך בהקדם.
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              תקבל עדכון על התקדמות הבדיקה. בינתיים, תוכל לחזור ללוח הבקרה.
            </p>
            <Link
              href="/dashboard"
              style={{ backgroundColor: '#4285F4', border: '2px solid #4285F4' }}
              className="inline-block text-white font-bold px-6 py-3 rounded-lg hover:bg-[#3367d6] transition-colors duration-200"
            >
              חזרה ללוח הבקרה
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 