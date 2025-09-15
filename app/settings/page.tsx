'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiSave, FiUser, FiClipboard } from 'react-icons/fi';
import DashboardLayout from '../components/layout/DashboardLayout';

// Validation schema for personal details
const personalDetailsSchema = z.object({
  full_name: z.string().min(2, 'נדרש שם מלא'),
  age: z.string().min(1, 'נדרש גיל'),
  location: z.string().optional(),
  marital_status: z.string().optional(),
  mobile_phone: z.string().optional(),
  occupation: z.string().optional(),
  self_introduction: z.string().optional(),
  subscription: z.string().optional(),
  // Personal questionnaire fields
  life_experience: z.string().optional(),
  motivation: z.string().optional(),
  financial_capability: z.string().optional(),
  five_year_goals: z.string().optional(),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'questionnaire'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>('');

  const methods = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
         defaultValues: {
       full_name: '',
       age: '',
       location: '',
       marital_status: '',
       mobile_phone: '',
       occupation: '',
       self_introduction: '',
       subscription: 'חינם',
       life_experience: '',
       motivation: '',
       financial_capability: '',
       five_year_goals: '',
     },
  });

  // Auto-save functionality
  useEffect(() => {
    const subscription = methods.watch((value) => {
      const currentData = JSON.stringify(value);
      if (currentData !== lastSavedData && dataLoaded) {
        // Debounce auto-save
        const timeoutId = setTimeout(() => {
          handleAutoSave(value);
        }, 2000); // Auto-save after 2 seconds of inactivity

        return () => clearTimeout(timeoutId);
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, lastSavedData, dataLoaded]);

  const handleAutoSave = async (data: any) => {
    if (!user || !dataLoaded) return;

    try {
      const supabase = createClientComponentClient();
      
      // Auto-save without showing success message
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: data.full_name || '',
          age: data.age ? parseInt(data.age) : null,
          location: data.location || '',
          marital_status: data.marital_status || '',
          mobile_phone: data.mobile_phone || '',
          occupation: data.occupation || '',
          self_introduction: data.self_introduction || '',
                     life_experience: data.life_experience || '',
           motivation: data.motivation || '',
           financial_capability: data.financial_capability || '',
           five_year_goals: data.five_year_goals || '',
           subscription: data.subscription || 'חינם',
           updated_at: new Date().toISOString(),
        });

      if (!error) {
        setLastSavedData(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    }
  };

  // Load user's personal details
  useEffect(() => {
    const loadPersonalDetails = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        
        // Get user's personal details from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error loading profile:', error);
        }

        if (profile && !dataLoaded) {
          // Use setValue to preserve any existing user input
          methods.setValue('full_name', profile.full_name || '');
          methods.setValue('age', profile.age?.toString() || '');
          methods.setValue('location', profile.location || '');
          methods.setValue('marital_status', profile.marital_status || '');
          methods.setValue('mobile_phone', profile.mobile_phone || '');
          methods.setValue('occupation', profile.occupation || '');
          methods.setValue('self_introduction', profile.self_introduction || '');
                     methods.setValue('life_experience', profile.life_experience || '');
           methods.setValue('motivation', profile.motivation || '');
           methods.setValue('financial_capability', profile.financial_capability || '');
           methods.setValue('five_year_goals', profile.five_year_goals || '');
           methods.setValue('subscription', profile.subscription || 'חינם');
           setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading personal details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonalDetails();
  }, [user, methods, dataLoaded]);

  const onSubmit = async (data: PersonalDetailsData) => {
    if (!user) return;

    try {
      setIsSaving(true);
      setSaveMessage(null);
      
      const supabase = createClientComponentClient();
      
      // Upsert profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: data.full_name,
          age: data.age ? parseInt(data.age) : null,
          location: data.location,
          marital_status: data.marital_status,
          mobile_phone: data.mobile_phone,
          occupation: data.occupation,
          self_introduction: data.self_introduction,
          subscription: data.subscription || 'חינם',
          life_experience: data.life_experience,
          motivation: data.motivation,
          financial_capability: data.financial_capability,
          five_year_goals: data.five_year_goals,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      setSaveMessage({ type: 'success', message: 'הפרטים נשמרו בהצלחה' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving personal details:', error);
      setSaveMessage({ type: 'error', message: 'אירעה שגיאה בשמירת הפרטים' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            פרטים אישיים
          </h1>
          
          {/* Save message */}
          {saveMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {saveMessage.message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Tabs - Styled like the assessment form */}
            <div className="border-b border-gray-200">
              <div className="flex justify-center px-8 py-4 space-x-16">
                <div
                  className={`flex flex-col items-center px-4 select-none group cursor-pointer ${
                    activeTab === 'personal' ? 'text-[#4285F4]' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('personal')}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                      activeTab === 'personal'
                        ? 'ring-4 ring-blue-100 text-white'
                        : 'bg-white border-gray-300 text-gray-500 group-hover:bg-[#4285F4] group-hover:border-[#4285F4] group-hover:text-white'
                    }`}
                    style={{ ...(activeTab === 'personal' ? { backgroundColor: '#4285F4', borderColor: '#4285F4' } : {}) }}
                  >
                    <FiUser className="text-lg" />
                  </div>
                  <div className="mt-2">
                    <span className={`text-sm text-center block font-medium ${
                      activeTab === 'personal'
                        ? 'font-bold text-[#4285F4]'
                        : 'text-gray-500 group-hover:text-[#4285F4]'
                    }`}>
                      פרטים אישיים
                    </span>
                  </div>
                </div>

                <div
                  className={`flex flex-col items-center px-4 select-none group cursor-pointer ${
                    activeTab === 'questionnaire' ? 'text-[#4285F4]' : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab('questionnaire')}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                      activeTab === 'questionnaire'
                        ? 'ring-4 ring-blue-100 text-white'
                        : 'bg-white border-gray-300 text-gray-500 group-hover:bg-[#4285F4] group-hover:border-[#4285F4] group-hover:text-white'
                    }`}
                    style={{ ...(activeTab === 'questionnaire' ? { backgroundColor: '#4285F4', borderColor: '#4285F4' } : {}) }}
                  >
                    <FiClipboard className="text-lg" />
                  </div>
                  <div className="mt-2">
                    <span className={`text-sm text-center block font-medium ${
                      activeTab === 'questionnaire'
                        ? 'font-bold text-[#4285F4]'
                        : 'text-gray-500 group-hover:text-[#4285F4]'
                    }`}>
                      שאלון אישי
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="px-8 pb-4">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-[#3b82f6] rounded-full transition-all duration-300"
                    style={{ width: activeTab === 'personal' ? '50%' : '100%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Form */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="p-8">
                <div className="min-h-[600px]">
                  {activeTab === 'personal' ? (
                    <PersonalDetailsTab />
                  ) : (
                    <PersonalQuestionnaireTab />
                  )}
                </div>

                {/* Save button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary btn-lg"
                  >
                    <FiSave className="ml-2 h-4 w-4" />
                    {isSaving ? 'שומר...' : 'שמור פרטים'}
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Personal Details Tab Component
const PersonalDetailsTab: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<PersonalDetailsData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">פרטים אישיים</h2>
        <p className="mt-1 text-sm text-gray-600">
          המידע האישי שלך יישמר ויוטען אוטומטית בעת יצירת הערכות חדשות
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            שם מלא<span className="text-red-500">*</span>
          </label>
          <input
            id="full_name"
            type="text"
            {...register('full_name')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.full_name.message?.toString()}
            </p>
          )}
        </div>

        {/* Age */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            גיל<span className="text-red-500">*</span>
          </label>
          <input
            id="age"
            type="number"
            min="18"
            max="120"
            {...register('age')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">
              {errors.age.message?.toString()}
            </p>
          )}
        </div>

        {/* Mobile Phone */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="mobile_phone" className="block text-sm font-medium text-gray-700 mb-1">
            טלפון נייד
          </label>
          <input
            id="mobile_phone"
            type="tel"
            {...register('mobile_phone')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="050-1234567"
          />
          {errors.mobile_phone && (
            <p className="mt-1 text-sm text-red-600">
              {String(errors.mobile_phone.message)}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            אזור מגורים
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message?.toString()}
            </p>
          )}
        </div>

        {/* Marital Status */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700 mb-1">
            מצב משפחתי
          </label>
          <select
            id="marital_status"
            {...register('marital_status')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          >
            <option value="">בחר מצב משפחתי</option>
            <option value="single">רווק/ה</option>
            <option value="married">נשוי/אה</option>
            <option value="divorced">גרוש/ה</option>
            <option value="widowed">אלמן/ה</option>
          </select>
          {errors.marital_status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.marital_status.message?.toString()}
            </p>
          )}
        </div>

        {/* Occupation */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
            עיסוק נוכחי
          </label>
          <input
            id="occupation"
            type="text"
            {...register('occupation')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          />
          {errors.occupation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.occupation.message?.toString()}
            </p>
          )}
        </div>

        {/* Subscription */}
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="subscription" className="block text-sm font-medium text-gray-700 mb-1">
            מנוי
          </label>
          <select
            id="subscription"
            {...register('subscription')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
          >
            <option value="חינם">חינם</option>
            <option value="יזם">יזם</option>
            <option value="איש עסקים">איש עסקים</option>
            <option value="מקצועי">מקצועי</option>
          </select>
          {errors.subscription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.subscription.message?.toString()}
            </p>
          )}
        </div>

        {/* Self Introduction */}
        <div className="col-span-2">
          <label htmlFor="self_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            הצגה עצמית במשפט
          </label>
          <textarea
            id="self_introduction"
            rows={3}
            {...register('self_introduction')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="תאר את עצמך במשפט קצר"
          />
          {errors.self_introduction && (
            <p className="mt-1 text-sm text-red-600">
              {errors.self_introduction.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Personal Questionnaire Tab Component
const PersonalQuestionnaireTab: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<PersonalDetailsData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">שאלון אישי</h2>
        <p className="mt-1 text-sm text-gray-600">
          המידע הזה יישמר ויוטען אוטומטית בעת יצירת הערכות חדשות
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Life Experience */}
        <div>
          <label htmlFor="life_experience" className="block text-sm font-medium text-gray-700 mb-1">
            ניסיון חיים רלוונטי
          </label>
          <textarea
            id="life_experience"
            rows={3}
            {...register('life_experience')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="תאר את הניסיון הרלוונטי שלך לניהול עסק"
          />
          {errors.life_experience && (
            <p className="mt-1 text-sm text-red-600">
              {errors.life_experience.message?.toString()}
            </p>
          )}
        </div>

        {/* Motivation */}
        <div>
          <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 mb-1">
            מוטיבציה לרכישת העסק
          </label>
          <textarea
            id="motivation"
            rows={3}
            {...register('motivation')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="מה מניע אותך לרכוש את העסק?"
          />
          {errors.motivation && (
            <p className="mt-1 text-sm text-red-600">
              {errors.motivation.message?.toString()}
            </p>
          )}
        </div>

        {/* Financial Capability */}
        <div>
          <label htmlFor="financial_capability" className="block text-sm font-medium text-gray-700 mb-1">
            יכולת כלכלית
          </label>
          <textarea
            id="financial_capability"
            rows={3}
            {...register('financial_capability')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="תאר את היכולת הכלכלית שלך לרכישת והפעלת העסק"
          />
          {errors.financial_capability && (
            <p className="mt-1 text-sm text-red-600">
              {errors.financial_capability.message?.toString()}
            </p>
          )}
        </div>

        {/* Five Year Goals */}
        <div>
          <label htmlFor="five_year_goals" className="block text-sm font-medium text-gray-700 mb-1">
            מטרות לחמש שנים
          </label>
          <textarea
            id="five_year_goals"
            rows={3}
            {...register('five_year_goals')}
            className="block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
            placeholder="מהן המטרות שלך לחמש השנים הקרובות עם העסק?"
          />
          {errors.five_year_goals && (
            <p className="mt-1 text-sm text-red-600">
              {errors.five_year_goals.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}; 