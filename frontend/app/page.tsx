import type { Metadata } from "next";
import { JuniorDemoWidget } from "../components/JuniorDemoWidget";

export const metadata: Metadata = {
  title: "Junior · Pitch",
  description: "Interactive scrollytelling demo for Junior: AI junior analyst for private credit."
};

export default function HomePage() {
  return (
    <div
      data-junior-demo-scroll-root
      className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-pb-[7.5rem] scroll-smooth"
      style={{ backgroundColor: "#F7F6F3" }}
    >
      <div className="mx-auto max-w-[1000px] px-4 py-6 md:py-8">
        <JuniorDemoWidget />
      </div>
    </div>
  );
}
