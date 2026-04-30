"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const slides = [
  {
    title: "Problem",
    text: "Teams lose hours each week in fragmented communication."
  },
  {
    title: "Solution",
    text: "A focused operating layer that unifies updates, ownership, and delivery."
  },
  {
    title: "Market",
    text: "Remote-first companies need simple, high-trust coordination tools."
  },
  {
    title: "Business Model",
    text: "Usage-based subscriptions with enterprise security add-ons."
  },
  {
    title: "Ask",
    text: "Seeking strategic partners and early pilot customers."
  }
];

export default function PitchDeckPage() {
  const [index, setIndex] = useState(0);
  const current = useMemo(() => slides[index], [index]);

  return (
    <main
      className="viewport"
      style={{
        display: "grid",
        gridTemplateRows: "1fr auto",
        padding: "1rem",
        gap: "0.75rem"
      }}
    >
      <section
        className="card"
        style={{
          minHeight: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "1.5rem"
        }}
      >
        <div style={{ maxWidth: 760, display: "grid", gap: "0.9rem" }}>
          <small style={{ margin: 0, color: "var(--muted)" }}>
            Slide {index + 1} / {slides.length}
          </small>
          <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 5vw, 3rem)" }}>
            {current.title}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "clamp(1rem, 2.6vw, 1.2rem)" }}>
            {current.text}
          </p>
        </div>
      </section>

      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.6rem",
          flexWrap: "wrap"
        }}
      >
        <Link className="btn" href="/">
          Home
        </Link>
        <button
          className="btn"
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          className="btn"
          onClick={() => setIndex((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={index === slides.length - 1}
        >
          Next
        </button>
      </footer>
    </main>
  );
}
