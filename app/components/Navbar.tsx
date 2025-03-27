import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center">
              <span className="text-primary-600 font-bold text-2xl">SmartRisk</span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex space-x-8 space-x-reverse">
          <Link href="/about" className="text-gray-600 hover:text-primary-600 transition">
            אודות
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-primary-600 transition">
            תכונות
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition">
            תמחור
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition">
            צור קשר
          </Link>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/login" className="text-gray-600 hover:text-primary-600 transition">
            התחברות
          </Link>
          <Link href="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition">
            הרשמה
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 