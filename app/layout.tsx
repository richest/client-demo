import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hearth - Find the perfect home products",
  description:
    "A production-ready product search experience built with Next.js, TypeScript, React 19, and Tailwind CSS."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf6ef] font-[Inter,ui-sans-serif,system-ui,sans-serif] text-[#241f1a] antialiased selection:bg-[#c1602f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
