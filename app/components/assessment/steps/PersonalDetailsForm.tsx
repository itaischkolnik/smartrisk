'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Validation schema for this step
const personalDetailsSchema = z.object({
  full_name: z.string().min(2, 'נדרש שם מלא'),
  age: z.number().min(18, 'גיל חייב להיות לפחות 18')
    .max(120, 'גיל חייב להיות עד 120')
    .or(z.string().regex(/^\d+$/).transform(Number)),
  location: z.string().min(2, 'יש לציין אזור מגורים'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed'], {
    errorMap: () => ({ message: 'יש לבחור מצב משפחתי' }),
  }),
  occupation: z.string().min(2, 'יש לציין עיסוק נוכחי'),
  self_introduction: z.string().min(10, 'יש לספק הצגה עצמית של לפחות 10 תווים'),
});

type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

const PersonalDetailsForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">פרטים אישיים</h2>
        <p className="mt-1 text-sm text-gray-600">
          המידע האישי שלך עוזר לנו להתאים את ההערכה לנסיבות הספציפיות שלך
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
            טלפון נייד<span className="text-red-500">*</span>
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
            אזור מגורים<span className="text-red-500">*</span>
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
            מצב משפחתי<span className="text-red-500">*</span>
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
        <div className="col-span-2">
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
            עיסוק נוכחי<span className="text-red-500">*</span>
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

        {/* Self Introduction */}
        <div className="col-span-2">
          <label htmlFor="self_introduction" className="block text-sm font-medium text-gray-700 mb-1">
            הצגה עצמית במשפט<span className="text-red-500">*</span>
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

export default PersonalDetailsForm; 