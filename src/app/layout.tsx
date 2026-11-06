import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PagerLore — Engineering Remembers",
  description: "PagerLore connects the knowledge of past failures with today's investigations, helping engineering teams move forward with experience rather than starting from zero.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F7F2] text-[#25352D] antialiased selection:bg-[#EAF2EC] selection:text-[#194B38]">
        {children}
      </body>
    </html>
  );
}
