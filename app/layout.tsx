import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birthday Wishes Generator - AI Powered Card Creator",
  description: "Create beautiful, personalized birthday cards with AI-generated wishes. Edit, customize, and download high-quality birthday greeting cards instantly.",
  keywords: ["birthday", "wishes", "AI", "card generator", "greeting cards", "birthday cards"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        {children}
      </body>
    </html>
  );
}
