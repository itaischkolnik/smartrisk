'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            אימות דואר אלקטרוני
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-6">
            <FiMail className="h-12 w-12 text-blue-500" />
          </div>

          <p className="text-lg text-gray-700 mb-6">
            שלחנו הודעת אימות אל:
            <br />
            <span className="font-bold">{email || 'כתובת האימייל שלך'}</span>
          </p>

          <p className="text-sm text-gray-600 mb-8">
            נא לאמת את כתובת האימייל שלך על ידי לחיצה על הקישור שנשלח אליך.
            <br />
            לאחר האימות, תוכל להתחבר למערכת.
          </p>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="inline-block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              חזור למסך ההתחברות
            </Link>

            <button
              type="button"
              className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                // This would resend the verification email
                alert('שלחנו אימייל אימות חדש לכתובת שלך');
              }}
            >
              שלח אימייל אימות שוב
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          לא קיבלת את האימייל? בדוק את תיקיית דואר הזבל, או{' '}
          <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
            נסה להירשם שוב
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 