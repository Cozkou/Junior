import Link from "next/link";

const emails = [
  {
    from: "Founders Team",
    subject: "Weekly product check-in",
    preview: "Review metrics and blockers before tomorrow.",
    time: "08:41"
  },
  {
    from: "Design Ops",
    subject: "Re: Updated component tokens",
    preview: "Spacing values are now aligned with mobile breakpoints.",
    time: "09:15"
  },
  {
    from: "Investors",
    subject: "Meeting notes follow-up",
    preview: "Sharing action points from the call.",
    time: "10:05"
  },
  {
    from: "Legal",
    subject: "Draft agreement review",
    preview: "Please review sections 3 and 7 by EOD.",
    time: "11:52"
  },
  {
    from: "Growth",
    subject: "Acquisition campaign update",
    preview: "CTR increased by 16% after copy changes.",
    time: "13:20"
  }
];

export default function BeginPage() {
  return (
    <main className="viewport shell" style={{ display: "grid", paddingTop: "1rem" }}>
      <section
        className="card"
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          minHeight: "calc(100dvh - 2rem)",
          overflow: "hidden"
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
            borderBottom: "1px solid var(--line)"
          }}
        >
          <strong style={{ fontSize: "0.95rem" }}>Inbox</strong>
          <Link className="btn" href="/">
            Home
          </Link>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)",
            minHeight: 0
          }}
        >
          <aside
            style={{
              borderRight: "1px solid var(--line)",
              padding: "0.75rem",
              overflow: "auto"
            }}
          >
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {["Inbox", "Starred", "Sent", "Drafts", "Archive"].map((item) => (
                <button
                  className="btn"
                  key={item}
                  style={{
                    textAlign: "left",
                    fontWeight: item === "Inbox" ? 700 : 500,
                    background: item === "Inbox" ? "var(--accent)" : "var(--btn)"
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <section style={{ overflow: "auto" }}>
            {emails.map((email) => (
              <article
                key={`${email.from}-${email.time}`}
                style={{
                  padding: "0.9rem 1rem",
                  borderBottom: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: "0.5rem"
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{email.from}</p>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.95rem" }}>
                    {email.subject}
                  </p>
                  <p
                    style={{
                      margin: "0.3rem 0 0",
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {email.preview}
                  </p>
                </div>
                <small style={{ color: "var(--muted)" }}>{email.time}</small>
              </article>
            ))}
          </section>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          main > section > div {
            grid-template-columns: 1fr;
          }

          aside {
            border-right: 0 !important;
            border-bottom: 1px solid var(--line);
          }
        }
      `}</style>
    </main>
  );
}
