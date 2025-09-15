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
                טעויות נפוצות בקניית עסק – ואיך להימנע מהן
              </h1>
              <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                <span className="text-sm">2 דקות קריאה</span>
                <span className="mx-2">•</span>
                <span className="text-sm">ניתוח סיכונים</span>
              </div>
            </div>

            {/* Article Body */}
            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center md:text-left">
                רכישת עסק פעיל יכולה להיות הזדמנות מרגשת ומשתלמת, אבל יחד איתה מגיעות גם לא מעט מלכודות. קונים רבים מבצעים טעויות פשוטות שמובילות להפסדים כספיים ואכזבות. הנה חמש טעויות מרכזיות שכדאי להימנע מהן, ואיך SmartRisk יכולה לעזור לך לעשות את הצעד הבא בבטחה:
              </p>

              {/* Article Image */}
              <div className="my-12 text-center">
                <img 
                  src="/images/blog/001.png" 
                  alt="טעויות נפוצות בקניית עסק" 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">1. הסתמכות רק על דוחות עבר</h3>
                  <p className="text-gray-700 leading-relaxed">
                    הרבה קונים מסתפקים בבדיקת מאזנים ורווח והפסד, אבל מפספסים את השוק האמיתי והסיכונים העתידיים. ניתוח סיכונים חכם בודק גם טרנדים, מתחרים, ושינויים רגולטוריים.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">2. התעלמות מהתחייבויות סמויות</h3>
                  <p className="text-gray-700 leading-relaxed">
                    חוזים פתוחים, חובות לספקים, תביעות עתידיות – כל אלה עלולים לצוץ אחרי הרכישה. SmartRisk בודקת את כל ההתחייבויות ברקע.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">3. הערכת יתר של מוניטין</h3>
                  <p className="text-gray-700 leading-relaxed">
                    עסק שנראה מצליח עלול להיות תלוי בלקוח מרכזי, או בשותף אחד. חשוב להבין את תלות העסק בגורמים בודדים.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">4. חוסר בדיקת חוזים והסכמים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    לעיתים קונים שוכחים לבדוק את תוקף ההסכמים מול ספקים ולקוחות, ונותרים עם עסק ללא רצף עסקי אמיתי.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">5. בחירת יועצים לא מתאימים</h3>
                  <p className="text-gray-700 leading-relaxed">
                    ליווי מקצועי חייב להיות ניטרלי. כדאי להיעזר בגוף חיצוני, נטול אינטרס, שנותן תמונת מצב אמינה ומלאה.
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-primary rounded-lg p-8 text-white article-blue-container">
                <h3 className="text-2xl font-bold mb-4">איך להימנע מהטעויות?</h3>
                <p className="text-lg leading-relaxed mb-6">
                  שירות ניתוח הסיכונים של SmartRisk מלווה אותך בכל שלב, מזהה מלכודות נסתרות ונותן לך יתרון אמיתי במו"מ. החלטה מושכלת מתחילה כאן.
                </p>
                <div className="text-center">
                  <Link 
                    href="/assessment/new" 
                    className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
                  >
                    בדקו את העסק שלכם עכשיו
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