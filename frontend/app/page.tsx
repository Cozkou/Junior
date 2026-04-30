import Link from "next/link";
import { HomeHouse } from "../components/HomeHouse";

export default function HomePage() {
  return (
    <main className="viewport bg-cross-subtle">
      <div className="home-shell">
        <div className="home-split">
          <header>
            <p
              style={{
                margin: 0,
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--muted)"
              }}
            >
              Welcome
            </p>
            <h1 className="home-title">JUNIOR</h1>
            <p className="home-desc">Template desc for now.</p>
            <div className="home-divider" aria-hidden />
            <nav className="home-foot" aria-label="Secondary links">
              <Link className="link-quiet" href="/pitch-deck">
                Pitch deck
              </Link>
              <span className="home-foot-sep" aria-hidden />
              <Link className="link-quiet" href="/begin">
                Inbox preview
              </Link>
            </nav>
          </header>

          <section className="home-visual" aria-label="Featured">
            <div className="home-visual-inner">
              <HomeHouse className="home-house-svg" />
            </div>
            <Link className="btn-primary" href="/begin">
              Enter
            </Link>
            <p
              style={{
                margin: 0,
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--muted)",
                opacity: 0.85,
                fontWeight: 500
              }}
            >
              House · interaction coming soon
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
