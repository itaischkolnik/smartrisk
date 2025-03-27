import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FeatureCard from './components/FeatureCard';
import Step from './components/Step';
import Testimonial from './components/Testimonial';
import { BusinessIcon, UploadIcon, AnalysisIcon, ReportIcon } from './components/Icons';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                קבל החלטות חכמות יותר בזמן רכישת עסק
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                פלטפורמה מבוססת AI המנתחת עבורך את הסיכונים והכדאיות של רכישת עסק, בצורה מהירה ומדויקת
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="/signup" 
                  className="bg-white text-primary-700 px-6 py-3 rounded-md font-bold hover:bg-primary-50 transition"
                >
                  התחל עכשיו
                </a>
                <a 
                  href="/demo" 
                  className="border border-white text-white px-6 py-3 rounded-md font-bold hover:bg-white/10 transition"
                >
                  הדגמה חינם
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-white p-6 rounded-xl shadow-2xl text-gray-900">
                  <div className="h-[300px] flex flex-col items-center justify-center">
                    <div className="text-5xl text-primary-600 mb-4">SmartRisk</div>
                    <div className="text-xl mb-3">ניתוח מבוסס AI</div>
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="mt-8 text-sm">דמו של מערכת ניהול סיכונים</div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-secondary-500 text-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold">100% מבוסס AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">התכונות שלנו</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              הפלטפורמה שלנו מציעה פתרון מקיף לניתוח עסקים פוטנציאליים להשקעה או רכישה
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<BusinessIcon />}
              title="הזנת פרטי העסק"
              description="הזן את המידע הבסיסי אודות העסק שאתה שוקל לרכוש, כולל תחום פעילות, גודל ומיקום"
            />
            <FeatureCard 
              icon={<UploadIcon />}
              title="העלאת דוחות כספיים"
              description="העלה דוחות כספיים, קבצי אקסל ומסמכים נוספים המתארים את פעילות העסק"
            />
            <FeatureCard 
              icon={<AnalysisIcon />}
              title="ניתוח חכם מבוסס AI"
              description="המערכת מנתחת את כל הנתונים באמצעות אלגוריתמים מתקדמים ולמידת מכונה"
            />
            <FeatureCard 
              icon={<ReportIcon />}
              title="קבלת דוח מפורט"
              description="קבל דוח מקיף עם תובנות והמלצות לגבי הסיכונים והכדאיות של רכישת העסק"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">איך זה עובד?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              תהליך פשוט בארבעה שלבים שיעזור לך לקבל את כל המידע הדרוש לקבלת החלטה מושכלת
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-12">
              <Step 
                number={1}
                title="יצירת חשבון"
                description="הירשם לשירות בקלות ובמהירות, ללא התחייבות"
              />
              <Step 
                number={2}
                title="הזנת פרטי העסק והעלאת מסמכים"
                description="הכנס את פרטי העסק שאתה שוקל לרכוש והעלה את המסמכים הרלוונטיים"
              />
              <Step 
                number={3}
                title="ניתוח מבוסס AI"
                description="המערכת תנתח את כל הנתונים באמצעות אלגוריתמים מתקדמים ותספק תובנות מעמיקות"
              />
              <Step 
                number={4}
                title="קבלת דוח מפורט"
                description="קבל דוח מקיף עם ניתוח מפורט, גרפים, טבלאות והמלצות לפעולה"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">מה הלקוחות שלנו אומרים</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              אלפי לקוחות כבר השתמשו בשירות שלנו לקבלת החלטות עסקיות חכמות יותר
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="המערכת חסכה לי זמן רב בניתוח עסק שרציתי לרכוש, וחשפה סיכונים שלא הייתי מודע אליהם. השקעה מצוינת!"
              author="אבי לוי"
              position="יזם סדרתי"
            />
            <Testimonial 
              quote="כמשקיע אנג'ל, אני בוחן עשרות הזדמנויות בשנה. SmartRisk הפך לכלי החיוני ביותר בארגז הכלים שלי."
              author="שרה כהן"
              position="משקיעה אנג'לית"
            />
            <Testimonial 
              quote="הדוחות מפורטים, קלים להבנה ומספקים תובנות שלא חשבתי עליהן. עזר לי להימנע מעסקה גרועה."
              author="דוד ישראלי"
              position="בעל עסק"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכן לקבל החלטות חכמות יותר?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            הצטרף לאלפי לקוחות מרוצים שכבר משתמשים בפלטפורמה שלנו לניתוח עסקים והפחתת סיכונים
          </p>
          <a 
            href="/signup" 
            className="bg-white text-primary-700 px-8 py-4 rounded-md font-bold text-lg hover:bg-primary-50 transition inline-block"
          >
            התחל להשתמש בחינם
          </a>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 