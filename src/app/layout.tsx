import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { DemoTopBar } from "@/components/shared/DemoTopBar";

export const metadata: Metadata = {
  title: "The Farm Story – Farm-to-Table Retail Management Platform",
  description: "A connected system for farm-to-table retail: purchasing, live stock, store POS, e-commerce, delivery, and Indian GST accounts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F6F0] text-[#1E2B23] font-sans">
        <Suspense fallback={<div className="h-8 bg-[#123B2A]" />}>
          <DemoTopBar />
        </Suspense>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
