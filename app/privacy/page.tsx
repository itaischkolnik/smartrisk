'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
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
              מדיניות פרטיות
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              הגנה על פרטיותכם היא בעדיפות עליונה עבורנו
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Privacy Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">מדיניות פרטיות - SmartRisk</h2>
                
                <p className="mb-6">
                  ב־SmartRisk אנו מחויבים להגן על פרטיותכם ולשמור על המידע האישי שלכם. 
                  מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם.
                </p>

                <hr className="my-8 border-gray-300" />
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">1. מידע שאנו אוספים</h3>
                <p className="mb-4">אנו אוספים מידע הבא:</p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li><strong>מידע אישי:</strong> שם מלא, כתובת אימייל, מספר טלפון</li>
                  <li><strong>מידע עסקי:</strong> פרטי העסק, דוחות פיננסיים, מסמכים עסקיים</li>
                  <li><strong>מידע טכני:</strong> כתובת IP, סוג דפדפן, מערכת הפעלה</li>
                  <li><strong>מידע שימוש:</strong> דפים שביקרתם, זמן שהייה, פעולות שביצעתם</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">2. כיצד אנו משתמשים במידע</h3>
                <p className="mb-4">אנו משתמשים במידע שלכם למטרות הבאות:</p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>לספק שירותי ניתוח והערכת סיכונים</li>
                  <li>ליצור דוחות מפורטים ומותאמים אישית</li>
                  <li>לשפר את השירותים והתכונות שלנו</li>
                  <li>ליצור קשר עם לקוחות ולספק תמיכה</li>
                  <li>לשלוח עדכונים ומידע רלוונטי</li>
                  <li>לעמוד בדרישות חוקיות ומשפטיות</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">3. שיתוף מידע</h3>
                <p className="mb-6">
                  אנו <strong>לא מוכרים, לא משכירים ולא מעבירים</strong> מידע אישי לצדדים שלישיים למטרות מסחריות. 
                  אנו עשויים לשתף מידע רק במקרים הבאים:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>עם הסכמתכם המפורשת</li>
                  <li>עם ספקי שירותים מהימנים שעובדים עבורנו (כמו אחסון ענן)</li>
                  <li>כאשר נדרש על פי חוק או צו משפטי</li>
                  <li>להגנה על זכויותינו או על ביטחון המשתמשים</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">4. אבטחת מידע</h3>
                <p className="mb-6">
                  אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלכם:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>הצפנה חזקה לכל המידע המועבר</li>
                  <li>גיבוי מאובטח ומוגן</li>
                  <li>גישה מוגבלת למידע רק לעובדים מורשים</li>
                  <li>ניטור מתמיד של המערכות</li>
                  <li>עדכונים קבועים של אמצעי האבטחה</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">5. עוגיות (Cookies)</h3>
                <p className="mb-6">
                  אנו משתמשים בעוגיות כדי לשפר את חוויית השימוש באתר. העוגיות עוזרות לנו:
                </p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li>לזכור את העדפותיכם</li>
                  <li>לשפר את ביצועי האתר</li>
                  <li>לנתח את השימוש באתר</li>
                  <li>לספק תוכן מותאם אישית</li>
                </ul>
                <p className="mb-6">
                  תוכלו לחסום או למחוק עוגיות בהגדרות הדפדפן שלכם, אך הדבר עשוי להשפיע על פונקציונליות האתר.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">6. זכויותיכם</h3>
                <p className="mb-4">לפי חוק הגנת הפרטיות, יש לכם הזכות:</p>
                <ul className="list-disc list-inside mb-6 space-y-2">
                  <li><strong>לדעת:</strong> איזה מידע נאסף עליכם</li>
                  <li><strong>לגשת:</strong> למידע האישי שלכם</li>
                  <li><strong>לתקן:</strong> מידע לא מדויק או לא מעודכן</li>
                  <li><strong>למחוק:</strong> את המידע שלכם (בכפוף למגבלות חוקיות)</li>
                  <li><strong>להגביל:</strong> את השימוש במידע שלכם</li>
                  <li><strong>להתנגד:</strong> לעיבוד המידע שלכם</li>
                  <li><strong>להעביר:</strong> את המידע שלכם לספק שירותים אחר</li>
                </ul>

                <h3 className="text-xl font-bold text-gray-900 mb-4">7. שמירת מידע</h3>
                <p className="mb-6">
                  אנו שומרים על המידע שלכם רק כל עוד הוא נחוץ למטרות שלשמן נאסף, 
                  או כנדרש על פי חוק. מידע אישי יימחק אוטומטית לאחר תקופה של 7 שנים 
                  ממועד השימוש האחרון בשירותים שלנו.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">8. מידע של קטינים</h3>
                <p className="mb-6">
                  השירותים שלנו אינם מיועדים לקטינים מתחת לגיל 18. אנו לא אוספים 
                  במכוון מידע אישי מקטינים. אם אתם הורים או אפוטרופוסים ואתם יודעים 
                  שילדכם סיפק לנו מידע אישי, אנא צרו קשר איתנו.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">9. שינויים במדיניות</h3>
                <p className="mb-6">
                  אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. שינויים משמעותיים 
                  יובאו לידיעתכם באמצעות הודעה באתר או באימייל. המשך השימוש בשירותים 
                  לאחר שינויים מהווה הסכמה למדיניות המעודכנת.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4">10. צור קשר</h3>
                <p className="mb-6">
                  אם יש לכם שאלות לגבי מדיניות פרטיות זו או אם תרצו לממש את זכויותיכם, 
                  אנא צרו קשר איתנו:
                </p>
                <ul className="list-none space-y-2 mb-6">
                  <li>📧 אימייל: info@smartrisk.co.il</li>
                  <li>📱 טלפון: 03-5252134</li>
                  <li>🏢 כתובת: תל אביב, ישראל</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">חשוב לדעת</h4>
                  <p className="text-blue-800">
                    אם תרצו לממש את זכויותיכם או לבצע שינויים במידע שלכם, 
                    אנא צרו קשר איתנו ונשמח לעזור לכם.
                  </p>
                </div>

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