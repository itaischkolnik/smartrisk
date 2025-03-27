export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="navbar nav-glass shadow-md py-4 border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-primary font-bold text-2xl">SmartRisk</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <a href="/login" className="text-gray-600 hover:text-primary transition duration-300">
              התחברות
            </a>
            <a href="/signup" className="btn btn-primary">
              הרשמה
            </a>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
          {/* Abstract shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-10"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white opacity-5"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-10 md:mb-0 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                קבל החלטות חכמות יותר בזמן רכישת עסק
              </h1>
              <p className="text-xl mb-8 text-primary-100 leading-relaxed">
                פלטפורמה מבוססת AI המנתחת עבורך את הסיכונים והכדאיות של רכישת עסק, 
                בצורה מהירה ומדויקת
              </p>
              <div className="flex gap-4">
                <a 
                  href="/signup" 
                  className="btn btn-lg bg-white text-primary-dark hover:bg-gray-100 transition-all shadow-md hover:shadow-xl"
                >
                  התחל עכשיו
                </a>
                <a 
                  href="/demo" 
                  className="btn btn-lg btn-outline-white hover:bg-white/10 transition-all"
                >
                  הדגמה חינם
                </a>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in">
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                  <div className="bg-gray-50 rounded-xl p-8 h-[300px] flex flex-col">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-danger"></div>
                        <div className="h-3 w-3 rounded-full bg-warning"></div>
                        <div className="h-3 w-3 rounded-full bg-success"></div>
                      </div>
                      <div className="text-primary-dark font-bold">SmartRisk Analytics</div>
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex justify-between">
                        <div className="bg-primary-100 h-4 w-24 rounded"></div>
                        <div className="bg-primary-100 h-4 w-12 rounded"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-primary-100 h-24 w-1/3 rounded-lg"></div>
                        <div className="bg-primary-100 h-24 w-1/3 rounded-lg"></div>
                        <div className="bg-primary-100 h-24 w-1/3 rounded-lg"></div>
                      </div>
                      <div className="bg-primary-100 h-8 w-full rounded"></div>
                      <div className="flex justify-between">
                        <div className="bg-primary-100 h-4 w-20 rounded"></div>
                        <div className="bg-success h-8 w-24 rounded text-white text-center text-sm flex items-center justify-center">
                          כדאי להשקיע
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-secondary text-white p-4 rounded-lg shadow-lg">
                  <div className="font-bold">100% מבוסס AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 mb-6">משרדי רו״ח מובילים שסומכים עלינו</p>
          <div className="flex justify-center items-center flex-wrap gap-12">
            <div className="h-12 w-auto opacity-50">
              <div className="bg-gray-400 h-full w-24 rounded"></div>
            </div>
            <div className="h-12 w-auto opacity-50">
              <div className="bg-gray-400 h-full w-32 rounded"></div>
            </div>
            <div className="h-12 w-auto opacity-50">
              <div className="bg-gray-400 h-full w-28 rounded"></div>
            </div>
            <div className="h-12 w-auto opacity-50">
              <div className="bg-gray-400 h-full w-20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-2">התכונות שלנו</p>
            <h2 className="section-title mb-8">הכלים שיעזרו לך לקבל החלטה מושכלת</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              הפלטפורמה שלנו מציעה פתרון מקיף לניתוח עסקים פוטנציאליים להשקעה או רכישה
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">הזנת פרטי העסק</h3>
              <p className="text-gray-600">הזן את המידע הבסיסי אודות העסק שאתה שוקל לרכוש, כולל תחום פעילות, גודל ומיקום</p>
            </div>
            
            <div className="card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">העלאת דוחות כספיים</h3>
              <p className="text-gray-600">העלה דוחות כספיים, קבצי אקסל ומסמכים נוספים המתארים את פעילות העסק</p>
            </div>
            
            <div className="card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">ניתוח חכם מבוסס AI</h3>
              <p className="text-gray-600">המערכת מנתחת את כל הנתונים באמצעות אלגוריתמים מתקדמים ולמידת מכונה</p>
            </div>
            
            <div className="card p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">קבלת דוח מפורט</h3>
              <p className="text-gray-600">קבל דוח מקיף עם תובנות והמלצות לגבי הסיכונים והכדאיות של רכישת העסק</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-2">תהליך פשוט</p>
            <h2 className="section-title mb-8">איך זה עובד?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              תהליך פשוט בארבעה שלבים שיעזור לך לקבל את כל המידע הדרוש לקבלת החלטה מושכלת
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">יצירת חשבון</h3>
              <p className="text-gray-600">הירשם לשירות בקלות ובמהירות, ללא התחייבות</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">הזנת מידע</h3>
              <p className="text-gray-600">הכנס את פרטי העסק והעלה את המסמכים הרלוונטיים</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">ניתוח מבוסס AI</h3>
              <p className="text-gray-600">המערכת תנתח את כל הנתונים באמצעות אלגוריתמים מתקדמים</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">קבלת דוח</h3>
              <p className="text-gray-600">קבל דוח מקיף עם ניתוח מפורט, גרפים, טבלאות והמלצות</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold mb-2">לקוחות מרוצים</p>
            <h2 className="section-title mb-8">מה אומרים עלינו</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              אלפי לקוחות כבר השתמשו בשירות שלנו לקבלת החלטות עסקיות חכמות יותר
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">"המערכת חסכה לי זמן רב בניתוח עסק שרציתי לרכוש, וחשפה סיכונים שלא הייתי מודע אליהם. השקעה מצוינת!"</p>
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">אבי לוי</h4>
                  <p className="text-gray-500 text-sm">יזם סדרתי</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">"כמשקיעה אנג'לית, אני בוחנת עשרות הזדמנויות בשנה. SmartRisk הפך לכלי החיוני ביותר בארגז הכלים שלי."</p>
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">שרה כהן</h4>
                  <p className="text-gray-500 text-sm">משקיעה אנג'לית</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6 hover:-translate-y-1 transition-all duration-300">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">"הדוחות מפורטים, קלים להבנה ומספקים תובנות שלא חשבתי עליהן. עזר לי להימנע מעסקה גרועה."</p>
              <div className="flex items-center">
                <div className="ml-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">דוד ישראלי</h4>
                  <p className="text-gray-500 text-sm">בעל עסק</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">+2,500</div>
              <p className="text-gray-600">לקוחות מרוצים</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">+500M ₪</div>
              <p className="text-gray-600">עסקאות שנבחנו</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-gray-600">דיוק בהערכות</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-dark to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכן לקבל החלטות חכמות יותר?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            הצטרף לאלפי לקוחות מרוצים שכבר משתמשים בפלטפורמה שלנו לניתוח עסקים והפחתת סיכונים
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="btn btn-lg bg-white text-primary-dark hover:bg-gray-100 transition-all shadow-md hover:shadow-xl"
            >
              התחל להשתמש בחינם
            </a>
            <a
              href="/contact"
              className="btn btn-lg btn-outline-white"
            >
              דבר איתנו
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SmartRisk</h3>
              <p className="text-gray-400">פלטפורמה מבוססת AI לניתוח והערכת סיכונים וכדאיות של רכישת עסק</p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">ניווט מהיר</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white transition">
                    דף הבית
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white transition">
                    אודות
                  </a>
                </li>
                <li>
                  <a href="/features" className="text-gray-400 hover:text-white transition">
                    תכונות
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-400 hover:text-white transition">
                    תמחור
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">משאבים</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/blog" className="text-gray-400 hover:text-white transition">
                    בלוג
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-gray-400 hover:text-white transition">
                    שאלות נפוצות
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-gray-400 hover:text-white transition">
                    תמיכה
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">צור קשר</h4>
              <ul className="space-y-2 text-gray-400">
                <li>טלפון: 03-1234567</li>
                <li>דוא"ל: info@smartrisk.co.il</li>
                <li>כתובת: רחוב הברזל 3, תל אביב</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} SmartRisk. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 