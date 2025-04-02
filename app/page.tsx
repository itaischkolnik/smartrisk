'use client';

import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function Home() {
  // Add animation to statistics when they come into view
  useEffect(() => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Function to animate counter from 0 to target value
    const animateCounter = (
      element: HTMLElement, 
      targetValue: number, 
      duration = 2000, 
      isPercentage = false, 
      hasPrefix = false,
      format?: string
    ) => {
      let startTimestamp: number | null = null;
      const startValue = 0;
      let prefix = '';
      
      // Handle +/- prefix
      if (hasPrefix) {
        prefix = targetValue < 0 ? '-' : '+';
        targetValue = Math.abs(targetValue);
      }

      // Determine if the value has + prefix and is not negative
      const isPlus = hasPrefix && prefix === '+';
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const currentValue = Math.floor(easeProgress * (targetValue - startValue) + startValue);
        
        if (format === 'plus') {
          element.textContent = `+${currentValue}`;
        } else if (format === 'minus') {
          element.textContent = `-${currentValue}%`;
        } else if (isPercentage) {
          element.textContent = `${isPlus ? '+' : ''}${currentValue}%`;
        } else if (hasPrefix) {
          element.textContent = `${prefix}${currentValue}`;
        } else {
          element.textContent = currentValue.toString();
        }
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          // Ensure the final value is exactly as specified in data-value
          if (format === 'plus') {
            element.textContent = `+${targetValue}`;
          } else if (format === 'minus') {
            element.textContent = `-${targetValue}%`;
          } else if (isPercentage) {
            element.textContent = `${isPlus ? '+' : ''}${targetValue}%`;
          } else if (hasPrefix) {
            element.textContent = `${prefix}${targetValue}`;
          } else {
            element.textContent = targetValue.toString();
          }
        }
      };
      
      window.requestAnimationFrame(step);
    };
    
    if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated');
              
              // Get the target value from data attribute
              const targetValue = parseInt(entry.target.getAttribute('data-value') || '0', 10);
              const isPercentage = entry.target.textContent?.includes('%') || false;
              const hasPrefix = entry.target.textContent?.startsWith('+') || entry.target.textContent?.startsWith('-');
              const format = entry.target.getAttribute('data-format');
              
              // Start the counter animation
              if (format === 'plus') {
                // Special case for 2500+
                animateCounter(entry.target as HTMLElement, targetValue, 2000, false, false, 'plus');
              } else if (format === 'minus') {
                // Special case for -40%
                animateCounter(entry.target as HTMLElement, targetValue, 2000, true, false, 'minus');
              } else {
                animateCounter(entry.target as HTMLElement, targetValue, 2000, isPercentage, hasPrefix);
              }
              
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      statNumbers.forEach((stat) => {
        observer.observe(stat);
      });
      
      return () => {
        statNumbers.forEach((stat) => {
          observer.unobserve(stat);
        });
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        @keyframes floatingDot {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        }
        
        .futuristic-input {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .futuristic-input:focus {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(59, 130, 246, 0.8);
          animation: glowPulse 2s infinite;
        }
        
        .glow-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .glow-button:before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: -1;
          background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6);
          background-size: 400%;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 14px;
        }
        
        .glow-button:hover:before {
          opacity: 1;
          animation: glowAnimation 3s infinite;
        }
        
        @keyframes glowAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .text-shadow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(59, 130, 246, 0.3);
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes floating {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes drawLine {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        .feature-card {
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 0;
          background: linear-gradient(to right, #2563eb, #60a5fa);
          transition: none;
          z-index: 1;
        }
        
        .feature-card:hover::before {
          animation: drawLine 0.6s ease-out forwards;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
          {/* Dynamic Abstract shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" 
              style={{ 
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px' 
              }}>
          </div>
          
          {/* Animated dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(10)].map((_, i) => {
              // Use deterministic values based on index
              const width = 3 + (i % 5) * 2;
              const height = 3 + ((i + 2) % 5) * 2;
              const top = (i * 10) % 100;
              const left = ((i * 15) + 10) % 100;
              const opacity = 0.1 + (i * 0.05);
              const duration = 10 + (i * 2);
              const delay = i;

              return (
                <div 
                  key={i}
                  className="absolute rounded-full bg-primary-light"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}%`,
                    left: `${left}%`,
                    opacity: opacity,
                    animation: `floatingDot ${duration}s linear infinite`,
                    animationDelay: `${delay}s`
                  }}
                ></div>
              );
            })}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center md:text-left md:w-5/12 mb-8 md:mb-12" style={{ position: 'relative', zIndex: 20, marginLeft: '-250px' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight text-white">
            קבלו ניתוח מדויק לפני רכישת עסק
            </h1>
            <p className="text-xl mb-8 text-white opacity-90 leading-relaxed">
              המערכת שתבצע עבורכם ניתוח סיכונים חכם לעסק שאתם שוקלים לרכוש<br></br>– בעזרת AI, דוחות, ואקסלים שאתם מעלים. חכם, מהיר, אישי.
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto clear-both">
            {/* Contact form positioned to allow space for the image */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 relative z-0">
              <div className="flex flex-col md:flex-row justify-between items-start">
                {/* Empty space on left side in DOM (right side visually in RTL) */}
                <div className="hidden md:block md:w-6/12 lg:w-6/12"></div>
                
                {/* Form positioned on right side in DOM (left side visually in RTL) */}
                <div className="w-full md:w-5/12 lg:w-5/12">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '55%' }}>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 text-right">השאר פרטים לתיאום פגישה</h3>
                      <form>
                        <div className="space-y-4">
                          <input 
                            type="text" 
                            className="futuristic-input w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all duration-300 text-right" 
                            placeholder="שם מלא" 
                            required 
                          />
                          <input 
                            type="email" 
                            className="futuristic-input w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all duration-300 text-right" 
                            placeholder="דוא״ל" 
                            required 
                          />
                          <input 
                            type="tel" 
                            className="futuristic-input w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all duration-300 text-right" 
                            placeholder="טלפון נייד" 
                            required
                          />
                          <button 
                            type="submit" 
                            className="glow-button w-full mt-5 bg-primary text-white font-bold py-3 px-6 rounded-xl shadow-md border-0 hover:bg-primary-dark hover:shadow-lg active:shadow-inner active:bg-primary-800 transition-all duration-300"
                          >
                            שלח פרטים
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Person image positioned on the right side */}
              <div className="absolute z-10 hidden md:block" style={{ top: '-240px', right: '-50px' }}>
                <img 
                  src="/images/001.png" 
                  alt="SmartRisk Analytics" 
                  className="w-96 h-auto"
                  style={{ filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))" }}
                />
              </div>
            </div>
            
            {/* Mobile version of the image (displayed below the form) */}
            <div className="md:hidden mt-8 text-center">
              <img 
                src="/images/001.png" 
                alt="SmartRisk Analytics" 
                className="w-48 h-auto mx-auto"
                style={{ filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.2))" }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Benefits Section - replaced Trusted By */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-xl shadow-sm p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent hover:border-primary-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mt-12 -mr-12 opacity-30"></div>
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary mb-5 transform hover:rotate-12 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">ניתוח AI חכם</h3>
                <p className="text-gray-600">מקבל תובנות מדויקות תוך שניות</p>
              </div>
            </div>
            
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-xl shadow-sm p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent hover:border-primary-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mt-12 -mr-12 opacity-30"></div>
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary mb-5 transform hover:rotate-12 transition-transform duration-300">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="#2563eb">
                    <path d="M6.5,13.5L10,17l7.5-11" stroke="#2563eb" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">הערכת כדאיות מיידית</h3>
                <p className="text-gray-600">חישוב החזר השקעה, רווחיות וסיכונים</p>
              </div>
            </div>
            
            <div className="bg-white backdrop-blur-sm bg-opacity-80 rounded-xl shadow-sm p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent hover:border-primary-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mt-12 -mr-12 opacity-30"></div>
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary mb-5 transform hover:rotate-12 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">עובד עם הקבצים שלך</h3>
                <p className="text-gray-600">דוחות, אקסלים ומידע שאתה מזין</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tech Stack Logos Section */}
      <section className="relative py-24" style={{ backgroundColor: '#1d4ed8' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-center text-white mb-16 text-3xl font-bold">מבוסס על הטכנולוגיות המובילות בעולם</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto">
            {/* OpenAI Logo */}
            <div className="flex flex-col items-center justify-center group">
              <div className="w-32 h-32 flex items-center justify-center bg-white/15 rounded-2xl backdrop-blur-sm p-6 shadow-xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-105 border-[6px] border-white hover:border-white" style={{ 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
                animation: 'pulse 3s ease-in-out infinite'
              }}>
                <svg viewBox="0 0 24 24" className="h-12 text-white transition-all duration-500" style={{
                  animation: 'floating 3s ease-in-out infinite',
                }} fill="currentColor">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                </svg>
              </div>
              <span className="mt-6 text-white font-semibold text-lg tracking-wide">OpenAI</span>
            </div>
            
            {/* Supabase Logo */}
            <div className="flex flex-col items-center justify-center group">
              <div className="w-32 h-32 flex items-center justify-center bg-white/15 rounded-2xl backdrop-blur-sm p-6 shadow-xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-105 border-[6px] border-white hover:border-white" style={{ 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
                animation: 'pulse 3s ease-in-out infinite 0.5s'
              }}>
                <svg viewBox="0 0 109 113" className="h-12 text-white transition-all duration-500" style={{
                  animation: 'floating 3s ease-in-out infinite 0.5s',
                }} fill="currentColor">
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" />
                  <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fillOpacity="0.2"/>
                  <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" />
                </svg>
              </div>
              <span className="mt-6 text-white font-semibold text-lg tracking-wide">Supabase</span>
            </div>
            
            {/* Next.js Logo */}
            <div className="flex flex-col items-center justify-center group">
              <div className="w-32 h-32 flex items-center justify-center bg-white/15 rounded-2xl backdrop-blur-sm p-6 shadow-xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-105 border-[6px] border-white hover:border-white" style={{ 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
                animation: 'pulse 3s ease-in-out infinite 1s'
              }}>
                <svg className="h-12 text-white transition-all duration-500" style={{
                  animation: 'floating 3s ease-in-out infinite 1s',
                }} viewBox="0 0 82 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="mt-6 text-white font-semibold text-lg tracking-wide">Next.js</span>
            </div>
            
            {/* Vercel Logo */}
            <div className="flex flex-col items-center justify-center group">
              <div className="w-32 h-32 flex items-center justify-center bg-white/15 rounded-2xl backdrop-blur-sm p-6 shadow-xl transition-all duration-500 group-hover:bg-white/25 group-hover:scale-105 border-[6px] border-white hover:border-white" style={{ 
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
                animation: 'pulse 3s ease-in-out infinite 1.5s'
              }}>
                <svg className="h-12 text-white transition-all duration-500" style={{
                  animation: 'floating 3s ease-in-out infinite 1.5s',
                }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L24 22H0L12 1Z"></path>
                </svg>
              </div>
              <span className="mt-6 text-white font-semibold text-lg tracking-wide">Vercel</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-36 bg-gradient-to-br from-primary-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-primary opacity-10"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-blue-600 opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-bold mb-4" style={{ marginTop: '3rem', color: '#2563eb' }}>הישגים מוכחים</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">התוצאות שלנו מדברות בעד עצמן</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <div className="bg-white rounded-xl shadow-md p-8 text-center relative transform transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex justify-center">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#2563eb">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2 stat-number stat-number-delay-1" data-value="95">0%</p>
              <p className="text-gray-700 font-medium text-lg">דיוק בניתוח סיכונים</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center relative transform transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex justify-center">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="#2563eb">
                  <path d="M6.5,13.5L10,17l7.5-11" stroke="#2563eb" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2 stat-number stat-number-delay-3" data-value="98">0%</p>
              <p className="text-gray-700 font-medium text-lg">שביעות רצון לקוחות</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center relative transform transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex justify-center">
                <svg width="50" height="50" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth="2" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2 stat-number stat-number-delay-2" data-value="2500" data-format="plus">0</p>
              <p className="text-gray-700 font-medium text-lg">עסקים שנותחו</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center relative transform transition-all duration-300 hover:shadow-lg">
              <div className="mx-auto mb-6 flex justify-center">
                <svg width="50" height="50" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#2563eb" strokeWidth="2" fill="none" />
                  <path d="M12 7v5l4 3" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2 stat-number stat-number-delay-4" data-value="40" data-format="minus">0%</p>
              <p className="text-gray-700 font-medium text-lg">חיסכון בזמן קבלת החלטות</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xl text-primary font-semibold mb-2">התכונות שלנו</p>
            <h2 className="text-5xl font-bold mb-8" style={{ color: '#2563eb' }}>איך זה עובד?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              תהליך פשוט בארבעה שלבים שיעזור לך לקבל את כל המידע הדרוש<br></br>לקבלת החלטה מושכלת:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">הזנת פרטי העסק</h3>
              <p className="text-gray-600">הזן את המידע הבסיסי אודות העסק שאתה שוקל לרכוש, כולל תחום פעילות, גודל ומיקום</p>
            </div>
            
            <div className="feature-card bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">העלאת דוחות כספיים</h3>
              <p className="text-gray-600">העלה דוחות כספיים, קבצי אקסל ומסמכים נוספים המתארים את פעילות העסק</p>
            </div>
            
            <div className="feature-card bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">ניתוח חכם מבוסס AI</h3>
              <p className="text-gray-600">המערכת מנתחת את כל הנתונים באמצעות אלגוריתמים מתקדמים ולמידת מכונה</p>
            </div>
            
            <div className="feature-card bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center text-primary mb-6">
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
                <div className="ml-4">
                  <img src="/images/profile1.jpg" alt="אבי לוי" className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">אבי לוי</h4>
                  <p className="text-gray-500 text-sm">יזם סדרתי</p>
                </div>
              </div>
              <div className="bg-red-500 h-1 mt-6 mx-auto w-40 rounded-full">
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
                <span className="inline-block text-xs font-medium text-gray-400">לפני חודשים 2</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">"בזכות הניתוח של SmartRisk זיהיתי פוטנציאל צמיחה בעסק שבחנתי, וקיבלתי החלטה מבוססת יותר. היום העסק משגשג!"</p>
              <div className="flex items-center">
                <div className="ml-4">
                  <img src="/images/profile2.jpg" alt="מיכל כהן" className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">מיכל כהן</h4>
                  <p className="text-gray-500 text-sm">מנהלת השקעות</p>
                </div>
              </div>
              <div className="bg-red-500 h-1 mt-6 mx-auto w-40 rounded-full">
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
                <span className="inline-block text-xs font-medium text-gray-400">לפני שנה</span>
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">"כרואה חשבון, אני מעריך את הדיוק והמקצועיות של הניתוחים. חוסך לי המון זמן בייעוץ ללקוחות שלי."</p>
              <div className="flex items-center">
                <div className="ml-4">
                  <img src="/images/profile3.jpg" alt="דניאל רוזן" className="w-12 h-12 object-cover rounded-full border-2 border-gray-200" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">דניאל רוזן</h4>
                  <p className="text-gray-500 text-sm">רואה חשבון</p>
                </div>
              </div>
              <div className="bg-red-500 h-1 mt-6 mx-auto w-40 rounded-full">
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 