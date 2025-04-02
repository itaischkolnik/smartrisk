'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';

const BusinessDetailsForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">פרטי העסק</h2>
        <p className="mt-1 text-sm text-gray-600">
          אנא ספק מידע מפורט על העסק שברצונך לרכוש או להעריך
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Business Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
              שם העסק
            </label>
            <input
              type="text"
              id="business_name"
              {...register('business_name')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.business_name && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="ml-1" />
                {errors.business_name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
              סוג העסק
            </label>
            <select
              id="business_type"
              {...register('business_type')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">בחר סוג עסק</option>
              <option value="retail">קמעונאות</option>
              <option value="restaurant">מסעדנות</option>
              <option value="service">שירותים</option>
              <option value="manufacturing">ייצור</option>
              <option value="tech">טכנולוגיה</option>
              <option value="other">אחר</option>
            </select>
            {errors.business_type && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="ml-1" />
                {errors.business_type.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              תחום פעילות
            </label>
            <input
              type="text"
              id="industry"
              {...register('industry')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="לדוגמה: מזון, אופנה, תוכנה"
            />
          </div>

          <div>
            <label htmlFor="establishment_date" className="block text-sm font-medium text-gray-700">
              תאריך הקמה
            </label>
            <input
              type="date"
              id="establishment_date"
              {...register('establishment_date')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Business Operations */}
        <div className="space-y-4">
          <div>
            <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700">
              מספר עובדים
            </label>
            <input
              type="number"
              id="employee_count"
              {...register('employee_count')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="business_structure" className="block text-sm font-medium text-gray-700">
              מבנה משפטי
            </label>
            <select
              id="business_structure"
              {...register('business_structure')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">בחר מבנה משפטי</option>
              <option value="sole_proprietorship">עוסק מורשה</option>
              <option value="partnership">שותפות</option>
              <option value="limited_company">חברה בע״מ</option>
              <option value="public_company">חברה ציבורית</option>
              <option value="other">אחר</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              מיקום העסק
            </label>
            <input
              type="text"
              id="location"
              {...register('business_location')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="כתובת מלאה"
            />
          </div>

          <div>
            <label htmlFor="operating_hours" className="block text-sm font-medium text-gray-700">
              שעות פעילות
            </label>
            <input
              type="text"
              id="operating_hours"
              {...register('operating_hours')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="לדוגמה: א-ה 9:00-18:00, ו 9:00-14:00"
            />
          </div>
        </div>
      </div>

      {/* Additional Business Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="property_details" className="block text-sm font-medium text-gray-700">
            פרטי הנכס
          </label>
          <textarea
            id="property_details"
            {...register('property_details')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="פרט את מצב הנכס, גודל, חוזה שכירות, עלויות וכו׳"
          />
        </div>

        <div>
          <label htmlFor="sale_reason" className="block text-sm font-medium text-gray-700">
            סיבת המכירה
          </label>
          <textarea
            id="sale_reason"
            {...register('sale_reason')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="מדוע העסק מוצע למכירה?"
          />
        </div>

        <div>
          <label htmlFor="legal_issues" className="block text-sm font-medium text-gray-700">
            סוגיות משפטיות
          </label>
          <textarea
            id="legal_issues"
            {...register('legal_issues')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="פרט תביעות משפטיות, התחייבויות או סוגיות משפטיות אחרות"
          />
        </div>

        <div>
          <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700">
            הערות נוספות
          </label>
          <textarea
            id="additional_notes"
            {...register('additional_notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="מידע נוסף שחשוב לציין"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsForm; 