"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const slides: { headline: string; body: string[] }[] = [
  {
    headline: "Junior.",
    body: [
      "AI built for the people who can't afford to be wrong.",
      "An AI junior analyst for private credit funds.",
      "Made by KLC (Kiara, Lee, Cosmin)"
    ]
  },
  {
    headline: "One of us has sat in the seat.",
    body: [
      "Kiara, on our team, worked at a real estate private credit fund.",
      "She went through the grunt work and found the pain points."
    ]
  },
  {
    headline: "Three problems credit funds quietly live with.",
    body: [
      "01 · Hours lost to admin work.",
      "02 · Knowledge trapped in senior heads.",
      "03 · Real-time risk signals nobody's watching."
    ]
  },
  {
    headline: "One product. Three problems addressed.",
    body: [
      "01 → Does the grunt work for you: populating models, drafting replies, chasing what's outstanding.",
      "02 → Applies your fund's unwritten rules to every deal.",
      "03 → Alerts you about relevant market signals you might have missed.",
      "Recommends. Never decides."
    ]
  },
  {
    headline: "Camden Bridge.",
    body: ["£12m. 90 seconds."]
  },
  {
    headline: "Trained on data no one else can have.",
    body: ["Each fund's own deal book becomes its own AI."]
  },
  {
    headline: "Junior.",
    body: [
      "Reads every deal. Knows your fund.",
      "Catches what changes. Hands you the decision."
    ]
  }
];

export default function PitchDeckPage() {
  const [index, setIndex] = useState(0);
  const current = slides[index];

  const goPrev = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((prev) => Math.min(slides.length - 1, prev + 1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  return (
    <main
      className="viewport bg-cross-subtle"
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        padding: "clamp(1rem, 3vw, 1.75rem)",
        gap: "1rem"
      }}
    >
      <header
        className="shell"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem"
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.6875rem",
            fontWeight: 650,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)"
          }}
        >
          Junior · Pitch
        </p>
        <Link className="link-quiet" href="/">
          ← Back to home
        </Link>
      </header>

      <div className="shell" style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
        <section
          id="pitch-slide-panel"
          aria-live="polite"
          aria-atomic="true"
          className="card home-visual"
          style={{
            flex: 1,
            minHeight: "min(520px, 70dvh)",
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            padding: "clamp(1.5rem, 4vw, 2.75rem)"
          }}
        >
          <div style={{ maxWidth: 760, display: "grid", gap: "clamp(0.85rem, 2vw, 1.25rem)" }}>
            <small style={{ margin: 0, color: "var(--muted)" }}>
              Slide {index + 1} / {slides.length}
            </small>
            <h1 style={{ margin: 0, fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 650 }}>
              {current.headline}
            </h1>
            <div
              style={{
                display: "grid",
                gap: "clamp(0.55rem, 1.8vw, 0.85rem)"
              }}
            >
              {current.body.map((line, i) => (
                <p
                  key={i}
                  style={{
                    margin: 0,
                    color: "var(--muted)",
                    fontSize: "clamp(1rem, 2.6vw, 1.12rem)",
                    lineHeight: 1.65
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
            <div
              role="group"
              aria-label="Jump to slide"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.45rem",
                flexWrap: "wrap",
                marginTop: "0.5rem"
              }}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${slides[i].headline}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                  style={{
                    width: i === index ? 22 : 8,
                    height: 8,
                    padding: 0,
                    border: "none",
                    borderRadius: 999,
                    background: i === index ? "var(--text)" : "var(--line-strong)",
                    opacity: i === index ? 1 : 0.55,
                    cursor: "pointer",
                    transition: "width 0.2s ease, opacity 0.2s ease, background 0.2s ease"
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <p
          style={{
            margin: "0.65rem 0 0",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--muted)",
            textAlign: "center",
            opacity: 0.85
          }}
        >
          ← → Arrow keys · Click dots to jump
        </p>
      </div>

      <footer
        className="shell"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
          paddingBottom: "0.25rem"
        }}
      >
        <button className="btn" type="button" onClick={goPrev} disabled={index === 0}>
          Previous
        </button>
        <button
          className="btn"
          type="button"
          onClick={goNext}
          disabled={index === slides.length - 1}
        >
          Next
        </button>
      </footer>
    </main>
  );
}
