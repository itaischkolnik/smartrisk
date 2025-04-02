'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiHome, FiArrowLeft } from 'react-icons/fi';

interface FormSubmissionSuccessProps {
  assessmentId?: string;
}

const FormSubmissionSuccess: React.FC<FormSubmissionSuccessProps> = ({ assessmentId }) => {
  const router = useRouter();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <FiCheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ההערכה נשלחה בהצלחה!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          תודה שהשלמת את טופס הערכת העסק. צוותנו יבחן את הנתונים ותקבל ניתוח מפורט בקרוב.
          אנו נשלח לך הודעת דוא"ל כאשר הניתוח המקצועי יהיה מוכן.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            href="/dashboard" 
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg"
          >
            <FiArrowLeft className="ml-2" />
            חזרה ללוח הבקרה
          </Link>
          
          <Link 
            href="/" 
            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg"
          >
            <FiHome className="ml-2" />
            דף הבית
          </Link>
        </div>
      </div>
      
      {assessmentId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-medium text-blue-700 mb-2">
            מה הצעד הבא?
          </h2>
          <p className="text-blue-600 mb-4">
            מספר ההערכה שלך: <span className="font-bold">{assessmentId}</span>
          </p>
          <p className="text-gray-600">
            אנו מעריכים שהניתוח יהיה מוכן תוך 2-3 ימי עסקים. אנא עקוב אחר התקדמות ההערכה בלוח הבקרה.
          </p>
        </div>
      )}
    </div>
  );
};

export default FormSubmissionSuccess; 