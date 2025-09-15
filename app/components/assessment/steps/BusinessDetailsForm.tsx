'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiAlertCircle, FiHelpCircle } from 'react-icons/fi';

interface FormInputs {
  business_name: string;
  business_type: string;
  industry: string;
  establishment_date: string;
  employee_count: number;
  business_structure: string;
  business_location: string;
  operating_hours: string;
  property_details: string;
  sale_reason: string;
  legal_issues: string;
  additional_notes: string;
  owner_phone: string;
  business_area: string;
  real_estate_availability: string;
  has_rental_property: string;
  rental_end_date: string;
  has_renewal_option: string;
  renewal_duration: string;
  monthly_rent: string;
  rental_deposit_cost: string;
  licenses_permits: string[];
  other_license_details: string;
  seller_offers_support: string;
  support_duration: string;
  can_relocate: string;
  is_franchise: string;
  city: string;
}

const BusinessDetailsForm: React.FC = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormInputs>();

  const hasRentalProperty = watch('has_rental_property');
  const hasRenewalOption = watch('has_renewal_option');
  const licensesPermits = watch('licenses_permits') || [];
  const sellerOffersSupport = watch('seller_offers_support');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">פרטי העסק</h2>
        <p className="mt-1 text-sm text-gray-600">
          אנא ספק מידע מפורט על העסק שברצונך לרכוש או להעריך
        </p>
      </div>

      {/* First row: שם העסק, מספר עובדים, סטטוס משפטי */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          {errors.business_name?.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="ml-1" />
              {errors.business_name.message}
            </p>
          )}
        </div>

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
            סטטוס משפטי
          </label>
          <select
            id="business_structure"
            {...register('business_structure')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">בחר סטטוס משפטי</option>
            <option value="sole_proprietorship">עוסק מורשה</option>
            <option value="partnership">שותפות</option>
            <option value="limited_company">חברה בע״מ</option>
            <option value="public_company">חברה ציבורית</option>
            <option value="other">אחר</option>
          </select>
        </div>
      </div>

      {/* Second row: סוג העסק, תאריך הקמה, שטח העסק */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          {errors.business_type?.message && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="ml-1" />
              {errors.business_type.message}
            </p>
          )}
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

        <div>
          <label htmlFor="business_area" className="block text-sm font-medium text-gray-700">
            שטח העסק
          </label>
          <input
            type="text"
            id="business_area"
            {...register('business_area')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="לדוגמה: 100 מ״ר"
          />
        </div>
      </div>

      {/* Third row: תחום פעילות, כתובת העסק, עיר, שעות פעילות */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            כתובת העסק
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
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            עיר
          </label>
          <input
            type="text"
            id="city"
            {...register('city')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="לדוגמה: תל אביב"
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

      {/* Fourth row: זמינות נדל״נית, טלפון הבעלים, שכר דירה חודשי */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center">
            <label htmlFor="real_estate_availability" className="block text-sm font-medium text-gray-700">
              זמינות נדל״נית
            </label>
            <div className="relative ml-1">
              <FiHelpCircle 
                className="h-4 w-4 text-gray-400 cursor-help"
                title="האם הנכס זמין לרכישה או השכרה, או שהוא כבר בבעלות העסק"
              />
            </div>
          </div>
          <input
            type="text"
            id="real_estate_availability"
            {...register('real_estate_availability')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="לדוגמה: נכס בבעלות, שכירות, זמין לרכישה"
          />
        </div>

        <div>
          <label htmlFor="owner_phone" className="block text-sm font-medium text-gray-700">
            טלפון הבעלים
          </label>
          <input
            type="tel"
            id="owner_phone"
            {...register('owner_phone')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="לדוגמה: 050-1234567"
          />
        </div>

        <div>
          <label htmlFor="monthly_rent" className="block text-sm font-medium text-gray-700">
            שכר דירה חודשי
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="number"
              id="monthly_rent"
              {...register('monthly_rent')}
              className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Fifth row: עלות פיקדון שכר דירה */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="rental_deposit_cost" className="block text-sm font-medium text-gray-700">
            עלות פיקדון שכר דירה
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="number"
              id="rental_deposit_cost"
              {...register('rental_deposit_cost')}
              className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Sixth row: יש נדל״ן בשכירות? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            יש נדל״ן בשכירות?
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <input
                type="radio"
                id="has_rental_yes"
                value="yes"
                {...register('has_rental_property')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="has_rental_yes" className="mr-2 text-sm text-gray-700">
                כן
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="has_rental_no"
                value="no"
                {...register('has_rental_property')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="has_rental_no" className="mr-2 text-sm text-gray-700">
                לא
              </label>
            </div>
          </div>
          
          {hasRentalProperty === 'yes' && (
            <div className="mt-4">
              <label htmlFor="rental_end_date" className="block text-sm font-medium text-gray-700">
                מועד סיום השכירות
              </label>
              <input
                type="date"
                id="rental_end_date"
                {...register('rental_end_date')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Seventh row: קיימת אופציה לחידוש? */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            קיימת אופציה לחידוש?
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <input
                type="radio"
                id="has_renewal_yes"
                value="yes"
                {...register('has_renewal_option')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="has_renewal_yes" className="mr-2 text-sm text-gray-700">
                כן
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="has_renewal_no"
                value="no"
                {...register('has_renewal_option')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="has_renewal_no" className="mr-2 text-sm text-gray-700">
                לא
              </label>
            </div>
          </div>
          
          {hasRenewalOption === 'yes' && (
            <div className="mt-4">
              <label htmlFor="renewal_duration" className="block text-sm font-medium text-gray-700">
                לכמה זמן?
              </label>
              <input
                type="text"
                id="renewal_duration"
                {...register('renewal_duration')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="לדוגמה: 5 שנים, 3 שנים + 2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Licenses and permits section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            רשיונות ואישורים קיימים
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="license_business"
                value="רישיון עסק"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="license_business" className="mr-2 text-sm text-gray-700">
                רישיון עסק
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="health_ministry"
                value="אישור משרד הבריאות"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="health_ministry" className="mr-2 text-sm text-gray-700">
                אישור משרד הבריאות
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="fire_approval"
                value="אישור כיבוי אש"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="fire_approval" className="mr-2 text-sm text-gray-700">
                אישור כיבוי אש
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="environment_approval"
                value="אישור איכות הסביבה"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="environment_approval" className="mr-2 text-sm text-gray-700">
                אישור איכות הסביבה
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="all_required"
                value="יש את כל האישורים הנדרשים"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="all_required" className="mr-2 text-sm text-gray-700">
                יש את כל האישורים הנדרשים
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="other_license"
                value="אחר"
                {...register('licenses_permits')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="other_license" className="mr-2 text-sm text-gray-700">
                אחר
              </label>
            </div>
            
            {Array.isArray(licensesPermits) && licensesPermits.includes('אחר') && (
              <div className="mt-4">
                <label htmlFor="other_license_details" className="block text-sm font-medium text-gray-700">
                  פרט אישורים אחרים
                </label>
                <input
                  type="text"
                  id="other_license_details"
                  {...register('other_license_details')}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="פרט אישורים נוספים"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seller support section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            האם המוכר מציע תמיכה ו/או הדרכה?
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <input
                type="radio"
                id="seller_support_yes"
                value="yes"
                {...register('seller_offers_support')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="seller_support_yes" className="mr-2 text-sm text-gray-700">
                כן
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="seller_support_no"
                value="no"
                {...register('seller_offers_support')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="seller_support_no" className="mr-2 text-sm text-gray-700">
                לא
              </label>
            </div>
          </div>
          
          {sellerOffersSupport === 'yes' && (
            <div className="mt-4">
              <label htmlFor="support_duration" className="block text-sm font-medium text-gray-700">
                לכמה זמן?
              </label>
              <input
                type="text"
                id="support_duration"
                {...register('support_duration')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="לדוגמה: חודש, 3 חודשים, עד התאקלמות"
              />
            </div>
          )}
        </div>
      </div>

      {/* Relocation section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            האם ניתן להעברה למיקום אחר?
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <input
                type="radio"
                id="relocatable_yes"
                value="yes"
                {...register('can_relocate')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="relocatable_yes" className="mr-2 text-sm text-gray-700">
                כן
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="relocatable_no"
                value="no"
                {...register('can_relocate')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="relocatable_no" className="mr-2 text-sm text-gray-700">
                לא
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Franchise section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            האם העסק הוא זכיינות?
          </label>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="flex items-center">
              <input
                type="radio"
                id="franchise_yes"
                value="yes"
                {...register('is_franchise')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="franchise_yes" className="mr-2 text-sm text-gray-700">
                כן
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="franchise_no"
                value="no"
                {...register('is_franchise')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="franchise_no" className="mr-2 text-sm text-gray-700">
                לא
              </label>
            </div>
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