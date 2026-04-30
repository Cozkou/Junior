import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sterile Site",
  description: "Minimal Next.js site with inbox and pitch deck views"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
