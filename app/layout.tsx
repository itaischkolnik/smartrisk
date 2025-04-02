import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { AuthClientProvider } from "./contexts/AuthClientContext";

const heebo = Heebo({ subsets: ["hebrew", "latin"] });

export const metadata: Metadata = {
  title: "SmartRisk - הערכת סיכונים חכמה לעסקים",
  description: "מערכת מבוססת AI לניתוח והערכת סיכונים לעסקים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={heebo.className}>
        <AuthClientProvider>
          {children}
        </AuthClientProvider>
      </body>
    </html>
  );
} 