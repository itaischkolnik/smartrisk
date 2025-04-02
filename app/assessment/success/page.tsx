'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FormSubmissionSuccess } from '../../components/assessment/steps';
import { useAuth } from '../../contexts/AuthContext';
import { redirect } from 'next/navigation';

const AssessmentSuccessPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('id');
  
  // Redirect if not authenticated
  if (!isLoading && !user) {
    redirect('/auth/login?redirect=/assessment/success');
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
      <FormSubmissionSuccess assessmentId={assessmentId || undefined} />
    </DashboardLayout>
  );
};

export default AssessmentSuccessPage; 