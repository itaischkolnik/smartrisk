import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartRisk',
  description: 'Risk management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 