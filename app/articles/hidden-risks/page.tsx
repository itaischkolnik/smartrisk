'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ArticlePage() {
  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        /* Override global CSS for article blue containers */
        .article-blue-container h3,
        .article-blue-container p {
          color: white !important;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Article Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link href="/articles" className="text-primary hover:text-primary-dark transition-colors duration-200">
                ← חזרה למאמרים
              </Link>
            </div>

            {/* Article Header */}
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                סיכונים נסתרים – מה שלא רואים בעין עלול להרוס עסקה
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <span className="text-sm">4 דקות קריאה</span>
                <span className="mx-2">•</span>
                <span className="text-sm">ניתוח סיכונים</span>
              </div>
            </div>

            {/* Article Body */}
            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                כשאתם רואים עסק שנראה מושלם על הנייר, זה הזמן להיות הכי זהירים. הסיכונים האמיתיים הם אלה שלא רואים בעין בלתי מזוינת. הנה המדריך המלא לזיהוי סיכונים נסתרים:
              </p>

              {/* Article Image */}
              <div className="my-12 text-center">
                <img 
                  src="/images/blog/005.png" 
                  alt="סיכונים נסתרים" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1. סיכונים משפטיים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    חוזים לא מסודרים, תביעות עתידיות, בעיות רישוי – כל אלה עלולים לצוץ אחרי הרכישה ולעלות הרבה כסף.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2. סיכונים פיננסיים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    חובות נסתרים, התחייבויות עתידיות, דוחות פיננסיים מטעים – אלה הסיכונים הכי יקרים.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3. סיכונים תפעוליים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    תלות בבעלים, צוות לא מיומן, תהליכים לא יעילים – אלה עלולים להרוס עסק גם אם המספרים נראים טוב.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4. סיכוני שוק</h3>
                  <p className="text-gray-700 leading-relaxed">
                    שינויים רגולטוריים, תחרות חדשה, שינויי טעם – השוק משתנה כל הזמן וזה עלול להשפיע על העסק.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5. סיכונים טכנולוגיים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    טכנולוגיה מיושנת, מערכות לא מאובטחות, תלות בספקים טכנולוגיים – אלה עלולים לעלות הרבה כסף לתקן.
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-primary rounded-lg p-8 text-white article-blue-container">
                <h3 className="text-2xl font-bold mb-4">לסיכום – אל תחפשו עסקה חלומית, חפשו עסקה בטוחה</h3>
                <p className="text-lg leading-relaxed mb-6">
                  הזדמנויות אמיתיות יש – אבל רק למי שמסוגל להגיד "לא" בזמן. הסוד הוא לא באיזה עסק לבחור, אלא מאילו עסקים להתרחק – ואיך לזהות בזמן את מה שמנסים להסתיר. מי שינסה להאיץ בכם, או יבטיח לכם "כסף על העץ" – זה בדיוק המקום לעצור.
                </p>
                <div className="text-center">
                  <Link 
                    href="/assessment/new" 
                    className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
                  >
                    רוצה לבדוק עסק לפני רכישה?
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 