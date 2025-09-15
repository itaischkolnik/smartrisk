'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiShield, FiEye, FiCpu, FiUsers, FiLock, FiArrowRight, FiArrowLeft, FiTarget, FiTrendingUp, FiAward } from 'react-icons/fi';

const BusinessBuyReadiness = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    businessName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/business-buy-readiness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message || 'הבקשה נשלחה בהצלחה! נחזור אליך בהקדם עם דוח הנתונים.' });
        setFormData({ fullName: '', mobile: '', email: '', businessName: '' });
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'שגיאה בשליחת הבקשה. אנא נסה שוב.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage({ type: 'error', text: 'שגיאה בשליחת הבקשה. אנא נסה שוב.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <FiTarget className="w-16 h-16 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            רוצה לקנות עסק? עצור לבדיקת נתונים
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
            קבל דוח נתונים מבוסס A.I לפני שאתה מתחייב ללא עלות.
          </p>
          <p className="text-lg text-blue-200 max-w-5xl mx-auto leading-relaxed mb-12">
            עסקה שנראית "בסדר" על הנייר יכולה להסתיר מציאות אחרת: התחייבויות נסתרות, תלות בלקוח אחד, עונתיות קיצונית, בעיות תפעול או סיכוני רגולציה. קנייה של העסק הלא נכון עולה כסף, זמן ומוניטין. לפני שאתה שם כסף על השולחן, בדוק תמונת מצב ראשונית.
          </p>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            קבלו דוח נתונים חינם עכשיו
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Check Before Purchase */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            למה לעשות בדיקה לפני רכישה?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <FiShield className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                להימנע מהעסק הלא נכון
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                שכבת ניהול סיכונים שמונעת טעויות יקרות וקנייה בעיניים עצומות.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiEye className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                לראות את מה שלא תמיד רואים
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                מוסיפים ניתוח נתונים קר ושקול לצד מה שהמוכר מציג.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex justify-center mb-6">
                                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                   <FiCpu className="w-8 h-8 text-green-600" />
                 </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                לקבל החלטה רגועה יותר
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                לפני בדיקות יקרות, בוחנים אם בכלל שווה להעמיק.
              </p>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            מה מקבלים בהרשמה
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">דוח נתונים ללא עלות</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                דוח מפורט ומבוסס A.I ללא כל עלות נסתרת
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
              <div className="flex items-center mb-4">
                <FiTarget className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">תמונת מצב ראשונית</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                תמונת מצב ראשונית לעסק שאתה כבר בוחן (על בסיס הנתונים שלך)
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
              <div className="flex items-center mb-4">
                <FiTrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">כוונון החלטה</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                כלי עזר להחליט אם להמשיך בבדיקות עומק או לעצור כאן
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              קבלו דוח נתונים חינם עכשיו
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            איך זה עובד
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">לוחצים על "התחל חינם"</h3>
              <p className="text-gray-600 leading-relaxed">
                מתחילים בתהליך פשוט ומהיר ללא התחייבות
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">מעלים נתונים רלוונטיים</h3>
              <p className="text-gray-600 leading-relaxed">
                מעלים נתונים רלוונטיים של העסק שבוחנים
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">מקבלים דוח נתונים</h3>
              <p className="text-gray-600 leading-relaxed">
                מקבלים דוח נתונים מבוסס A.I שעוזר להחליט אם להעמיק או לעצור
              </p>
            </div>
          </div>
        </div>

        {/* Who Is This For */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            למי זה מתאים?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-center mb-6">
                <FiUsers className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                יזמים/משקיעים
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                שכבר מצאו עסק ספציפי ורוצים חיווי כללי לפני קנייה
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-center mb-6">
                <FiTrendingUp className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                בעלי עסקים
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                שמתרחבים ורוצים לאמת עסקה קיימת
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex justify-center mb-6">
                <FiAward className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                יועצים/רו״ח/מתווכים
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                שמחפשים שכבת בדיקה משלימה ללקוח
              </p>
            </div>
          </div>
        </div>

        {/* Trust and Privacy */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            אמון ופרטיות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-200">
                             <div className="flex items-center mb-4">
                 <FiCpu className="w-6 h-6 text-indigo-600 mr-3" />
                 <h3 className="text-xl font-bold text-gray-900">מבוסס A.I וטכנולוגיות מובילות</h3>
               </div>
              <p className="text-gray-600 leading-relaxed">
                שימוש בטכנולוגיות מתקדמות לניתוח מדויק ואמין
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
              <div className="flex items-center mb-4">
                <FiLock className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">הנתונים מוצפנים ונשמרים בדיסקרטיות</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                הגנה מלאה על הפרטיות והמידע שלך
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
              <div className="flex items-center mb-4">
                <FiCheckCircle className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">תשובה ראשונית וברורה</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                בלי פירוט מיותר - רק מה שחשוב להחלטה
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            שאלות קצרות (כללי)
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">מה כוללת ההרשמה?</h3>
              <p className="text-gray-600 leading-relaxed">
                דוח נתונים כללי לעסק שאתה כבר בוחן — בחינם.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">איך מגישים נתונים?</h3>
              <p className="text-gray-600 leading-relaxed">
                דרך העלאת נתונים רלוונטיים לאחר לחיצה על הכפתור.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">זה במקום רו״ח/עו״ד?</h3>
              <p className="text-gray-600 leading-relaxed">
                לא. זה שלב בדיקה כללי שמקטין סיכון ומחדד אם להמשיך לבדיקות עומק.
              </p>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div id="signup-form" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">אל תקנה בעיניים עצומות.</h2>
            <p className="text-xl text-blue-100 mb-6">
              קבל דוח נתונים כללי לעסק שאתה בוחן בחינם.
            </p>
          </div>
          
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'right', color: '#ffffff !important', textShadow: '0 1px 2px rgba(0,0,0,0.3)', WebkitTextFillColor: '#ffffff' }}>שם מלא *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-right text-gray-900"
                  placeholder="הכנס את שמך המלא"
                />
              </div>
              
              <div>
                                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'right', color: '#ffffff !important', textShadow: '0 1px 2px rgba(0,0,0,0.3)', WebkitTextFillColor: '#ffffff' }}>טלפון נייד *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-right text-gray-900"
                  placeholder="הכנס מספר טלפון"
                />
              </div>
              
              <div>
                                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'right', color: '#ffffff !important', textShadow: '0 1px 2px rgba(0,0,0,0.3)', WebkitTextFillColor: '#ffffff' }}>דואר אלקטרוני *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-right text-gray-900"
                  placeholder="הכנס כתובת אימייל"
                />
              </div>
              
              <div>
                                 <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'right', color: '#ffffff !important', textShadow: '0 1px 2px rgba(0,0,0,0.3)', WebkitTextFillColor: '#ffffff' }}>שם העסק הנבדק</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-right text-gray-900"
                  placeholder="הכנס את שם העסק"
                />
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-12 py-4 rounded-xl text-xl font-bold hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center mx-auto ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'שולח...' : 'קבלו דוח נתונים חינם עכשיו'}
                {!isSubmitting && <FiArrowLeft className="ml-2" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">מוכנים לקנות עסק?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            קבלו דוח נתונים מקצועי ומבוסס A.I שיעזור לכם לקבל החלטה נכונה
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>דוח חינם</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>מבוסס A.I</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>תוצאות מהירות</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessBuyReadiness;
