import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl">SmartRisk</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <a href="/login" className="text-gray-600 hover:text-blue-600 transition">
              התחברות
            </a>
            <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              הרשמה
            </a>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            קבל החלטות חכמות יותר בזמן רכישת עסק
          </h1>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            פלטפורמה מבוססת AI המנתחת עבורך את הסיכונים והכדאיות של רכישת עסק, בצורה מהירה ומדויקת
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <a 
              href="/signup" 
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-bold hover:bg-blue-50 transition"
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-2xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">הזנת פרטי העסק</h3>
                <p className="text-gray-600">הזן את המידע הבסיסי אודות העסק שאתה שוקל לרכוש</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-2xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">העלאת דוחות כספיים</h3>
                <p className="text-gray-600">העלה דוחות כספיים וקבצי אקסל המתארים את פעילות העסק</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-2xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">ניתוח חכם מבוסס AI</h3>
                <p className="text-gray-600">המערכת מנתחת את כל הנתונים באמצעות אלגוריתמים מתקדמים</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 text-2xl">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">קבלת דוח מפורט</h3>
                <p className="text-gray-600">קבל דוח מקיף עם תובנות והמלצות לגבי רכישת העסק</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכן לקבל החלטות חכמות יותר?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            הצטרף לאלפי לקוחות מרוצים שכבר משתמשים בפלטפורמה שלנו לניתוח עסקים והפחתת סיכונים
          </p>
          <a 
            href="/signup" 
            className="bg-white text-blue-700 px-8 py-4 rounded-md font-bold text-lg hover:bg-blue-50 transition inline-block"
          >
            התחל להשתמש בחינם
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} SmartRisk. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
} 