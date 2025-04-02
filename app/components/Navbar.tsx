import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="bg-white bg-opacity-95 backdrop-blur-sm shadow-sm py-4 px-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="no-underline">
            <div className="flex items-center">
              <Image
                src="/images/logo01.png"
                alt="SmartRisk Logo"
                width={160}
                height={40}
                priority
              />
            </div>
          </Link>
        </div>

        <div className="hidden md:flex space-x-8 space-x-reverse">
          <Link href="/about" className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline">
            אודות
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline">
            תכונות
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline">
            תמחור
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline">
            צור קשר
          </Link>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/auth/login" className="text-gray-600 hover:text-primary transition duration-300 px-3 py-2 text-rtl no-underline">
            התחברות
          </Link>
          <Link href="/auth/signup" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300 text-rtl no-underline">
            הרשמה חינם
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 