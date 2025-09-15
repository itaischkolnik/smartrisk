'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';

const FinancialDataForm: React.FC = () => {
  const { register, formState: { errors }, watch } = useFormContext();
  
  const isInventoryIncluded = watch('is_inventory_included_in_price');
  const areDebtsPaid = watch('are_all_debts_paid');
  const hasLegalClaims = watch('has_legal_claims');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">נתונים כספיים</h2>
        <p className="mt-1 text-sm text-gray-600">
          אנא מלא את הנתונים הכספיים של העסק. נתונים אלו חיוניים להערכת שווי העסק
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Column - Main Financial Data */}
        <div className="space-y-6">
          {/* Basic Financial Information */}
          <div className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                האם המלאי כלול במחיר המבוקש?
              </label>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="inventory_included_yes"
                    value="yes"
                    {...register('is_inventory_included_in_price')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="inventory_included_yes" className="mr-2 text-sm text-gray-700">
                    כן
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="inventory_included_no"
                    value="no"
                    {...register('is_inventory_included_in_price')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="inventory_included_no" className="mr-2 text-sm text-gray-700">
                    לא
                  </label>
                </div>
              </div>
              
              {isInventoryIncluded === 'no' && (
                <div className="mt-4">
                  <label htmlFor="inventory_value_in_price" className="block text-sm font-medium text-gray-700">
                    מה שווי המלאי?
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₪</span>
                    </div>
                    <input
                      type="number"
                      id="inventory_value_in_price"
                      {...register('inventory_value_in_price')}
                      className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profit & Loss Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">נתוני רווח והפסד</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="operating_profit" className="block text-sm font-medium text-gray-700">
                  ממוצע מחזור שנתי
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

              <div>
                <label htmlFor="average_business_profit" className="block text-sm font-medium text-gray-700">
                  ממוצע שנתי של רווח העסק
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₪</span>
                  </div>
                  <input
                    type="number"
                    id="average_business_profit"
                    {...register('average_business_profit')}
                    className="block w-full pr-3 pl-7 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="average_owner_salary" className="block text-sm font-medium text-gray-700">
                  ממוצע שנתי משכורת בעלים
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₪</span>
                  </div>
                  <input
                    type="number"
                    id="average_owner_salary"
                    {...register('average_owner_salary')}
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
        </div>

        {/* Right Column - Additional Financial Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">פרטים נוספים</h3>
          
          <div>
            <label htmlFor="additional_payment_details" className="block text-sm font-medium text-gray-700">
              איך הלקוחות משלמים?
            </label>
            <select
              id="additional_payment_details"
              {...register('additional_payment_details')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">בחר אפשרות</option>
              <option value="מזומן">מזומן</option>
              <option value="אשראי">אשראי</option>
              <option value="שוטף">שוטף</option>
              <option value="שוטף+30">שוטף+30</option>
              <option value="שוטף+60">שוטף+60</option>
              <option value="שוטף+90">שוטף+90</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              האם שולמו כל חובות העסק?
            </label>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="debts_paid_yes"
                  value="yes"
                  {...register('are_all_debts_paid')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="debts_paid_yes" className="mr-2 text-sm text-gray-700">
                  כן
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="debts_paid_no"
                  value="no"
                  {...register('are_all_debts_paid')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="debts_paid_no" className="mr-2 text-sm text-gray-700">
                  לא
                </label>
              </div>
            </div>
            
            {areDebtsPaid === 'no' && (
              <div className="mt-4">
                <label htmlFor="debt_details" className="block text-sm font-medium text-gray-700">
                  נא לפרט
                </label>
                <textarea
                  id="debt_details"
                  {...register('debt_details')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="פרט את החובות הקיימים"
                />
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              האם יש תביעות קיימות / הליכים נגד העסק?
            </label>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="legal_claims_yes"
                  value="yes"
                  {...register('has_legal_claims')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="legal_claims_yes" className="mr-2 text-sm text-gray-700">
                  כן
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="legal_claims_no"
                  value="no"
                  {...register('has_legal_claims')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="legal_claims_no" className="mr-2 text-sm text-gray-700">
                  לא
                </label>
              </div>
            </div>
            
            {hasLegalClaims === 'yes' && (
              <div className="mt-4">
                <label htmlFor="legal_claims_details" className="block text-sm font-medium text-gray-700">
                  נא לפרט
                </label>
                <textarea
                  id="legal_claims_details"
                  {...register('legal_claims_details')}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="פרט את התביעות וההליכים הקיימים"
                />
              </div>
            )}
          </div>

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
    </div>
  );
};

export default FinancialDataForm; 