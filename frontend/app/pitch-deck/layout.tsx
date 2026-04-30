import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch deck · Junior",
  description: "Junior: AI junior analyst for private credit funds."
};

export default function PitchDeckLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
