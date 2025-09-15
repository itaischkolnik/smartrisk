'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PricingPage() {
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        /* Force all text in pricing cards to be white, except buttons */
        .pricing-section * {
          color: white !important;
        }
        
        /* More specific rules for pricing cards */
        .pricing-card * {
          color: white !important;
        }
        
        /* Target specific elements that might be overridden, but exclude buttons */
        .pricing-card h3,
        .pricing-card div,
        .pricing-card p,
        .pricing-card span,
        .pricing-card li {
          color: white !important;
        }
        
        /* Exclude buttons from white text styling - make this more specific and stronger */
        .pricing-card button,
        .pricing-card button *,
        .pricing-section button,
        .pricing-section button * {
          color: #2563eb !important;
        }
        
        /* Force Businessman plan descriptive texts to stay small */
        .pricing-card p[style*="fontSize: '0.55rem'"],
        .pricing-card p[style*="fontSize: '0.6rem'"] {
          font-size: 0.55rem !important;
        }
        
        /* More specific targeting for the Businessman plan texts */
        .pricing-card div[style*="background: linear-gradient(135deg, #1e40af"] p {
          font-size: 0.55rem !important;
        }
        
        /* Target the businessman-plan class specifically */
        .businessman-plan p {
          font-size: 0.55rem !important;
        }
        
        /* Even more specific targeting */
        .businessman-plan p:nth-of-type(1) {
          font-size: 0.75rem !important;
        }
        
        .businessman-plan p:nth-of-type(2) {
          font-size: 0.8rem !important;
        }
        
        /* Target the professional-plan class specifically */
        .professional-plan p {
          font-size: 0.75rem !important;
        }
        
        /* Even more specific targeting for Professional plan */
        .professional-plan p:nth-of-type(1) {
          font-size: 0.75rem !important;
        }
        
        .professional-plan p:nth-of-type(2) {
          font-size: 0.8rem !important;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-white">
              תמחור שקוף וברור
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              בחרו את החבילה המתאימה לכם ביותר. כל התוכניות כוללות ניתוח מקצועי, דוחות מפורטים ותמיכה מלאה
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="bg-white py-16 min-h-screen pricing-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 shadow-xl border-2 border-primary text-white text-center flex flex-col h-[600px] pricing-card" style={{ color: 'white !important' }}>
              <div style={{ color: 'white !important', flex: '1' }}>
                <h3 className="text-2xl font-bold mb-4 text-white" style={{ color: 'white !important' }}>חינם</h3>
                <div className="text-4xl font-bold mb-4 text-white" style={{ color: 'white !important' }}>₪0</div>
                <p className="mb-8 opacity-90 text-white" style={{ color: 'white !important' }}>התחלה חינמית</p>
                
                <ul className="list-none p-0 mb-8 space-y-4">
                  <li className="flex items-center">
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✓</span>
                    <span className="text-white" style={{ color: 'white !important' }}>דוח נתונים</span>
                  </li>
                  <li className="flex items-center" style={{ opacity: '0.5' }}>
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✗</span>
                    <span className="text-white" style={{ color: 'white !important' }}>נתונים אישיים</span>
                  </li>
                  <li className="flex items-center" style={{ opacity: '0.5' }}>
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✗</span>
                    <span className="text-white" style={{ color: 'white !important' }}>ניתוח נתונים עסקי</span>
                  </li>
                  <li className="flex items-center" style={{ opacity: '0.5' }}>
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✗</span>
                    <span className="text-white" style={{ color: 'white !important' }}>ניתוח מגמות</span>
                  </li>
                  <li className="flex items-center" style={{ opacity: '0.5' }}>
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✗</span>
                    <span className="text-white" style={{ color: 'white !important' }}>ניתוח נתונים ברמה אישית</span>
                  </li>
                  <li className="flex items-center" style={{ opacity: '0.5' }}>
                    <span className="text-white ml-3" style={{ color: 'white !important' }}>✗</span>
                    <span className="text-white" style={{ color: 'white !important' }}>שיחת יעוץ טלפונית</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => router.push('/auth/login')}
                className="w-full bg-white text-primary py-3 px-6 rounded-xl font-bold cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                style={{ color: '#2563eb' }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.cursor = 'pointer'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.cursor = 'pointer'}
              >
                התחל חינם
              </button>
            </div>

            {/* Entrepreneur Plan */}
            <div className="pricing-card" style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '2px solid #60a5fa',
              color: 'white !important',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              
              <div style={{ color: 'white !important', flex: '1' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>יזם</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>₪590</div>
                <p style={{ marginBottom: '2rem', opacity: '0.9', color: 'white !important' }}>בדיקה חד פעמית של עסק</p>
                
                <ul style={{ listStyle: 'none', padding: '0', marginBottom: '2rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>נתונים אישיים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>דוח נתונים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים עסקי</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח מגמות</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים ברמה אישית</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>שיחת יעוץ טלפונית</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={() => window.open('https://live.payme.io/sale/template/SALE1753-798121K3-BHUKB5Y3-STJUNJYG', '_blank')}
                style={{
                  width: '100%',
                  background: 'white',
                  color: '#2563eb',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                בחר חבילה זו
              </button>
            </div>

            {/* Businessman Plan */}
            <div className="pricing-card businessman-plan" style={{
              background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '2px solid #3b82f6',
              color: 'white !important',
              textAlign: 'center',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              <div style={{
                position: 'absolute',
                top: '-1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fbbf24',
                color: '#92400e',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}>
                מומלץ
              </div>
              
              <div style={{ color: 'white !important', flex: '1' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>איש עסקים</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>₪200×12</div>
                <p style={{ fontSize: '0.55rem', marginBottom: '0.5rem', opacity: '0.9', color: 'white !important' }}>עד 12 ניתוחים בשנה + 6 בונוס</p>
                <p style={{ fontSize: '0.8rem', marginBottom: '2rem', opacity: '0.9', color: 'white !important' }}>למי שרוצה להשקיע בעסק עוד השנה</p>
                
                <ul style={{ listStyle: 'none', padding: '0', marginBottom: '2rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>נתונים אישיים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>דוח נתונים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים עסקי</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח מגמות</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים ברמה אישית</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', opacity: '0.5' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✗</span>
                    <span style={{ color: 'white !important' }}>שיחת יעוץ טלפונית</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={handleContactClick}
                style={{
                  width: '100%',
                  background: 'white',
                  color: '#2563eb',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                בחר חבילה זו
              </button>
            </div>

            {/* Professional Plan */}
            <div className="pricing-card professional-plan" style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '1.5rem',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '2px solid #818cf8',
              color: 'white !important',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '600px'
            }}>
              <div style={{ color: 'white !important', flex: '1' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>מקצועי</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white !important' }}>₪200×12</div>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: '0.9', color: 'white !important' }}>עד 36 ניתוחים בשנה</p>
                <p style={{ marginBottom: '2rem', opacity: '0.9', color: 'white !important' }}>לאנשי מקצוע מתווכים, רו"ח, עו"ד, יועצים עסקיים</p>
                
                <ul style={{ listStyle: 'none', padding: '0', marginBottom: '2rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>דוח נתונים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים עסקי</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✓</span>
                    <span style={{ color: 'white !important' }}>ניתוח מגמות</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', opacity: '0.5' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✗</span>
                    <span style={{ color: 'white !important' }}>נתונים אישיים</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', opacity: '0.5' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✗</span>
                    <span style={{ color: 'white !important' }}>ניתוח נתונים ברמה אישית</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', opacity: '0.5' }}>
                    <span style={{ color: 'white !important', marginRight: '0.75rem' }}>✗</span>
                    <span style={{ color: 'white !important' }}>שיחת יעוץ טלפונית</span>
                  </li>
                </ul>
              </div>
              
              <button 
                onClick={handleContactClick}
                style={{
                  width: '100%',
                  background: 'white',
                  color: '#2563eb',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: 'auto'
                }}
              >
                בחר חבילה זו
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 