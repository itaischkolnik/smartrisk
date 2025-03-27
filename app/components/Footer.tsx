import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
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
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-400 hover:text-white transition">
                  תכונות
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition">
                  תמחור
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">משאבים</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition">
                  בלוג
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  שאלות נפוצות
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition">
                  תמיכה
                </Link>
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
  );
};

export default Footer; 