'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
              התכונות שלנו
        </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              כלים מקצועיים וטכניקות מתקדמות לעסקאות עסקיות מוצלחות
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Core Features Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">הכלים המרכזיים שלנו</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-right">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">ניתוח דוחות כספיים</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ניתוח מעמיק של דוחות כספיים, זיהוי מגמות, הערכת רווחיות וניתוח סיכונים מקצועי
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">ניתוח החזר השקעה</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ניתוח מעמיק של החזר השקעה, כולל חישובי ROI, ניתוח תזרים מזומנים והערכת כדאיות פיננסית
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">ניתוח סיכונים</h3>
                  <p className="text-gray-600 leading-relaxed">
                    זיהוי וניתוח סיכונים פיננסיים, תפעליים ושוק, עם המלצות להתמודדות
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">תחזית פיננסית</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ניתוח מגמות עבר, תכנון פיננסי ותרחישים שונים
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">דוחות מקצועיים</h3>
                  <p className="text-gray-600 leading-relaxed">
                    דוחות מפורטים עם תובנות מעשיות והמלצות אסטרטגיות לפעולה
                  </p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-4 mx-auto">
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">מדריכים מעשיים</h3>
                  <p className="text-gray-600 leading-relaxed">
                    מדריכים מקצועיים המבוססים על ניסיון אמיתי בעולם העסקים הישראלי
                  </p>
                </div>
              </div>
            </div>

            {/* Process Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">תהליך העבודה שלנו</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">איסוף מידע</h3>
                  <p className="text-gray-600">
                    איסוף מקיף של מידע על העסק, השוק והמגמות הרלוונטיות
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">ניתוח מעמיק</h3>
                  <p className="text-gray-600">
                    ניתוח פיננסי, תפעלי ושוק באמצעות כלים מקצועיים מתקדמים
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">זיהוי סיכונים</h3>
                  <p className="text-gray-600">
                    זיהוי סיכונים פוטנציאליים והערכת השפעתם על העסקה
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">המלצות מעשיות</h3>
                  <p className="text-gray-600">
                    חושפים נורות אדומות שצריך לשים אליהם לב ולבדוק אותם
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">היתרונות שלנו</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-right">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">ניסיון מעשי</h3>
                  <p className="text-gray-700 leading-relaxed">
                    כל הכלים והטכניקות מבוססים על ניסיון אמיתי של 15+ שנים בעולם העסקים הישראלי. 
                    לא תיאוריה - רק מה שעובד בשטח.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">גישה מעשית</h3>
                  <p className="text-gray-700 leading-relaxed">
                    אנחנו לא רק נותנים לך ניתוח - אנחנו נותנים לך כלים מעשיים ופעולות ספציפיות 
                    שאתה יכול ליישם מיד.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">התאמה אישית</h3>
                  <p className="text-gray-700 leading-relaxed">
                    כל ניתוח מותאם ספציפית לעסק שלך, לתחום שלך ולמטרות שלך. 
                    אין פתרונות "אחד מתאים לכולם".
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">תמיכה מתמשכת</h3>
                  <p className="text-gray-700 leading-relaxed">
                    אנחנו לא נעלמים אחרי הניתוח - אנחנו כאן כדי ללוות אותך לאורך כל התהליך 
                    ולעזור לך להצליח.
                  </p>
                </div>
              </div>
          </div>
        </div>
      </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 