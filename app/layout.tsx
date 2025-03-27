import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

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
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
} 