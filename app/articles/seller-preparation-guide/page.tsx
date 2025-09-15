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
                מדריך המוכר – איך להכין עסק למכירה ולהשיג מחיר טוב
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <span className="text-sm">3 דקות קריאה</span>
                <span className="mx-2">•</span>
                <span className="text-sm">מכירת עסקים</span>
              </div>
            </div>

            {/* Article Body */}
            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                מכירת עסק היא תהליך מורכב שדורש הכנה קפדנית. המוכרים שמצליחים להשיג מחיר טוב הם אלה שמכינים את העסק שלהם היטב לפני שמתחילים את התהליך. הנה המדריך המלא:
              </p>

              {/* Article Image */}
              <div className="my-12 text-center">
                <img 
                  src="/images/blog/004.png" 
                  alt="מדריך המוכר" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1. סדר פיננסי</h3>
                  <p className="text-gray-700 leading-relaxed">
                    לפני שמתחילים למכור, צריך לוודא שהדוחות הפיננסיים מסודרים ומעודכנים. זה כולל מאזנים, דוחות רווח והפסד, ודוחות מס.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2. תיעוד מסודר</h3>
                  <p className="text-gray-700 leading-relaxed">
                    כל החוזים, ההסכמים, הרישיונות והמסמכים צריכים להיות מסודרים ומאורגנים. קונה פוטנציאלי ירצה לראות הכל.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3. ניהול סיכונים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    חשוב לזהות ולטפל בסיכונים לפני שמתחילים את תהליך המכירה. זה יכול להעלות את ערך העסק משמעותית.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4. הכנת צוות</h3>
                  <p className="text-gray-700 leading-relaxed">
                    העובדים הם נכס חשוב. חשוב לוודא שהם מוכנים למעבר ושיש להם תמריצים להישאר.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5. תכנון המעבר</h3>
                  <p className="text-gray-700 leading-relaxed">
                    המעבר לבעלות חדשה צריך להיות מתוכנן היטב. זה כולל תקופת חפיפה והעברת ידע.
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