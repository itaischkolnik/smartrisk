'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useAssessmentPermissions } from '../hooks/useAssessmentPermissions';
import { getUserAssessments } from '../utils/api';
import { Assessment } from '../types/assessment';
import { FiPlus, FiFileText, FiAlertCircle, FiCheckCircle, FiClock, FiBarChart } from 'react-icons/fi';

type AssessmentStatus = 'draft' | 'submitted' | 'processing' | 'completed' | 'analyzed' | 'submitted_to_webhook';

interface DashboardAssessment extends Omit<Assessment, 'status'> {
  status: AssessmentStatus;
  business_field?: string;
  business_type?: string;
}

export default function Dashboard() {
  const { user, isLoading: authLoading, session } = useAuth();
  const permissions = useAssessmentPermissions();
  const router = useRouter();
  const [assessments, setAssessments] = useState<DashboardAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Handle authentication state
  useEffect(() => {
    console.log('Dashboard auth state:', { authLoading, hasSession: !!session, user: session?.user?.email });

    // Simply rely on middleware to redirect unauthenticated users.
    // If there's no session and we're not loading, we can display a loading state here.
    if (!authLoading && !session) {
      setLoading(false);
    }
  }, [session, authLoading]);

  // Fetch assessments
  useEffect(() => {
    let mounted = true;

    async function fetchAssessments() {
      if (!session?.user?.id || !mounted) return;

      setLoading(true);
      setError(null);
      
      try {
        const { assessments: fetchedAssessments, error: fetchError } = await getUserAssessments(session.user.id);
        
        if (!mounted) return;

        if (fetchError) {
          throw fetchError;
        }

        setAssessments(fetchedAssessments || []);
      } catch (err) {
        if (!mounted) return;
        console.error('Error fetching assessments:', err);
        setError(err instanceof Error ? err.message : 'אירעה שגיאה בטעינת ההערכות');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (session?.user?.id && !authLoading) {
      fetchAssessments();
    } else if (!authLoading) {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [session?.user?.id, authLoading]);

  // Show loading state while authentication is being determined
  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2 text-blue-700">
            <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xl">טוען...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-sm">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500 ml-2" />
            <span>{error}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusIcon = (status: AssessmentStatus) => {
    switch (status) {
      case 'draft':
        return <FiFileText style={{ color: '#3b82f6' }} />;
      case 'submitted':
      case 'submitted_to_webhook':
        return <FiClock className="text-yellow-500" />;
      case 'processing':
        return <FiClock className="text-blue-500" />;
      case 'completed':
      case 'analyzed':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiAlertCircle className="text-red-500" />;
    }
  };

  const getStatusText = (status: AssessmentStatus) => {
    switch (status) {
      case 'draft':
        return 'בטיוטא';
      case 'submitted':
        return 'הוגש';
      case 'submitted_to_webhook':
        return 'נשלחה';
      case 'processing':
        return 'בעיבוד';
      case 'completed':
      case 'analyzed':
        return 'הושלם';
      default:
        return 'לא ידוע';
    }
  };

  // Format date to Hebrew-friendly format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
              <p className="mt-2 text-gray-600">
                ברוך הבא, {user?.user_metadata?.full_name || 'משתמש'}! הנה ההערכות שלך.
              </p>
            </div>
                         <div className="mt-4 md:mt-0 flex justify-center">
               {permissions.canCreateAssessment ? (
                 <Link
                   href="/assessment/new"
                   className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg hover:opacity-90 transition-colors shadow-md border-2"
                   style={{ 
                     backgroundColor: '#3b82f6', 
                     color: 'white',
                     borderColor: '#3b82f6',
                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                   }}
                 >
                   <FiPlus className="ml-2" size={18} />
                   צור הערכת עסק
                 </Link>
                               ) : (
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      {permissions.subscription === 'חינם' 
                        ? 'לא ניתן להעלות קבצים בחבילה חינמית'
                        : 'השתמשת בכל ההערכות השנתיות שלך'
                      }
                    </div>
                   <Link
                     href="/pricing"
                     className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg hover:opacity-90 transition-colors shadow-md border-2"
                     style={{ 
                       backgroundColor: '#10b981', 
                       color: 'white',
                       borderColor: '#10b981',
                       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                     }}
                   >
                     שדרג חבילה
                   </Link>
                 </div>
               )}
             </div>
          </div>

                     {/* Basic stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-sm text-blue-700 font-medium">סה"כ הערכות</p>
                   <p className="text-2xl font-bold text-blue-900">{assessments.length}</p>
                 </div>
                 <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                   <FiFileText className="text-blue-600" size={24} />
                 </div>
               </div>
             </div>
             <div className="bg-green-50 rounded-lg p-4 border border-green-100">
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-sm text-green-700 font-medium">הערכות שהושלמו</p>
                   <p className="text-2xl font-bold text-green-900">{assessments.filter(a => a.status === 'completed').length}</p>
                 </div>
                 <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                   <FiCheckCircle className="text-green-600" size={24} />
                 </div>
               </div>
             </div>
             <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-sm text-yellow-700 font-medium">הערכות בתהליך</p>
                   <p className="text-2xl font-bold text-yellow-900">{assessments.filter(a => a.status === 'processing' || a.status === 'submitted' || a.status === 'submitted_to_webhook').length}</p>
                 </div>
                 <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                   <FiClock className="text-yellow-600" size={24} />
                 </div>
               </div>
             </div>
           </div>

           {/* Assessment Usage Info */}
           {!permissions.isLoading && (
             <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3 rtl:space-x-reverse">
                   <FiBarChart className="h-6 w-6 text-blue-600" />
                   <div>
                     <h3 className="text-lg font-semibold text-blue-900">מצב החבילה שלך</h3>
                                           <p className="text-sm text-blue-700">
                        {permissions.subscription === 'חינם' 
                          ? 'חבילה חינמית - ניתן ליצור הערכות ללא העלאת קבצים'
                          : `חבילת ${permissions.subscription} - ${permissions.assessmentsRemaining} הערכות נותרו מתוך ${permissions.maxAssessments}`
                        }
                      </p>
                   </div>
                 </div>
                 {permissions.subscription !== 'חינם' && (
                   <div className="text-right">
                     <div className="text-2xl font-bold text-blue-900">
                       {permissions.assessmentsRemaining}
                     </div>
                     <div className="text-sm text-blue-600">נותרו</div>
                   </div>
                 )}
               </div>
               
               {permissions.subscription === 'חינם' && (
                 <div className="mt-4 flex justify-center">
                   <Link
                     href="/pricing"
                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     שדרג חבילה
                   </Link>
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Assessments section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">ההערכות שלך</h2>
          </div>

          {/* Assessments grid */}
          {assessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/assessment/${assessment.id}`}
                  style={{ 
                    borderColor: assessment.status === 'draft' ? '#3b82f6' : '',
                    borderWidth: assessment.status === 'draft' ? '1px' : '',
                    borderStyle: assessment.status === 'draft' ? 'dashed' : ''
                  }}
                  className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${
                    assessment.status === 'draft' 
                    ? 'bg-white' 
                    : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100'
                  }`}
                >
                  <div className={`p-6 ${assessment.status === 'draft' ? 'bg-blue-50/30' : ''}`}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {assessment.business_name || 'עסק ללא שם'}
                      </h3>
                      <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full shadow-sm ${
                        assessment.status === 'draft'
                        ? 'bg-[#3b82f6]/10 border border-[#3b82f6]'
                        : 'bg-white border border-gray-100'
                      }`}>
                        {getStatusIcon(assessment.status as AssessmentStatus)}
                        <span className="mr-1.5 text-gray-700">{getStatusText(assessment.status as AssessmentStatus)}</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-bold ml-2">תחום:</span>
                        <span>{assessment.business_field || 'לא צוין'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-bold ml-2">סוג:</span>
                        <span>{assessment.business_type || 'לא צוין'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-4">
                        <span>נוצר ב-{formatDate(assessment.created_at || '')}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
                         <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100 p-8 text-center">
               <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                 <FiFileText className="text-blue-500" size={24} />
               </div>
               <h3 className="text-xl font-medium text-gray-900 mb-2">אין הערכות עדיין</h3>
               <p className="text-gray-600 mb-6">התחל ביצירת הערכת עסק חדשה כדי לנתח עסק פוטנציאלי</p>
               {permissions.canCreateAssessment ? (
                 <Link
                   href="/assessment/new"
                   className="inline-flex items-center px-6 py-3 font-bold rounded-lg hover:opacity-90 transition-colors shadow-md border-2"
                   style={{ 
                     backgroundColor: '#3b82f6', 
                     color: 'white',
                     borderColor: '#3b82f6',
                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                   }}
                 >
                   <FiPlus className="ml-2" size={18} />
                   צור הערכת עסק
                 </Link>
               ) : (
                 <div className="space-y-3">
                                       <div className="text-sm text-gray-600">
                      {permissions.subscription === 'חינם' 
                        ? 'לא ניתן להעלות קבצים בחבילה חינמית'
                        : 'השתמשת בכל ההערכות השנתיות שלך'
                      }
                    </div>
                   <Link
                     href="/pricing"
                     className="inline-flex items-center px-6 py-3 font-bold rounded-lg hover:opacity-90 transition-colors shadow-md border-2"
                     style={{ 
                       backgroundColor: '#10b981', 
                       color: 'white',
                       borderColor: '#10b981',
                       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                     }}
                   >
                     שדרג חבילה
                   </Link>
                 </div>
               )}
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 