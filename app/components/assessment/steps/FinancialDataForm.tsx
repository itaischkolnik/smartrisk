'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';

const FinancialDataForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">נתונים כספיים</h2>
        <p className="mt-1 text-sm text-gray-600">
          אנא מלא את הנתונים הכספיים של העסק. נתונים אלו חיוניים להערכת שווי העסק
        </p>
      </div>

      {/* Basic Financial Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="asking_price" className="block text-sm font-medium text-gray-700">
            מחיר מבוקש
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="number"
              id="asking_price"
              {...register('asking_price')}
              className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          {errors.asking_price && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="ml-1" />
              {String(errors.asking_price.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="annual_revenue" className="block text-sm font-medium text-gray-700">
            מחזור שנתי
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">₪</span>
            </div>
            <input
              type="number"
              id="annual_revenue"
              {...register('annual_revenue')}
              className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
          </div>
          {errors.annual_revenue && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <FiAlertCircle className="ml-1" />
              {String(errors.annual_revenue.message)}
            </p>
          )}
        </div>
      </div>

      {/* Profit & Loss Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">נתוני רווח והפסד</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="operating_profit" className="block text-sm font-medium text-gray-700">
              רווח תפעולי
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="operating_profit"
                {...register('operating_profit')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="net_profit" className="block text-sm font-medium text-gray-700">
              רווח נקי
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="net_profit"
                {...register('net_profit')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Asset Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">נכסים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inventory_value" className="block text-sm font-medium text-gray-700">
              שווי מלאי
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="inventory_value"
                {...register('inventory_value')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="equipment_value" className="block text-sm font-medium text-gray-700">
              שווי ציוד
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="equipment_value"
                {...register('equipment_value')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Operating Expenses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">הוצאות תפעוליות</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="monthly_salary_expenses" className="block text-sm font-medium text-gray-700">
              הוצאות שכר חודשיות
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="monthly_salary_expenses"
                {...register('monthly_salary_expenses')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="monthly_expenses" className="block text-sm font-medium text-gray-700">
              הוצאות תפעול חודשיות
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₪</span>
              </div>
              <input
                type="number"
                id="monthly_expenses"
                {...register('monthly_expenses')}
                className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Financial Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">פרטים נוספים</h3>
        <div>
          <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">
            תנאי תשלום
          </label>
          <textarea
            id="payment_terms"
            {...register('payment_terms')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="פרט את תנאי התשלום המוצעים"
          />
        </div>

        <div>
          <label htmlFor="financial_notes" className="block text-sm font-medium text-gray-700">
            הערות פיננסיות נוספות
          </label>
          <textarea
            id="financial_notes"
            {...register('financial_notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="מידע פיננסי נוסף שחשוב לציין"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialDataForm; 