'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
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
              תנאי שימוש
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              תנאי השימוש והמדיניות של SmartRisk
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Terms Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">תנאי שימוש - SmartRisk</h2>
                
                <p className="mb-6">
                  ברוכים הבאים ל־SmartRisk. השימוש באתר ובשירותים שלנו כפוף לתנאי השימוש הבאים. 
                  אנא קראו אותם בעיון לפני השימוש בשירותים שלנו.
                </p>

                <hr className="my-8 border-gray-300" />
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. קבלת התנאים</h3>
                <p className="mb-6">
                  הגישה והשימוש באתר SmartRisk ובשירותים שלנו מהווה הסכמה מלאה לתנאי השימוש הללו. 
                  אם אינכם מסכימים לתנאים אלו, אנא אל תשתמשו בשירותים שלנו.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">2. תיאור השירות</h3>
                <p className="mb-6">
                  SmartRisk מספק שירותי ניתוח והערכת סיכונים לעסקאות קנייה ומכירה של עסקים. 
                  השירות כולל כלים מקצועיים, דוחות מפורטים ותמיכה מקצועית. השירות אינו מהווה תחליף לייעוץ משפטי או פיננסי מקצועי.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">3. דיוק המידע</h3>
                <p className="mb-6">
                  אנו משתדלים לספק מידע מדויק ועדכני, אך איננו יכולים להבטיח את הדיוק המוחלט של כל המידע. 
                  המשתמשים אחראים לוודא את המידע ולקבל ייעוץ מקצועי מתאים לפני קבלת החלטות עסקיות.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">4. פרטיות ואבטחה</h3>
                <p className="mb-6">
                  אנו מחויבים להגן על פרטיותכם. המידע שאתם מספקים לנו יישמר בסודיות וישמש רק למטרות 
                  הפרויקט שלכם. איננו מוכרים, משתפים או מעבירים מידע אישי לצדדים שלישיים ללא הסכמתכם.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">5. שימוש מותר</h3>
                <p className="mb-6">
                  השימוש בשירותים שלנו מותר למטרות חוקיות בלבד. אסור להשתמש בשירותים:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>למטרות בלתי חוקיות או מזיקות</li>
                  <li>להעברת תוכן פוגעני או בלתי הולם</li>
                  <li>לניסיון לחדור למערכות שלנו</li>
                  <li>לשימוש מסחרי ללא אישור מפורש</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">6. הגבלת אחריות</h3>
                <p className="mb-6">
                  SmartRisk לא יהיה אחראי לכל נזק ישיר, עקיף, מקרי או מיוחד הנובע מהשימוש בשירותים שלנו. 
                  האחריות המקסימלית שלנו תוגבל לסכום ששילמתם עבור השירות.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">7. קניין רוחני</h3>
                <p className="mb-6">
                  כל התוכן, הלוגו, העיצוב והטכנולוגיה באתר הם רכושנו או של בעלי רישיון. 
                  אסור להעתיק, להפיץ או להשתמש בתוכן ללא אישור מפורש.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">8. שינויים בתנאים</h3>
                <p className="mb-6">
                  אנו שומרים לעצמנו את הזכות לשנות תנאי שימוש אלו בכל עת. 
                  שינויים ייכנסו לתוקף מייד עם פרסומם באתר. המשך השימוש באתר מהווה הסכמה לתנאים המעודכנים.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">9. ביטול השירות</h3>
                <p className="mb-6">
                  אנו שומרים לעצמנו את הזכות להפסיק או להגביל את הגישה לשירותים בכל עת, 
                  ללא הודעה מוקדמת, במקרה של הפרת תנאי שימוש או מסיבות אחרות.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">10. חוק מדינה</h3>
                <p className="mb-6">
                  תנאי שימוש אלו כפופים לחוקי מדינת ישראל. כל מחלוקת תיפתר בבתי המשפט המוסמכים בישראל.
                </p>

                <hr className="my-8 border-gray-300" />
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">צור קשר</h3>
                <p className="mb-6">
                  אם יש לכם שאלות לגבי תנאי שימוש אלו, אנא צרו קשר איתנו:
                </p>
                <ul className="list-none space-y-2 mb-6">
                  <li>📧 אימייל: info@smartrisk.co.il</li>
                  <li>📱 טלפון: 03-5252134</li>
                  <li>🏢 כתובת: תל אביב, ישראל</li>
                </ul>

                <p className="text-sm text-gray-600">
                  <strong>תאריך עדכון אחרון:</strong> {new Date().toLocaleDateString('he-IL')}
                </p>
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