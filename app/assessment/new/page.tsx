'use client';

import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MultiStepForm from '../../components/assessment/MultiStepForm';
import { useAuth } from '../../contexts/AuthContext';
import { redirect } from 'next/navigation';

const NewAssessmentPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  // Redirect if not authenticated
  if (!isLoading && !user) {
    redirect('/auth/login?redirect=/assessment/new');
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
      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">הערכת עסק חדשה</h1>
          <p className="text-lg text-gray-600 mb-8">
            מלא את השאלון הבא בצורה מדויקת ככל האפשר כדי לקבל הערכה מקצועית לעסק שלך.
            העבר בין השלבים השונים לפי הצורך ושמור טיוטה בכל עת.
          </p>
          
          <MultiStepForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewAssessmentPage; 