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
                מדריך הערכת עסקים – איך לדעת מה עסק באמת שווה
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <span className="text-sm">5 דקות קריאה</span>
                <span className="mx-2">•</span>
                <span className="text-sm">הערכת עסקים</span>
              </div>
            </div>

            {/* Article Body */}
            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                הערכת עסק היא לא רק עניין של מספרים – זו אמנות שמשלבת ניתוח פיננסי, הבנת שוק, והערכת סיכונים. הנה המדריך המלא להערכת עסקים נכונה:
              </p>

              {/* Article Image */}
              <div className="my-12 text-center">
                <img 
                  src="/images/blog/006.png" 
                  alt="הערכת עסקים" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1. ניתוח פיננסי</h3>
                  <p className="text-gray-700 leading-relaxed">
                    הדוחות הפיננסיים הם הבסיס להערכה, אבל חשוב להבין מה המספרים באמת אומרים. זה כולל ניתוח מגמות, השוואה לתחרות, וזיהוי חריגים.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2. הבנת השוק</h3>
                  <p className="text-gray-700 leading-relaxed">
                    ערך העסק תלוי בשוק שבו הוא פועל. חשוב להבין את המגמות, התחרות, והעתיד הצפוי של השוק.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3. הערכת נכסים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    נכסים מוחשיים ולא מוחשיים משפיעים על הערך. זה כולל ציוד, מוניטין, מותג, וקשרים עסקיים.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4. ניתוח סיכונים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    סיכונים מורידים את הערך. חשוב לזהות אותם ולהעריך את השפעתם על הערך העתידי של העסק.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5. שיטות הערכה</h3>
                  <p className="text-gray-700 leading-relaxed">
                    יש כמה שיטות להערכה – הכנסות, נכסים, השוואה לשוק. השילוב של כמה שיטות נותן תמונה מדויקת יותר.
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