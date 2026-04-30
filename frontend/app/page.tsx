import Link from "next/link";

export default function HomePage() {
  return (
    <main
      className="viewport"
      style={{ display: "grid", placeItems: "center", padding: "1rem" }}
    >
      <section
        className="card"
        style={{
          width: "min(640px, 100%)",
          padding: "2rem",
          textAlign: "center",
          display: "grid",
          gap: "1.25rem"
        }}
      >
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>
            Sterile Demo Site
          </h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Choose where to continue.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))"
          }}
        >
          <Link className="btn" href="/begin">
            Begin
          </Link>
          <Link className="btn" href="/pitch-deck">
            Pitch Deck
          </Link>
        </div>
      </section>
    </main>
  );
}
