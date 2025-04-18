'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowLeft, FiArrowRight, FiSave, FiSend } from 'react-icons/fi';
import { User } from '@supabase/supabase-js';
import { saveAssessment, submitAssessmentForAnalysis, saveAssessmentData, getAssessmentData } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import PortalAlert from '../common/PortalAlert';
import { Assessment } from '../../types/assessment';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Import all form steps from the index file
import {
  PersonalDetailsForm,
  PersonalQuestionnaireForm,
  BusinessDetailsForm,
  FinancialDataForm,
  SwotAnalysisForm,
  FileUploadForm
} from './steps';

// Validation schema using zod
const validationSchema = z.object({
  // Personal details validation
  full_name: z.string().min(2, { message: 'נדרש שם מלא' }),
  age: z.string().min(1, { message: 'נדרש גיל' }),
  location: z.string().optional(),
  marital_status: z.string().optional(),
  occupation: z.string().optional(),
  self_introduction: z.string().optional(),
  
  // Personal questionnaire validation
  life_experience: z.string().optional(),
  motivation: z.string().optional(),
  financial_capability: z.string().optional(),
  five_year_goals: z.string().optional(),
  
  // Business details validation
  business_name: z.string().min(2, { message: 'נדרש שם עסק' }),
  business_type: z.string().min(1, { message: 'נדרש סוג עסק' }),
  industry: z.string().min(2, { message: 'נדרש תחום פעילות' }),
  establishment_date: z.string().optional(),
  employee_count: z.string().optional(),
  business_structure: z.string().optional(),
  business_location: z.string().optional(),
  operating_hours: z.string().optional(),
  property_details: z.string().optional(),
  sale_reason: z.string().optional(),
  legal_issues: z.string().optional(),
  additional_notes: z.string().optional(),
  
  // Financial data validation
  asking_price: z.number().min(0, { message: 'נדרש מחיר מבוקש' })
    .or(z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({ code: 'custom', message: 'נדרש מספר תקין' });
        return z.NEVER;
      }
      return parsed;
    })),
  annual_revenue: z.number().min(0, { message: 'נדרש מחזור שנתי' })
    .or(z.string().transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({ code: 'custom', message: 'נדרש מספר תקין' });
        return z.NEVER;
      }
      return parsed;
    })),
  operating_profit: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  net_profit: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  inventory_value: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  equipment_value: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  monthly_salary_expenses: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  monthly_expenses: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  payment_terms: z.string().optional(),
  financial_notes: z.string().optional(),
  
  // SWOT analysis
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  opportunities: z.string().optional(),
  threats: z.string().optional(),
  
  // File upload
  documents: z.array(z.any()).optional().default([]),
});

// Define the type based on the schema
type FormValues = z.infer<typeof validationSchema>;

type AlertType = 'success' | 'error' | 'info';

interface MultiStepFormProps {
  assessmentId?: string;
}

interface AssessmentSection {
  id: string;
  assessment_id: string;
  section: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ assessmentId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!assessmentId);
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    message: string;
    type: AlertType;
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      // Default values for form fields
      full_name: '',
      age: '',
      location: '',
      marital_status: '',
      occupation: '',
      self_introduction: '',
      // Personal questionnaire fields
      life_experience: '',
      motivation: '',
      financial_capability: '',
      five_year_goals: '',
      // SWOT fields
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: '',
    },
  });
  
  // Load saved assessment data
  useEffect(() => {
    const loadAssessmentData = async () => {
      if (assessmentId && user) {
        try {
          setIsLoading(true);
          const { assessment, sections, error } = await getAssessmentData(assessmentId);
          
          if (error) {
            throw error;
          }

          if (assessment && sections) {
            // Initialize form data with empty values
            const formData: Partial<FormValues> = {};

            // Map section data to form fields
            sections.forEach((section: AssessmentSection) => {
              if (section.data) {
                switch (section.section) {
                  case 'personal_details':
                    Object.assign(formData, {
                      full_name: section.data.full_name || '',
                      age: section.data.age || '',
                      location: section.data.location || '',
                      marital_status: section.data.marital_status || '',
                      occupation: section.data.occupation || '',
                      self_introduction: section.data.self_introduction || '',
                    });
                    break;
                  case 'personal_questionnaire':
                    Object.assign(formData, {
                      life_experience: section.data.life_experience || '',
                      motivation: section.data.motivation || '',
                      financial_capability: section.data.financial_capability || '',
                      five_year_goals: section.data.five_year_goals || '',
                    });
                    break;
                  case 'business_details':
                    Object.assign(formData, {
                      business_name: section.data.business_name || assessment.business_name || '',
                      business_type: section.data.business_type || '',
                      industry: section.data.industry || '',
                      establishment_date: section.data.establishment_date || '',
                      employee_count: section.data.employee_count || '',
                      business_structure: section.data.business_structure || '',
                      business_location: section.data.business_location || '',
                      operating_hours: section.data.operating_hours || '',
                      property_details: section.data.property_details || '',
                      sale_reason: section.data.sale_reason || '',
                      legal_issues: section.data.legal_issues || '',
                      additional_notes: section.data.additional_notes || '',
                    });
                    break;
                  case 'financial_data':
                    Object.assign(formData, {
                      asking_price: section.data.asking_price || '',
                      annual_revenue: section.data.annual_revenue || '',
                      operating_profit: section.data.operating_profit || '',
                      net_profit: section.data.net_profit || '',
                      inventory_value: section.data.inventory_value || '',
                      equipment_value: section.data.equipment_value || '',
                      monthly_salary_expenses: section.data.monthly_salary_expenses || '',
                      monthly_expenses: section.data.monthly_expenses || '',
                      payment_terms: section.data.payment_terms || '',
                      financial_notes: section.data.financial_notes || '',
                    });
                    break;
                  case 'swot_analysis':
                    Object.assign(formData, {
                      strengths: section.data.strengths || '',
                      weaknesses: section.data.weaknesses || '',
                      opportunities: section.data.opportunities || '',
                      threats: section.data.threats || '',
                    });
                    break;
                }
              }
            });

            methods.reset(formData);
          }
        } catch (error) {
          console.error('Error loading assessment:', error);
          showAlert('אירעה שגיאה בטעינת הטופס', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAssessmentData();
  }, [assessmentId, user, methods]);
  
  // Define the steps with their components and titles
  const steps = [
    { title: 'פרטים אישיים', component: PersonalDetailsForm },
    { title: 'שאלון אישי', component: PersonalQuestionnaireForm },
    { title: 'פרטי העסק', component: BusinessDetailsForm },
    { title: 'נתונים כספיים', component: FinancialDataForm },
    { title: 'ניתוח SWOT', component: SwotAnalysisForm },
    { title: 'העלאת קבצים', component: FileUploadForm },
  ];
  
  const saveDraft = async (showSuccessMessage = true) => {
    const values = methods.getValues();
    if (!user) {
      showAlert('עליך להתחבר כדי לשמור טיוטה', 'error');
      return;
    }

    try {
      // First save the basic assessment
      const { assessment, error: saveError } = await saveAssessment({
        id: assessmentId,
        user_id: user.id,
        status: 'draft',
      }, user);

      if (saveError) {
        console.error('Error saving assessment:', saveError);
        showAlert('אירעה שגיאה בשמירת הטיוטה. אנא נסה שוב.', 'error');
        return;
      }

      if (!assessment?.id) {
        throw new Error('No assessment ID returned from save');
      }

      // Then save the current section data
      const now = new Date().toISOString();
      const sectionData = {
        assessment_id: assessment.id,
        created_at: now,
        updated_at: now,
      };

      // Save section data based on current step
      let sectionResult;
      switch (currentStep) {
        case 0:
          sectionResult = await saveAssessmentData({
            ...sectionData,
            section: 'personal_details',
            data: {
              full_name: values.full_name || '',
              age: values.age || '',
              location: values.location || '',
              marital_status: values.marital_status || '',
              occupation: values.occupation || '',
              self_introduction: values.self_introduction || '',
            },
          });
          break;
        case 1:
          sectionResult = await saveAssessmentData({
            ...sectionData,
            section: 'personal_questionnaire',
            data: {
              life_experience: values.life_experience || '',
              motivation: values.motivation || '',
              financial_capability: values.financial_capability || '',
              five_year_goals: values.five_year_goals || '',
            },
          });
          break;
        case 2:
          sectionResult = await saveAssessmentData({
            ...sectionData,
            section: 'business_details',
            data: {
              business_name: values.business_name || '',
              business_type: values.business_type || '',
              industry: values.industry || '',
              establishment_date: values.establishment_date || '',
              employee_count: values.employee_count || '',
              business_structure: values.business_structure || '',
              business_location: values.business_location || '',
              operating_hours: values.operating_hours || '',
              property_details: values.property_details || '',
              sale_reason: values.sale_reason || '',
              legal_issues: values.legal_issues || '',
              additional_notes: values.additional_notes || '',
            },
          });
          break;
        case 3:
          sectionResult = await saveAssessmentData({
            ...sectionData,
            section: 'financial_data',
            data: {
              asking_price: values.asking_price || '',
              annual_revenue: values.annual_revenue || '',
              operating_profit: values.operating_profit || '',
              net_profit: values.net_profit || '',
              inventory_value: values.inventory_value || '',
              equipment_value: values.equipment_value || '',
              monthly_salary_expenses: values.monthly_salary_expenses || '',
              monthly_expenses: values.monthly_expenses || '',
              payment_terms: values.payment_terms || '',
              financial_notes: values.financial_notes || '',
            },
          });
          break;
        case 4:
          sectionResult = await saveAssessmentData({
            ...sectionData,
            section: 'swot_analysis',
            data: {
              strengths: values.strengths || '',
              weaknesses: values.weaknesses || '',
              opportunities: values.opportunities || '',
              threats: values.threats || '',
            },
          });
          break;
        case 5:
          if (values.documents && values.documents.length > 0) {
            for (const file of Array.from(values.documents)) {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('category', 'general');
              
              try {
                console.log('Uploading file:', file.name);
                console.log('Assessment ID:', assessment.id);
                
                const response = await fetch(`/api/assessment/${assessment.id}/file`, {
                  method: 'POST',
                  body: formData,
                });

                if (!response.ok) {
                  const errorText = await response.text();
                  console.log('Upload error response:', errorText);
                  let errorMessage;
                  try {
                    const errorData = JSON.parse(errorText);
                    console.log('Parsed error data:', errorData);
                    errorMessage = errorData.error;
                    if (errorData.details) {
                      console.log('Error details:', errorData.details);
                      errorMessage += `: ${errorData.details.message || ''}`;
                    }
                  } catch (e) {
                    errorMessage = `Failed to upload file: ${file.name} (${response.status})`;
                  }
                  throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log('Upload success:', result);
                
                if (!result.success) {
                  throw new Error(`Failed to upload file: ${file.name}`);
                }
              } catch (error) {
                console.error('Error uploading file:', error);
                throw error;
              }
            }
          }
          break;
      }

      if (sectionResult?.error) {
        console.error('Error saving section data:', sectionResult.error);
        showAlert('אירעה שגיאה בשמירת נתוני החלק. אנא נסה שוב.', 'error');
        return;
      }

      if (showSuccessMessage) {
        showAlert('הטיוטה נשמרה בהצלחה', 'success');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      showAlert('אירעה שגיאה בשמירת הטיוטה. אנא נסה שוב.', 'error');
    }
  };
  
  const nextStep = async () => {
    // Save the current state silently (without showing success message)
    await saveDraft(false);
    
    // Only proceed if we're not on the last step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertState({
      isOpen: true,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    if (!user) {
      showAlert('עליך להתחבר כדי לשלוח את השאלון', 'error');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Transform form data to match Assessment type
      const assessmentData = {
        ...data,
        asking_price: typeof data.asking_price === 'string' ? parseInt(data.asking_price) : data.asking_price,
        annual_revenue: typeof data.annual_revenue === 'string' ? parseInt(data.annual_revenue) : data.annual_revenue,
        operating_profit: typeof data.operating_profit === 'string' ? parseInt(data.operating_profit) : data.operating_profit,
        net_profit: typeof data.net_profit === 'string' ? parseInt(data.net_profit) : data.net_profit,
        inventory_value: typeof data.inventory_value === 'string' ? parseInt(data.inventory_value) : data.inventory_value,
        equipment_value: typeof data.equipment_value === 'string' ? parseInt(data.equipment_value) : data.equipment_value,
        salary_expenses: typeof data.monthly_salary_expenses === 'string' ? parseInt(data.monthly_salary_expenses) : data.monthly_salary_expenses,
        status: 'completed' as const,
      };

      // First save as completed
      const { assessment, error } = await saveAssessment(assessmentData, user);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Then submit for analysis
      if (assessment) {
        const result = await submitAssessmentForAnalysis(assessment);
        if (result.success) {
          router.push(`/assessment/success?id=${assessment.id}`);
        } else {
          throw new Error(result.error || 'Failed to submit assessment for analysis');
        }
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      showAlert('אירעה שגיאה בעת שליחת השאלון. אנא נסה שוב מאוחר יותר.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteDraft = async () => {
    if (!user || !assessmentId) {
      console.log('Missing user or assessmentId:', { user, assessmentId });
      showAlert('לא ניתן למחוק טיוטה זו', 'error');
      return;
    }

    try {
      console.log('Starting draft deletion process for assessment:', assessmentId);
      const supabase = createClientComponentClient();

      // First verify the assessment exists and belongs to the user
      const { data: assessment, error: verifyError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (verifyError) {
        console.error('Error verifying assessment:', verifyError);
        throw new Error('Failed to verify assessment');
      }

      if (!assessment) {
        console.error('Assessment not found');
        throw new Error('Assessment not found');
      }

      if (assessment.user_id !== user.id) {
        console.error('Unauthorized: assessment belongs to different user');
        throw new Error('Unauthorized');
      }

      console.log('Found assessment:', assessment);

      // Delete all assessment_data entries first
      console.log('Deleting assessment data...');
      const { error: deleteDataError } = await supabase
        .from('assessment_data')
        .delete()
        .eq('assessment_id', assessmentId);

      if (deleteDataError) {
        console.error('Error deleting assessment data:', deleteDataError);
        throw new Error('Failed to delete assessment data');
      }

      // List and delete files from storage
      console.log('Listing files to delete...');
      const { data: files, error: listError } = await supabase
        .storage
        .from('assessment-files')
        .list(`${user.id}/${assessmentId}`);

      if (listError) {
        console.error('Error listing files:', listError);
        throw new Error('Failed to list assessment files');
      }

      if (files && files.length > 0) {
        console.log('Found files to delete:', files);
        const filePaths = files.map(file => `${user.id}/${assessmentId}/${file.name}`);
        const { error: deleteStorageError } = await supabase
          .storage
          .from('assessment-files')
          .remove(filePaths);

        if (deleteStorageError) {
          console.error('Error deleting files from storage:', deleteStorageError);
          throw new Error('Failed to delete assessment files');
        }
      }

      // Finally delete the assessment itself using a direct delete
      console.log('Deleting assessment record...');
      const { error: deleteAssessmentError } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId)
        .eq('user_id', user.id); // Add explicit user check for RLS

      if (deleteAssessmentError) {
        console.error('Error deleting assessment:', deleteAssessmentError);
        throw new Error('Failed to delete assessment');
      }

      showAlert('הטיוטה נמחקה בהצלחה', 'success');
      console.log('Draft deletion completed successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting draft:', error);
      showAlert(`אירעה שגיאה במחיקת הטיוטה: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };
  
  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    await deleteDraft();
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
  };
  
  // Render current step component
  const StepComponent = steps[currentStep].component;
  
  return (
    <div className="max-w-4xl mx-auto px-4 mt-[24px]">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          {/* Step progress indicator */}
          <div className="mt-6 mb-6">
            <div className="flex justify-between px-8">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center px-2">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      index === currentStep
                        ? 'bg-white border-[#3b82f6] ring-4 ring-blue-100'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span 
                      className={`text-lg font-semibold ${
                        index === currentStep
                          ? 'text-[#3b82f6]'
                          : 'text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span 
                      className={`text-sm text-center block min-w-[80px] ${
                        index === currentStep 
                          ? 'font-bold text-[#3b82f6]' 
                          : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-[#3b82f6] rounded-full transition-all duration-300"
                style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 divide-y divide-gray-200">
                {/* Render current step */}
                {currentStep === 5 ? (
                  <FileUploadForm assessmentId={assessmentId} />
                ) : (
                  React.createElement(steps[currentStep].component)
                )}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <div>
                  {assessmentId && (
                    <button
                      type="button"
                      onClick={handleDeleteClick}
                      className="flex items-center bg-white hover:bg-gray-50 text-red-600 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-red-600"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      מחק טיוטה
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4 items-center">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center ml-4 bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-blue-700"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                      disabled={isSubmitting}
                    >
                      <FiArrowRight className="ml-2" />
                      הקודם
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => saveDraft(true)}
                    className="flex items-center ml-4 bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-blue-700"
                    style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                    disabled={isSubmitting}
                  >
                    <FiSave className="ml-2" />
                    שמור טיוטה
                  </button>
                  
                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      style={{ backgroundColor: "#4285F4", border: "2px solid #4285F4", cursor: "pointer" }}
                      className="flex items-center text-white font-bold py-3 px-6 rounded-lg"
                      disabled={isSubmitting}
                    >
                      הבא
                      <FiArrowLeft className="mr-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-blue-700"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'שולח...' : 'שלח לניתוח'}
                      <FiSend className="mr-2" />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </FormProvider>
          
          {/* Regular alert for success/error messages */}
          <PortalAlert
            isOpen={alertState.isOpen}
            onClose={closeAlert}
            message={alertState.message}
            type={alertState.type}
          />

          {/* Delete confirmation dialog */}
          <PortalAlert
            isOpen={confirmDeleteOpen}
            onClose={handleCancelDelete}
            message="האם אתה בטוח שברצונך למחוק טיוטה זו? פעולה זו אינה הפיכה."
            type="info"
          >
            <div className="flex justify-center space-x-4 mt-4 rtl:space-x-reverse">
              <button
                onClick={handleConfirmDelete}
                style={{ backgroundColor: '#4285F4' }}
                className="hover:bg-[#3367d6] text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:ring-offset-2 transition-colors duration-200"
              >
                מחק
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
              >
                ביטול
              </button>
            </div>
          </PortalAlert>
        </>
      )}
    </div>
  );
};

export default MultiStepForm; 