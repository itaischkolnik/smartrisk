'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

const SwotAnalysisForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ניתוח SWOT</h2>
        <p className="mt-1 text-sm text-gray-600">
          ניתוח חוזקות, חולשות, הזדמנויות ואיומים של העסק
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-700 mb-2">חוזקות (Strengths)</h3>
          <p className="text-sm text-gray-600 mb-4">מהם היתרונות והחוזקות של העסק?</p>
          <textarea
            className="w-full border-green-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="מיקום מצוין, מוניטין חיובי, צוות מנוסה..."
            {...register("strengths")}
          />
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-700 mb-2">חולשות (Weaknesses)</h3>
          <p className="text-sm text-gray-600 mb-4">מהם החסרונות והחולשות של העסק?</p>
          <textarea
            className="w-full border-red-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="תחרות חזקה, ציוד מיושן, תלות בספק יחיד..."
            {...register("weaknesses")}
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-700 mb-2">הזדמנויות (Opportunities)</h3>
          <p className="text-sm text-gray-600 mb-4">אילו הזדמנויות קיימות לעסק?</p>
          <textarea
            className="w-full border-blue-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="שווקים חדשים, טכנולוגיות חדשות, שינויים ברגולציה..."
            {...register("opportunities")}
          />
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-700 mb-2">איומים (Threats)</h3>
          <p className="text-sm text-gray-600 mb-4">אילו איומים קיימים על העסק?</p>
          <textarea
            className="w-full border-yellow-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            rows={4}
            placeholder="מתחרים חדשים, שינויים בשוק, מגבלות רגולטוריות..."
            {...register("threats")}
          />
        </div>
      </div>
    </div>
  );
};

export default SwotAnalysisForm; 