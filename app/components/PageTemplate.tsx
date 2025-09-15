'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageTemplateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageTemplate({ children, title, description }: PageTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 