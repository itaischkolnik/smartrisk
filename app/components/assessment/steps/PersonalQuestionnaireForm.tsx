'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

const PersonalQuestionnaireForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">שאלון אישי</h2>
        <p className="mt-1 text-sm text-gray-600">
          ספר לנו יותר על הניסיון שלך, החוזקות שלך, והציפיות שלך מהעסק
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Life Experience */}
        <div>
          <label htmlFor="life_experience" className="block text-sm font-medium text-gray-700 mb-1">
            ניסיון חיים רלוונטי<span className="text-red-500">*</span>
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
            מוטיבציה לרכישת העסק<span className="text-red-500">*</span>
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
            יכולת כלכלית<span className="text-red-500">*</span>
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
            מטרות לחמש שנים<span className="text-red-500">*</span>
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

export default PersonalQuestionnaireForm; 