'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { redirect } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MultiStepForm from '../../components/assessment/MultiStepForm';

export default function EditAssessmentPage() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const assessmentId = params.id as string;
  
  // Redirect if not authenticated
  if (!isLoading && !user) {
    redirect('/auth/login?redirect=/assessment/' + assessmentId);
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-4">
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">המשך מילוי הערכת סיכונים</h1>
          <p className="text-lg text-gray-600 mt-1">
            המשך מילוי הטופס מהמקום בו הפסקת. תוכל לשמור טיוטה בכל שלב.
          </p>
          
          <MultiStepForm assessmentId={assessmentId} />
        </div>
      </div>
    </DashboardLayout>
  );
} 