'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityPanel from './components/AccessibilityPanel';

export default function Home() {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    timeSavings: 0,
    businessesAnalyzed: 0,
    customerSatisfaction: 0,
    riskAccuracy: 0
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const animateNumbers = () => {
            const duration = 2000; // 2 seconds
            const steps = 60; // 60fps
            const increment = 1 / steps;
            
            let progress = 0;
            const timer = setInterval(() => {
              progress += increment;
              
              if (progress >= 1) {
                progress = 1;
                clearInterval(timer);
              }
              
              setAnimatedNumbers({
                timeSavings: Math.floor(40 * progress),
                businessesAnalyzed: Math.floor(2500 * progress),
                customerSatisfaction: Math.floor(98 * progress),
                riskAccuracy: Math.floor(95 * progress)
              });
            }, duration / steps);
          };

          // Start animation immediately when section comes into view
          animateNumbers();
        }
      });
    }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

    // Observe the statistics section
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, [hasAnimated]);

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-700 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            {/* Large white circle */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            {/* Large purple circle */}
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
            {/* Small blue circles */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 bg-blue-300/20 rounded-full blur-xl"></div>
          </div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" 
              style={{ 
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .1) 25%, rgba(255, 255, 255, .1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .1) 75%, rgba(255, 255, 255, .1) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px' 
              }}>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 pt-20 pb-4 md:pb-6 lg:pb-8">
            {/* Main text content - full width above form */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                קבלו ניתוח מדויק לפני רכישת עסק
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto">
                המערכת שתבצע עבורכם ניתוח סיכונים חכם לעסק שאתם שוקלים לרכוש – בעזרת AI, דוחות, ואקסלים שאתם מעלים. חכם, מהיר, אישי.
              </p>
            </div>

            {/* Form and Image - centered layout */}
            <div className="relative flex justify-center items-center">
              {/* Form container - centered on mobile, positioned on desktop */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10 w-full max-w-md lg:max-w-lg lg:pl-32 relative mx-4 lg:mx-0 lg:ml-24">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-right mb-6">
                  השאירו פרטים לתיאום פגישה
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="שם מלא"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="דוא״ל"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="טלפון נייד"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-right"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    שלח פרטים
                  </button>
                </form>
                
                {/* Hero Image - positioned to overlap with form on desktop only */}
                <div className="hidden lg:block absolute -left-72 top-1/2 transform -translate-y-1/2">
                  <img
                    src="/images/001.png"
                    alt="Business professional with laptop"
                    className="max-w-md"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">למה לבחור בנו?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                המערכת המתקדמת ביותר לניתוח סיכונים ובדיקת כדאיות עסקית
              </p>
            </div>
            
                         <div className="grid md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-lightbulb text-2xl text-blue-600"></i>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">ניתוח AI חכם</h3>
                 <p className="text-gray-600">מקבל תובנות מדויקות תוך שניות</p>
               </div>

               {/* Card 2 */}
               <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-check-circle text-2xl text-blue-600"></i>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">הערכת כדאיות מיידית</h3>
                 <p className="text-gray-600">חישוב החזר השקעה, רווחיות וסיכונים</p>
               </div>

               {/* Card 3 */}
               <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <i className="fas fa-file-alt text-2xl text-blue-600"></i>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-3">עובד עם הקבצים שלך</h3>
                 <p className="text-gray-600">דוחות, אקסלים ומידע שאתה מזין</p>
               </div>
             </div>
          </div>
        </section>

        {/* Tech Stack Logos Section */}
        <section className="py-12 bg-blue-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                מבוסס על הטכנולוגיות המובילות בעולם
              </h2>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {/* Vercel */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-400 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <i className="fas fa-play text-3xl text-white transform rotate-90"></i>
                </div>
                <p className="text-white font-medium">Vercel</p>
              </div>

              {/* Next.js */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-400 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <i className="fas fa-chevron-right text-3xl text-white"></i>
                </div>
                <p className="text-white font-medium">Next.js</p>
              </div>

              {/* Supabase */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-400 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <i className="fas fa-bolt text-3xl text-white"></i>
                </div>
                <p className="text-white font-medium">Supabase</p>
              </div>

              {/* OpenAI */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-400 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                  <img 
                    src="/images/icon01.png" 
                    alt="OpenAI" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <p className="text-white font-medium">OpenAI</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section id="stats-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">הישגים מוכחים</h2>
              <p className="text-xl text-gray-600">התוצאות שלנו מדברות בעד עצמן</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Card 1 - Time Savings */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-clock text-2xl text-blue-600"></i>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                  {animatedNumbers.timeSavings}%
                </div>
                <p className="text-gray-600">חיסכון בזמן קבלת החלטות</p>
              </div>

              {/* Card 2 - Businesses Analyzed */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-alt text-2xl text-blue-600"></i>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                  {animatedNumbers.businessesAnalyzed}+
                </div>
                <p className="text-gray-600">עסקים שנותחו</p>
              </div>

              {/* Card 3 - Customer Satisfaction */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check-circle text-2xl text-blue-600"></i>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                  {animatedNumbers.customerSatisfaction}%
                </div>
                <p className="text-gray-600">שביעות רצון לקוחות</p>
              </div>

              {/* Card 4 - Risk Analysis Accuracy */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-2xl text-blue-600"></i>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                  {animatedNumbers.riskAccuracy}%
                </div>
                <p className="text-gray-600">דיוק בניתוח סיכונים</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xl text-primary font-semibold mb-2">התכונות שלנו</p>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#2563eb' }}>איך זה עובד?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                תהליך פשוט בארבעה שלבים שיעזור לך לקבל את כל המידע הדרוש<br></br>לקבלת החלטה מושכלת:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 - Business Details */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <i className="fas fa-building text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right">הזנת פרטי העסק</h3>
                <p className="text-gray-600 text-right">הזן את המידע הבסיסי אודות העסק שאתה שוקל לרכוש, כולל תחום פעילות, גודל ומיקום</p>
              </div>
              
              {/* Step 2 - Upload Financial Reports */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <i className="fas fa-cloud-upload-alt text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right">העלאת דוחות כספיים</h3>
                <p className="text-gray-600 text-right">העלה דוחות כספיים, קבצי אקסל ומסמכים נוספים המתארים את פעילות העסק</p>
              </div>
              
              {/* Step 3 - AI Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <i className="fas fa-microchip text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right">ניתוח חכם מבוסס AI</h3>
                <p className="text-gray-600 text-right">המערכת מנתחת את כל הנתונים באמצעות אלגוריתמים מתקדמים ולמידת מכונה</p>
              </div>
              
              {/* Step 4 - Detailed Report */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <i className="fas fa-chart-bar text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-right">קבלת דוח מפורט</h3>
                <p className="text-gray-600 text-right">קבל דוח מקיף עם תובנות והמלצות לגבי הסיכונים והכדאיות של רכישת העסק</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-xl text-primary font-semibold mb-2">לקוחות מרוצים</p>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#2563eb' }}>מה אומרים עלינו</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                אלפי לקוחות כבר השתמשו בשירות שלנו לקבלת החלטות עסקיות חכמות יותר
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-all duration-300 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-1">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                      <path d="M7.545,9.54v2.5H11.5L7.545,9.54z" fill="#EA4335" style={{ transform: "translate(0, 2)" }} />
                      <path d="M12.5,16.5v-2.5H7.545L12.5,16.5z" fill="#FBBC05" style={{ transform: "translate(0, -2)" }} />
                      <path d="M12.5,9.5v3h5.5L12.5,9.5z" fill="#34A853" style={{ transform: "translate(2, 0)" }} />
                    </svg>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4.5" style={{ height: '18.54px', color: '#FFD700' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="inline-block text-xs font-medium text-gray-400">לפני יום 1</span>
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"המערכת חסכה לי זמן רב בניתוח עסק שרציתי לרכוש, וחשפה סיכונים שלא הייתי מודע אליהם. השקעה מצוינת!"</p>
                <div className="flex items-center">
                  <img src="/images/profile1.jpg" alt="Customer" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">דוד כהן</p>
                    <p className="text-sm text-gray-600">יזם עסקי</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-all duration-300 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-1">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                      <path d="M7.545,9.54v2.5H11.5L7.545,9.54z" fill="#EA4335" style={{ transform: "translate(0, 2)" }} />
                      <path d="M12.5,16.5v-2.5H7.545L12.5,16.5z" fill="#FBBC05" style={{ transform: "translate(0, -2)" }} />
                      <path d="M12.5,9.5v3h5.5L12.5,9.5z" fill="#34A853" style={{ transform: "translate(2, 0)" }} />
                    </svg>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4.5" style={{ height: '18.54px', color: '#FFD700' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="inline-block text-xs font-medium text-gray-400">לפני 3 ימים</span>
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"הניתוח היה מדויק להפליא וחסך לי אלפי שקלים על רכישה לא נכונה. ממליץ בחום!"</p>
                <div className="flex items-center">
                  <img src="/images/profile2.jpg" alt="Customer" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">שרה לוי</p>
                    <p className="text-sm text-gray-600">משקיעה</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-all duration-300 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="mr-1">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                      <path d="M7.545,9.54v2.5H11.5L7.545,9.54z" fill="#EA4335" style={{ transform: "translate(0, 2)" }} />
                      <path d="M12.5,16.5v-2.5H7.545L12.5,16.5z" fill="#FBBC05" style={{ transform: "translate(0, -2)" }} />
                      <path d="M12.5,9.5v3h5.5L12.5,9.5z" fill="#34A853" style={{ transform: "translate(2, 0)" }} />
                    </svg>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-4.5" style={{ height: '18.54px', color: '#FFD700' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="inline-block text-xs font-medium text-gray-400">לפני שבוע</span>
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">"שירות מקצועי ואמין. הניתוח היה מקיף ועזר לי לקבל החלטה מושכלת על רכישת עסק."</p>
                <div className="flex items-center">
                  <img src="/images/profile3.jpg" alt="Customer" className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-800">משה רוזן</p>
                    <p className="text-sm text-gray-600">בעל עסק</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              צרו קשר עכשיו וקבלו ניתוח מקצועי שיעזור לכם לקבל החלטה מושכלת
            </p>
            <a
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
            >
              צור קשר עכשיו
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 