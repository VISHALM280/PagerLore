import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PagerLore — Memory-Powered Incident Response & Intelligence Platform",
  description: "The next incident shouldn't start from zero. PagerLore remembers how your systems failed, recalls what actually fixed them, and helps engineering teams resolve the next production incident with the knowledge of every incident before it.",
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
