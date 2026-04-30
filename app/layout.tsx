import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Junior",
  description: "AI inbox for private credit fund deal flow"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body
        className={`${GeistSans.className} min-h-dvh bg-[#fafbfc] text-zinc-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
