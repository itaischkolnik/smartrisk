'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ArticlesPage() {
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
              מאמרים מקצועיים
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              כאן תוכלו לקרוא מאמרים מקצועיים על קנייה ומכירה של עסקים, כיצד להימנע מסיכונים, טיפים למו"מ מוצלח, וכל מה שצריך לדעת לפני שמתחילים בעסקה
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                מאמרים אחרונים
              </h2>
              <p className="text-gray-600 text-lg">
                מאמרים מקצועיים שנכתבו על ידי מומחי SmartRisk
              </p>
            </div>
            
                         {/* Articles Grid */}
             <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                                                               <Link href="/articles/5-common-mistakes" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                   <div className="h-48 overflow-hidden">
                     <img src="/images/blog/001.png" alt="טעויות נפוצות בקניית עסק" className="w-full h-full object-cover" />
                   </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      טעויות נפוצות בקניית עסק – ואיך להימנע מהן
                    </h3>
                    <p className="text-gray-600 mb-4">
                      רכישת עסק פעיל יכולה להיות הזדמנות מרגשת ומשתלמת, אבל יחד איתה מגיעות גם לא מעט מלכודות...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">2 דקות קריאה</span>
                      <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                        קרא עוד →
                      </span>
                    </div>
                  </div>
                </Link>

                                                           <Link href="/articles/business-valuation-guide" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                                     <div className="h-48 overflow-hidden">
                     <img src="/images/blog/002.png" alt="כך תדע מה באמת העסק שלך שווה" className="w-full h-full object-cover" />
                   </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      כך תדע מה באמת העסק שלך שווה – המדריך למוכרים
                    </h3>
                    <p className="text-gray-600 mb-4">
                      הרגע שבו בעל עסק מחליט למכור הוא מרגש ומורכב, ולא פעם מלווה בפער בין הציפייה למחיר לשווי האמיתי...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">2 דקות קריאה</span>
                      <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                        קרא עוד →
                      </span>
                    </div>
                  </div>
                </Link>

                                                               <Link href="/articles/hidden-risks" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                                       <div className="h-48 overflow-hidden">
                      <img src="/images/blog/003.png" alt="מהם הסיכונים הסמויים בעסק" className="w-full h-full object-cover" />
                    </div>
                   <div className="p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-3">
                       מהם הסיכונים הסמויים בעסק – וכיצד תגלו אותם בזמן?
                     </h3>
                     <p className="text-gray-600 mb-4">
                       הרבה סיכונים בעסק לא נראים לעין – והם עלולים להפתיע גם את הקונה וגם את המוכר...
                     </p>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">2 דקות קריאה</span>
                       <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                         קרא עוד →
                       </span>
                     </div>
                   </div>
                                  </Link>

                                 <Link href="/articles/buyer-guide" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                                       <div className="h-48 overflow-hidden">
                      <img src="/images/blog/004.png" alt="כלים וטיפים לקונה העסק המתחיל" className="w-full h-full object-cover" />
                    </div>
                   <div className="p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-3">
                       כלים וטיפים לקונה העסק המתחיל – הדרך לרכישה בטוחה
                     </h3>
                     <p className="text-gray-600 mb-4">
                       החלטתם להיכנס לעולם העסקים ולקנות עסק פעיל? מצוין! הנה כמה כלים וטיפים שיעזרו לכם...
                     </p>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">2 דקות קריאה</span>
                       <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                         קרא עוד →
                       </span>
                     </div>
                   </div>
                                  </Link>

                                 <Link href="/articles/seller-preparation-guide" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                                       <div className="h-48 overflow-hidden">
                      <img src="/images/blog/005.png" alt="מדריך: כך תתכונן למכירת העסק" className="w-full h-full object-cover" />
                    </div>
                   <div className="p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-3">
                       מדריך: כך תתכונן למכירת העסק – 7 שלבים שכל בעל עסק חייב לדעת
                     </h3>
                     <p className="text-gray-600 mb-4">
                       אם הגעת לשלב שבו אתה שוקל למכור את העסק, כדאי לעשות את זה נכון. הנה 7 שלבים שיבטיחו...
                     </p>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">2 דקות קריאה</span>
                       <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                         קרא עוד →
                       </span>
                     </div>
                   </div>
                                  </Link>

                                 <Link href="/articles/business-survival-guide" className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block">
                                       <div className="h-48 overflow-hidden">
                      <img src="/images/blog/006.png" alt="מדריך הישרדות לרוכשי עסקים בישראל" className="w-full h-full object-cover" />
                    </div>
                   <div className="p-6">
                     <h3 className="text-xl font-semibold text-gray-800 mb-3">
                       יותר חשוב מאיזה עסק לקנות – זה מאילו עסקים להיזהר: מדריך הישרדות לרוכשי עסקים בישראל
                     </h3>
                     <p className="text-gray-600 mb-4">
                       בישראל נמכרים בכל שנה מאות עסקים קטנים ובינוניים – חלקם הם הזדמנות מצוינת להצלחה, אבל אחרים עלולים להפוך לחלום רע ויקר...
                     </p>
                     <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-500">2 דקות קריאה</span>
                       <span className="text-primary hover:text-primary-dark transition-colors duration-200">
                         קרא עוד →
                       </span>
                     </div>
                   </div>
                 </Link>
              </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 