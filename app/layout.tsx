import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Rubik } from 'next/font/google';

const rubik = Rubik({ 
  subsets: ['hebrew', 'latin'],
  variable: '--font-rubik', 
});

export const metadata: Metadata = {
  title: 'SmartRisk - ניהול סיכונים חכם לעסקים',
  description: 'פלטפורמה מבוססת AI לניתוח והערכת סיכונים וכדאיות של רכישת עסק',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${rubik.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
} 