'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowLeft, FiArrowRight, FiSave, FiSend } from 'react-icons/fi';
import { User } from '@supabase/supabase-js';
import { saveAssessment, submitAssessmentToWebhook, saveAssessmentData, getAssessmentData } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAssessmentPermissions } from '../../hooks/useAssessmentPermissions';
import PortalAlert from '../common/PortalAlert';
import ErrorBoundary from '../common/ErrorBoundary';
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
  mobile_phone: z.string().optional(),
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
  city: z.string().optional(),
  business_area: z.string().optional(),
  real_estate_availability: z.string().optional(),
  has_rental_property: z.string().optional(),
  rental_end_date: z.string().optional(),
  has_renewal_option: z.string().optional(),
  renewal_duration: z.string().optional(),
  monthly_rent: z.string().optional(),
  rental_deposit_cost: z.string().optional(),
  operating_hours: z.string().optional(),
  owner_phone: z.string().optional(),
  licenses_permits: z.array(z.string()).optional().default([]),
  other_license_details: z.string().optional(),
  seller_offers_support: z.string().optional(),
  support_duration: z.string().optional(),
  can_be_relocated: z.string().optional(),
  is_franchise: z.string().optional(),
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
  is_inventory_included_in_price: z.string().optional(),
  inventory_value_in_price: z.string().optional(),
  operating_profit: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  net_profit: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  average_business_profit: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  average_owner_salary: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  inventory_value: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  equipment_value: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  monthly_salary_expenses: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  monthly_expenses: z.number().optional()
    .or(z.string().transform((val) => val ? parseInt(val) : undefined)),
  additional_payment_details: z.string().optional(),
  are_all_debts_paid: z.string().optional(),
  debt_details: z.string().optional(),
  has_legal_claims: z.string().optional(),
  legal_claims_details: z.string().optional(),
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
  const permissions = useAssessmentPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!assessmentId);
  const [currentAssessmentId, setCurrentAssessmentId] = useState<string | undefined>(assessmentId);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  
  // Update currentAssessmentId when assessmentId prop changes
  useEffect(() => {
    if (assessmentId) {
      setCurrentAssessmentId(assessmentId);
    }
  }, [assessmentId]);
  
  // Add global error handler to catch DOM errors during transitions
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error && event.error.message && event.error.message.includes('removeChild')) {
        console.warn('DOM removeChild error caught and suppressed:', event.error);
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  const methods = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      // Default values for form fields
      full_name: '',
      age: '',
      location: '',
      marital_status: '',
      mobile_phone: '',
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
      city: '',
      // Financial fields
      average_business_profit: undefined,
      average_owner_salary: undefined,
    },
  });
  
  // Load saved assessment data
  useEffect(() => {
    const loadAssessmentData = async () => {
      if (currentAssessmentId && user) {
        try {
          setIsLoading(true);
          const { assessment, sections, error } = await getAssessmentData(currentAssessmentId);
          
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
                      mobile_phone: section.data.mobile_phone || '',
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
                      city: section.data.city || '',
                      business_area: section.data.business_area || '',
                      real_estate_availability: section.data.real_estate_availability || '',
                      has_rental_property: section.data.has_rental_property || '',
                      rental_end_date: section.data.rental_end_date || '',
                      has_renewal_option: section.data.has_renewal_option || '',
                      renewal_duration: section.data.renewal_duration || '',
                      monthly_rent: section.data.monthly_rent || '',
                      rental_deposit_cost: section.data.rental_deposit_cost || '',
                      operating_hours: section.data.operating_hours || '',
                      owner_phone: section.data.owner_phone || '',
                      licenses_permits: section.data.licenses_permits || [],
                      other_license_details: section.data.other_license_details || '',
                      seller_offers_support: section.data.seller_offers_support || '',
                      support_duration: section.data.support_duration || '',
                      can_be_relocated: section.data.can_be_relocated || '',
                      is_franchise: section.data.is_franchise || '',
                      property_details: section.data.property_details || '',
                      sale_reason: section.data.sale_reason || '',
                      legal_issues: section.data.legal_issues || '',
                      additional_notes: section.data.additional_notes || '',
                    });
                    break;
                  case 'financial_data':
                    Object.assign(formData, {
                      asking_price: section.data.asking_price || '',
                      is_inventory_included_in_price: section.data.is_inventory_included_in_price || '',
                      inventory_value_in_price: section.data.inventory_value_in_price || '',
                      operating_profit: section.data.operating_profit || '',
                      net_profit: section.data.net_profit || '',
                      average_business_profit: section.data.average_business_profit || '',
                      average_owner_salary: section.data.average_owner_salary || '',
                      inventory_value: section.data.inventory_value || '',
                      equipment_value: section.data.equipment_value || '',
                      monthly_salary_expenses: section.data.monthly_salary_expenses || '',
                      monthly_expenses: section.data.monthly_expenses || '',
                      additional_payment_details: section.data.additional_payment_details || '',
                      are_all_debts_paid: section.data.are_all_debts_paid || '',
                      debt_details: section.data.debt_details || '',
                      has_legal_claims: section.data.has_legal_claims || '',
                      legal_claims_details: section.data.legal_claims_details || '',
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

            // Set form data
            methods.reset(formData);
          }
        } catch (error) {
          console.error('Error loading assessment data:', error);
          showAlert('אירעה שגיאה בטעינת נתוני ההערכה', 'error');
        } finally {
          setIsLoading(false);
        }
      } else if (!currentAssessmentId && user) {
        // Load user profile data for new assessment
        try {
          setIsLoading(true);
          const supabase = createClientComponentClient();
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
            console.error('Error loading profile:', error);
          }

          if (profile) {
            // Auto-populate personal details from profile
            const formData: Partial<FormValues> = {
              full_name: profile.full_name || '',
              age: profile.age?.toString() || '',
              location: profile.location || '',
              marital_status: profile.marital_status || '',
              mobile_phone: profile.mobile_phone || '',
              occupation: profile.occupation || '',
              self_introduction: profile.self_introduction || '',
              life_experience: profile.life_experience || '',
              motivation: profile.motivation || '',
              financial_capability: profile.financial_capability || '',
              five_year_goals: profile.five_year_goals || '',
            };

            methods.reset(formData);
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadAssessmentData();
  }, [currentAssessmentId, user, methods]);
  
  // Define the steps with their components and titles
  const steps = [
    { title: 'פרטים אישיים', component: PersonalDetailsForm },
    { title: 'שאלון אישי', component: PersonalQuestionnaireForm },
    { title: 'פרטי העסק', component: BusinessDetailsForm },
    { title: 'נתונים כספיים', component: FinancialDataForm },
    { title: 'ניתוח SWOT', component: SwotAnalysisForm },
    ...(permissions.canUploadFiles ? [{ title: 'העלאת קבצים', component: FileUploadForm }] : []),
  ];
  
  const saveDraft = async (showSuccessMessage = true) => {
    const values = methods.getValues();
    if (!user) {
      showAlert('עליך להתחבר כדי לשמור טיוטה', 'error');
      return;
    }

    try {
      // Show auto-save indicator if not showing success message
      if (!showSuccessMessage) {
        setIsAutoSaving(true);
      }

      // First save the basic assessment
      const { assessment, error: saveError } = await saveAssessment({
        id: currentAssessmentId,
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

      // Update the current assessment ID if it's a new assessment
      if (!currentAssessmentId && assessment.id) {
        setCurrentAssessmentId(assessment.id);
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
              mobile_phone: values.mobile_phone || '',
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
              city: values.city || '',
              business_area: values.business_area || '',
              real_estate_availability: values.real_estate_availability || '',
              has_rental_property: values.has_rental_property || '',
              rental_end_date: values.rental_end_date || '',
              has_renewal_option: values.has_renewal_option || '',
              renewal_duration: values.renewal_duration || '',
              monthly_rent: values.monthly_rent || '',
              rental_deposit_cost: values.rental_deposit_cost || '',
              operating_hours: values.operating_hours || '',
              owner_phone: values.owner_phone || '',
              licenses_permits: values.licenses_permits || [],
              other_license_details: values.other_license_details || '',
              seller_offers_support: values.seller_offers_support || '',
              support_duration: values.support_duration || '',
              can_be_relocated: values.can_be_relocated || '',
              is_franchise: values.is_franchise || '',
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
              is_inventory_included_in_price: values.is_inventory_included_in_price || '',
              inventory_value_in_price: values.inventory_value_in_price || '',
              operating_profit: values.operating_profit || '',
              net_profit: values.net_profit || '',
              average_business_profit: values.average_business_profit || '',
              average_owner_salary: values.average_owner_salary || '',
              inventory_value: values.inventory_value || '',
              equipment_value: values.equipment_value || '',
              monthly_salary_expenses: values.monthly_salary_expenses || '',
              monthly_expenses: values.monthly_expenses || '',
              additional_payment_details: values.additional_payment_details || '',
              are_all_debts_paid: values.are_all_debts_paid || '',
              debt_details: values.debt_details || '',
              has_legal_claims: values.has_legal_claims || '',
              legal_claims_details: values.legal_claims_details || '',
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
                
                const response = await fetch(`/api/assessment/${assessment.id}/files`, {
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
      } else {
        // Add a small delay to show the auto-save indicator
        setTimeout(() => {
          setIsAutoSaving(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      showAlert('אירעה שגיאה בשמירת הטיוטה. אנא נסה שוב.', 'error');
    } finally {
      // Hide auto-save indicator if it was shown and no delay was set
      if (!showSuccessMessage && !isAutoSaving) {
        setIsAutoSaving(false);
      }
    }
  };
  
  const nextStep = async () => {
    if (isTransitioning) return; // Prevent multiple transitions
    
    try {
      setIsTransitioning(true);
      


      // Save the current state silently (without showing success message)
      await saveDraft(false);
      
      // Only proceed if we're not on the last step
      if (currentStep < steps.length - 1) {
        // Add a longer delay to ensure DOM is completely stable before transition
        // This is especially important when transitioning to FileUploadForm
        const delay = currentStep === steps.length - 2 ? 500 : 200; // Even longer delay for step 5->6
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsTransitioning(false);
        }, delay);
      } else {
        setIsTransitioning(false);
      }
    } catch (error) {
      console.error('Error saving draft before next step:', error);
      showAlert('אירעה שגיאה בשמירת הטיוטה. אנא נסה שוב.', 'error');
      setIsTransitioning(false);
    } finally {
      
    }
  };
  
  const prevStep = () => {
    if (isTransitioning || currentStep <= 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(currentStep - 1);
      setIsTransitioning(false);
    }, 100);
  };

  // Allow user to jump to a specific step by clicking the numbered circle
  const handleStepClick = async (index: number) => {
    // If already on this step or transitioning, do nothing
    if (index === currentStep || isTransitioning) return;

    try {
      setIsTransitioning(true);
      
      // Save current progress silently (without success alert)
      await saveDraft(false);

      // Navigate to the selected step with a small delay
      setTimeout(() => {
        setCurrentStep(index);
        setIsTransitioning(false);
      }, 100);
    } catch (error) {
      console.error('Error saving draft before step navigation:', error);
      showAlert('אירעה שגיאה בשמירת הטיוטה. אנא נסה שוב.', 'error');
      setIsTransitioning(false);
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
        id: currentAssessmentId, // Include the existing assessment ID
        asking_price: typeof data.asking_price === 'string' ? parseInt(data.asking_price) : data.asking_price,
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
      
      if (!assessment?.id) {
        throw new Error('No assessment ID returned from save');
      }

      // Save all sections before submitting
      const now = new Date().toISOString();
      const sectionData = {
        assessment_id: assessment.id,
        created_at: now,
        updated_at: now,
      };

      // Save personal details
      await saveAssessmentData({
        ...sectionData,
        section: 'personal_details',
        data: {
          full_name: data.full_name || '',
          age: data.age || '',
          location: data.location || '',
          marital_status: data.marital_status || '',
          occupation: data.occupation || '',
          self_introduction: data.self_introduction || '',
          mobile_phone: data.mobile_phone || '',
        },
      });

      // Save personal questionnaire
      await saveAssessmentData({
        ...sectionData,
        section: 'personal_questionnaire',
        data: {
          life_experience: data.life_experience || '',
          motivation: data.motivation || '',
          financial_capability: data.financial_capability || '',
          five_year_goals: data.five_year_goals || '',
        },
      });

      // Save business details
      await saveAssessmentData({
        ...sectionData,
        section: 'business_details',
        data: {
          business_name: data.business_name || '',
          business_type: data.business_type || '',
          industry: data.industry || '',
          establishment_date: data.establishment_date || '',
          employee_count: data.employee_count || '',
          business_structure: data.business_structure || '',
          business_location: data.business_location || '',
          city: data.city || '',
          business_area: data.business_area || '',
          real_estate_availability: data.real_estate_availability || '',
          has_rental_property: data.has_rental_property || '',
          rental_end_date: data.rental_end_date || '',
          has_renewal_option: data.has_renewal_option || '',
          renewal_duration: data.renewal_duration || '',
          monthly_rent: data.monthly_rent || '',
          rental_deposit_cost: data.rental_deposit_cost || '',
          operating_hours: data.operating_hours || '',
          owner_phone: data.owner_phone || '',
          licenses_permits: data.licenses_permits || [],
          other_license_details: data.other_license_details || '',
          seller_offers_support: data.seller_offers_support || '',
          support_duration: data.support_duration || '',
          can_be_relocated: data.can_be_relocated || '',
          is_franchise: data.is_franchise || '',
          property_details: data.property_details || '',
          sale_reason: data.sale_reason || '',
          legal_issues: data.legal_issues || '',
          additional_notes: data.additional_notes || '',
        },
      });

      // Save financial data
      await saveAssessmentData({
        ...sectionData,
        section: 'financial_data',
        data: {
          asking_price: data.asking_price || '',
          is_inventory_included_in_price: data.is_inventory_included_in_price || '',
          inventory_value_in_price: data.inventory_value_in_price || '',
          operating_profit: data.operating_profit || '',
          net_profit: data.net_profit || '',
          average_business_profit: data.average_business_profit || '',
          average_owner_salary: data.average_owner_salary || '',
          inventory_value: data.inventory_value || '',
          equipment_value: data.equipment_value || '',
          monthly_salary_expenses: data.monthly_salary_expenses || '',
          monthly_expenses: data.monthly_expenses || '',
          additional_payment_details: data.additional_payment_details || '',
          are_all_debts_paid: data.are_all_debts_paid || '',
          debt_details: data.debt_details || '',
          has_legal_claims: data.has_legal_claims || '',
          legal_claims_details: data.legal_claims_details || '',
          payment_terms: data.payment_terms || '',
          financial_notes: data.financial_notes || '',
        },
      });

      // Save SWOT analysis
      await saveAssessmentData({
        ...sectionData,
        section: 'swot_analysis',
        data: {
          strengths: data.strengths || '',
          weaknesses: data.weaknesses || '',
          opportunities: data.opportunities || '',
          threats: data.threats || '',
        },
      });
      
      // Then submit to webhook instead of analysis
      const result = await submitAssessmentToWebhook(assessment);
      if ('success' in result && result.success) {
        // Show loader at least 1 second before redirect so user can see it
        await new Promise(res => setTimeout(res, 1000));
        router.push(`/assessment/success?id=${assessment.id}`);
      } else {
        throw new Error('error' in result ? result.error : 'Failed to submit assessment to webhook');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      showAlert('אירעה שגיאה בעת שליחת השאלון. אנא נסה שוב מאוחר יותר.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteDraft = async () => {
    if (!user || !currentAssessmentId) {
      console.log('Missing user or currentAssessmentId:', { user, currentAssessmentId });
      showAlert('לא ניתן למחוק טיוטה זו', 'error');
      return;
    }

    try {
      console.log('Starting draft deletion process for assessment:', currentAssessmentId);
      const supabase = createClientComponentClient();

      // First verify the assessment exists and belongs to the user
      const { data: assessment, error: verifyError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', currentAssessmentId)
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
        .eq('assessment_id', currentAssessmentId);

      if (deleteDataError) {
        console.error('Error deleting assessment data:', deleteDataError);
        throw new Error('Failed to delete assessment data');
      }

      // List and delete files from storage
      console.log('Listing files to delete...');
      const { data: files, error: listError } = await supabase
        .storage
        .from('assessment-files')
        .list(`${user.id}/${currentAssessmentId}`);

      if (listError) {
        console.error('Error listing files:', listError);
        throw new Error('Failed to list assessment files');
      }

      if (files && files.length > 0) {
        console.log('Found files to delete:', files);
        const filePaths = files.map(file => `${user.id}/${currentAssessmentId}/${file.name}`);
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
        .eq('id', currentAssessmentId)
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
  
  // Note: Free users can create assessments but cannot upload files
  // The file upload step is conditionally hidden based on permissions.canUploadFiles

  return (
    <div className="max-w-4xl mx-auto px-4 mt-[24px]">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : (
        <>
          {isSubmitting && (
            <div className="fixed inset-0 z-[110000] bg-black/60 backdrop-blur-sm flex items-center justify-center" role="alert" aria-live="assertive">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-lg mx-4 transform transition-all duration-300 scale-100">
                {/* Header with icon */}
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    שולח את ההערכה שלך
                  </h3>
                  <p className="text-gray-600 text-sm">
                    אנא המתן בזמן שהמערכת מעבדת את הנתונים
                  </p>
                </div>

                {/* Progress steps */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">שמירת פרטי העסק</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">שמירת נתונים פיננסיים</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">שמירת ניתוח SWOT</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">שליחה למערכת הניתוח</span>
                  </div>
                </div>

                {/* Loading animation */}
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>

                {/* Important notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">חשוב לדעת:</p>
                      <p>אל תסגור או תרענן את העמוד עד לסיום התהליך. תקבל אישור כשההערכה תישלח בהצלחה.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Step progress indicator */}
          <div className="mt-6 mb-6">
            <div className="flex justify-between px-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center px-2 select-none group ${
                    isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ cursor: isTransitioning ? 'not-allowed' : 'pointer' }}
                  onClick={() => !isTransitioning && handleStepClick(index)}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                      index === currentStep
                        ? 'ring-4 ring-blue-100 text-white'
                        : 'bg-white border-gray-300 text-gray-500 group-hover:bg-[#4285F4] group-hover:border-[#4285F4] group-hover:text-white'
                    }`}
                    style={{ ...(index === currentStep ? { backgroundColor: '#4285F4', borderColor: '#4285F4' } : {}), cursor: 'pointer' }}
                  >
                    <span className="text-lg font-semibold select-none cursor-pointer">
                      {index + 1}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm text-center block min-w-[80px] select-none cursor-pointer ${
                        index === currentStep
                          ? 'font-bold text-[#4285F4]'
                          : 'text-gray-500 group-hover:text-[#4285F4]'
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
            
            {/* Auto-save indicator */}
            {isAutoSaving && (
              <div className="mt-2 flex items-center justify-center text-sm text-blue-600">
                <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                שומר טיוטה...
              </div>
            )}
          </div>
          
          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 divide-y divide-gray-200">
                {/* Render all steps but only show the active one to avoid mounting/unmounting glitches */}
                {steps.map((step, idx) => (
                  <div
                    key={`step-${idx}`}
                    style={{ display: idx === currentStep ? 'block' : 'none' }}
                  >
                    {idx === steps.length - 1 ? (
                      <ErrorBoundary>
                        <FileUploadForm assessmentId={currentAssessmentId} />
                      </ErrorBoundary>
                    ) : (
                      React.createElement(step.component)
                    )}
                  </div>
                ))}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-6">
                <div>
                  {currentAssessmentId && (
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
                      disabled={isSubmitting || isTransitioning}
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
                      disabled={isSubmitting || isTransitioning}
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
                      disabled={isSubmitting || isTransitioning}
                      data-next-button
                    >
                      {isTransitioning ? (
                        <>
                          <svg className="animate-spin h-4 w-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span className="ml-2">שומר...</span>
                        </>
                      ) : (
                        <>
                          הבא
                          <FiArrowLeft className="mr-2" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{ backgroundColor: "#4285F4", border: "2px solid #4285F4", cursor: "pointer" }}
                      className="text-white font-bold py-3 px-6 rounded-lg hover:bg-[#3367d6] transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          שולח...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4 mr-2" />
                          שלח הערכה
                        </>
                      )}
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