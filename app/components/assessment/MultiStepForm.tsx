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
import Alert from '../common/Alert';
import { Assessment } from '../../types/assessment';

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
            // Reset form with assessment data
            const formData: Partial<FormValues> = {
              business_name: assessment.business_name || '',
            };

            // Map section data to form fields
            sections.forEach((section: AssessmentSection) => {
              if (section.data) {
                Object.assign(formData, section.data);
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
  
  const nextStep = async () => {
    // Save draft on step change
    const values = methods.getValues();
    if (user) {
      try {
        const now = new Date().toISOString();

        // Basic assessment data only - minimal required fields
        const assessmentData: Partial<Assessment> = {
          id: assessmentId,
          user_id: user.id,
          status: 'draft' as const,
          created_at: now,
          updated_at: now,
          business_name: values.business_name || undefined
        };

        // Save the main assessment record
        const { assessment, error } = await saveAssessment(assessmentData, user);
        
        if (error) {
          console.error('Error saving draft:', error);
          return;
        }

        // If we have an assessment ID, save the section data
        const currentAssessmentId = assessment?.id || assessmentId;
        if (currentAssessmentId) {
          const sectionData = {
            assessment_id: currentAssessmentId,
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
                    console.log('Assessment ID:', currentAssessmentId);
                    
                    const response = await fetch(`/api/assessment/${currentAssessmentId}/file`, {
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
            return;
          }
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }
    
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
  
  // Render current step component
  const StepComponent = steps[currentStep].component;
  
  // Update the save draft button handler similarly
  const saveDraft = async () => {
    const values = methods.getValues();
    if (!user) {
      showAlert('עליך להתחבר כדי לשמור טיוטה', 'error');
      return;
    }

    try {
      const now = new Date().toISOString();

      // Basic assessment data only - minimal required fields
      const assessmentData: Partial<Assessment> = {
        id: assessmentId,
        user_id: user.id,
        status: 'draft' as const,
        created_at: now,
        updated_at: now,
        business_name: values.business_name || undefined
      };

      // Save the main assessment record
      const { assessment, error } = await saveAssessment(assessmentData, user);
      
      if (error) {
        throw error;
      }

      const currentAssessmentId = assessment?.id || assessmentId;
      if (!currentAssessmentId) {
        throw new Error('No assessment ID available');
      }

      // Save section data
      const sectionData = {
        assessment_id: currentAssessmentId,
        created_at: now,
        updated_at: now,
      };

      // Save section-specific data
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
                console.log('Assessment ID:', currentAssessmentId);
                
                const response = await fetch(`/api/assessment/${currentAssessmentId}/file`, {
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
        throw sectionResult.error;
      }
      
      showAlert('הטופס נשמר בהצלחה כטיוטה', 'success');
    } catch (error) {
      console.error('Error saving draft:', error);
      showAlert(
        error instanceof Error ? error.message : 'אירעה שגיאה בשמירת הטיוטה',
        'error'
      );
    }
  };
  
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
                  {currentStep > 0 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-blue-700"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                      disabled={isSubmitting}
                    >
                      <FiArrowRight className="ml-2" />
                      הקודם
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="flex items-center bg-white hover:bg-gray-50 text-blue-700 font-bold py-3 px-6 rounded-lg shadow-md border-2 border-blue-700"
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", cursor: "pointer" }}
                    >
                      <FiArrowRight className="ml-2" />
                      ביטול
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-4 items-center">
                  <button
                    type="button"
                    onClick={saveDraft}
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
          
          {/* Add Alert component */}
          <Alert
            isOpen={alertState.isOpen}
            onClose={closeAlert}
            message={alertState.message}
            type={alertState.type}
          />
        </>
      )}
    </div>
  );
};

export default MultiStepForm; 