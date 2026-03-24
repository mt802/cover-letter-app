import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cover Letter Generator — Human Voiced",
  description: "Generate cover letters that actually sound like you.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
