'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
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
              אודות SmartRisk
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              מרכז הידע והליווי לעסקאות קנייה ומכירה של עסקים בישראל
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  ברוכים הבאים ל־Smartrisk – מרכז הידע והליווי לעסקאות קנייה ומכירה של עסקים בישראל.
                </p>
                <p className="mb-6">
                  האתר נולד מתוך הצורך להנגיש ניסיון מקצועי, ידע פרקטי וכלים אמיתיים לכל מי ששוקל לקנות או למכור עסק – יזמים מתחילים, בעלי עסקים מנוסים, משקיעים וכל מי שמחפש קבלת החלטות חכמה ומבוססת.
                </p>
                <p className="mb-6">
                  לאורך השנים למדנו שמה שמפריד בין עסקה מוצלחת לבין הפסד – הוא מידע אמין, תהליך מסודר ויכולת לזהות סיכונים מבעוד מועד. כאן תמצאו מדריכים, טיפים, כלים וסיפורי מקרה – שמטרתם לתת לכל אחד יתרון בשוק דינמי ומאתגר.
                </p>
                <hr className="my-8 border-gray-300" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">מי אנחנו?</h2>
                <p className="mb-6">
                  Smartrisk הוקמה על ידי צוות בעל ניסיון עסקי עשיר ורב־שנים בניהול, קנייה ומכירה של עסקים בישראל.
                </p>
                <p className="mb-6">
                  אנחנו מביאים איתנו מאות עסקאות ליווי מוצלחות, הבנה מעמיקה של תהליכי משא ומתן, בדיקות נאותות, איתור סיכונים וניהול תהליכי מכירה מורכבים.
                </p>
                <p className="mb-6">
                  המטרה שלנו היא להנגיש את הידע הזה לכל מי שמעוניין לבצע עסקה בטוחה, חכמה ומושכלת – בלי קשר לגודל העסק או לניסיון קודם.
                </p>
                <hr className="my-8 border-gray-300" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">המשימה שלנו פשוטה:</h2>
                <p className="mb-6">
                  לעזור לך לקבל החלטות עסקיות מתוך ידע וביטחון, להימנע ממלכודות מיותרות, ולבנות את הדרך שלך להצלחה.
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