'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "למה שאני אשתמש בשירות הזה ולא פשוט אשאל את רואה החשבון שלי?",
      answer: "רואה החשבון בודק דוחות עבר בלבד. SmartRisk מנתח סיכונים נסתרים ומבוסס על מודלים מתקדמים, דאטה עדכנית ובינה מלאכותית – כך שתקבל תמונה עדכנית, אובייקטיבית ומעמיקה שלא תמצא אצל רואה החשבון הרגיל."
    },
    {
      question: "כמה השירות אמין? זה באמת מבוסס על AI?",
      answer: "כן. המערכת שלנו משתמשת באינטליגנציה מלאכותית מתקדמת של OpenAI עם אלפי דגימות, ועד היום הדוחות סיפקו ערך אמיתי לרוכשים ומוכרים כאחד. כל דוח נבדק ומבוקר כל הזמן."
    },
    {
      question: "אני מפחד שהמידע יגיע לצד שלישי או שיפרצו לי לנתונים.",
      answer: "שמירה על פרטיותך ואבטחת המידע שלך היא ערך עליון אצלנו. כל הנתונים מוצפנים ואינם מועברים לאף גורם אחר."
    },
    {
      question: "תוך כמה זמן אקבל את הדוח?",
      answer: "ברוב המקרים הדוח מוכן תוך 48 שעות ממסירת כל הנתונים. תוכל לעקוב אונליין ולקבל עדכון מידי כשהדוח מוכן."
    },
    {
      question: "מה אני עושה עם הדוח אחר כך?",
      answer: "הדוח שלנו נועד להעניק לך יתרון בקנייה או במכירה – לקבל החלטות, לנהל מו\"מ טוב יותר מול קונים/מוכרים, ואפילו להציג לבנקים או משקיעים."
    },
    {
      question: "זה לא עוד דוח גנרי?",
      answer: "ממש לא. כל דוח מותאם אישית לעסק שלך ומבוסס על נתונים פיננסיים, מגמות שוק, תחרות, עובדים ועוד. לא תקבל תבנית – תקבל תובנות ממוקדות ומעשיות."
    },
    {
      question: "יקר לי / המחיר גבוה.",
      answer: "טעויות בעסקאות כאלה עולות עשרות אלפי שקלים ואף יותר. השירות שלנו במחיר הוגן, והוא חוסך ללקוחותינו סכומים גדולים וטעויות יקרות."
    },
    {
      question: "יש לכם ניסיון גם בעסקים קטנים?",
      answer: "בוודאי! SmartRisk מותאם לעסקים בכל גודל – מהקטנים ביותר ועד הגדולים. השיטה שלנו מאפשרת דוח מדויק גם לעסק קטן ומקומי."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItem(prev => 
      prev === index ? null : index
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        .faq-question {
          color: white !important;
        }
        
        .faq-question:hover {
          color: white !important;
        }
        
        /* Override global white-on-white prevention for FAQ questions */
        .faq-section .faq-question {
          color: white !important;
        }
        
        .faq-section button .faq-question {
          color: white !important;
        }
        
        /* FAQ Answer Animation Styles */
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(10px);
        }
        
        .faq-answer.open {
          max-height: 200px;
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Smooth icon rotation */
        .faq-icon {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .faq-icon.rotated {
          transform: rotate(180deg);
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
              שאלות נפוצות
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              תשובות לשאלות הנפוצות ביותר על השירות שלנו
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
                         <div className="space-y-8">
              {faqData.map((item, index) => (
                <div key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden" style={{ border: 'none' }}>
                                                                                                                           <button
                         onClick={() => toggleItem(index)}
                         className="w-full px-8 py-6 text-right transition-all duration-300 flex items-center group rounded-t-lg"
                         style={{ 
                           backgroundColor: '#2563eb',
                           color: 'white',
                           border: 'none',
                           outline: 'none'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                       >
                         <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-full p-2 group-hover:bg-opacity-30 transition-all duration-300 ml-4">
                           <svg
                             className={`faq-icon w-5 h-5 text-white ${
                               openItem === index ? 'rotated' : ''
                             }`}
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24"
                           >
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                           </svg>
                         </div>
                         <span className="faq-question text-lg font-semibold flex-1 text-right">{item.question}</span>
                       </button>
                  <div className={`faq-answer ${openItem === index ? 'open' : ''}`}>
                    <div className="px-8 py-6 bg-white rounded-b-lg" style={{ border: 'none' }}>
                      <p className="text-gray-800 leading-relaxed text-base">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 