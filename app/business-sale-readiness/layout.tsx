import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מכירת עסק | בדיקת מוכנות חינם למכירת עסקים – SmartRisk",
  description: "בדקו בחינם את רמת מוכנות העסק שלכם למכירה בעזרת כלי הערכה מתקדם. שאלון מקיף המבוסס על ניסיון של מעל 10 שנים בליווי מאות עסקאות.",
};

export default function BusinessSaleReadinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
