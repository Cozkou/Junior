"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { syneFont } from "@/lib/fonts";
import { HalkinSkyscraper } from "@/components/HalkinSkyscraper";
import { HallwayView, type HallwayPhase, type OfficeNum } from "@/components/HallwayView";
import { OfficeView, type OfficePhase, type PersonNum } from "@/components/OfficeView";

type Mode = "begin" | "pitch";

type Phase =
  | "idle"
  | "towerZoom"
  | "hallway"
  | "enterOffice"
  | "office"
  | "personZoom"
  | "exit";

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function HomeExperience() {
  const router = useRouter();
  const lock = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("begin");
  const [selectedOffice, setSelectedOffice] = useState<OfficeNum>(1);
  const [selectedPerson, setSelectedPerson] = useState<PersonNum>(1);
  const [hallwayPhase, setHallwayPhase] = useState<HallwayPhase>("idle");
  const [officePhase, setOfficePhase] = useState<OfficePhase>("idle");

  useEffect(() => {
    router.prefetch("/begin");
    router.prefetch("/pitch-deck");
  }, [router]);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const enter = useCallback(
    async (m: Mode) => {
      if (lock.current) return;
      lock.current = true;
      setMode(m);

      if (reducedMotion) {
        router.push(m === "begin" ? "/begin" : "/pitch-deck");
        return;
      }

      setPhase("towerZoom");

      if (m === "pitch") {
        await wait(420);
        setPhase("exit");
        await wait(240);
        router.push("/pitch-deck");
        return;
      }

      // Begin: let the tower scale visibly first, then crossfade into the hallway
      await wait(220);
      setHallwayPhase("in");
      await wait(280);
      setPhase("hallway");
      // Awaiting user click on a door
    },
    [reducedMotion, router]
  );

  const onSelectDoor = useCallback(
    async (n: OfficeNum) => {
      if (phase !== "hallway") return;
      setSelectedOffice(n);
      setPhase("enterOffice");
      setHallwayPhase("approach");
      await wait(360);
      setHallwayPhase("open");
      await wait(560);
      setOfficePhase("in");
      setPhase("office");
      // Hallway can drop out now (covered by office)
      await wait(80);
      setHallwayPhase("idle");
    },
    [phase]
  );

  const onPickPerson = useCallback(
    async (p: PersonNum) => {
      if (phase !== "office") return;
      setSelectedPerson(p);
      setPhase("personZoom");
      setOfficePhase("pick");
      await wait(380);
      setOfficePhase("exit");
      setPhase("exit");
      await wait(240);
      router.push("/begin");
    },
    [phase, router]
  );

  const exitHallway = useCallback(() => {
    // user backed out before picking a door
    setHallwayPhase("idle");
    setPhase("idle");
    lock.current = false;
  }, []);

  const exitOffice = useCallback(() => {
    // user backed out of an office
    setOfficePhase("idle");
    setPhase("hallway");
    setHallwayPhase("in");
  }, []);

  const busy = phase !== "idle";
  const showFlash = phase === "exit";

  // Tower transform — both modes use this; origin differs.
  // Opacity is kept at 1; the hallway view (begin) or the white flash (pitch)
  // covers the tower as it reaches max scale, so there's no visible cut.
  const towerStyle = (): CSSProperties => {
    if (phase === "idle") {
      return {
        transform: "scale(1)",
        opacity: 1,
        transformOrigin: "50% 50%",
        transition: "transform 0.42s cubic-bezier(0.5, 0, 0.32, 1)"
      };
    }
    const origin = mode === "pitch" ? "50% 92%" : "50% 44%";
    return {
      transform: "scale(8)",
      opacity: 1,
      transformOrigin: origin,
      transition: "transform 0.5s cubic-bezier(0.5, 0, 0.32, 1)"
    };
  };

  return (
    <>
      {/* Final white veil */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[260] bg-white transition-opacity duration-[260ms]",
          showFlash ? "opacity-100" : "opacity-0"
        )}
        aria-hidden
      />

      {/* Hallway (begin only) */}
      <HallwayView
        phase={hallwayPhase}
        selected={selectedOffice}
        onSelect={onSelectDoor}
        onExit={exitHallway}
      />

      {/* Office (begin only) */}
      <OfficeView
        phase={officePhase}
        officeNum={selectedOffice}
        selected={selectedPerson}
        onPick={onPickPerson}
        onExit={exitOffice}
      />

      {/* Home shell — stays visible during towerZoom so the user actually sees the
          building scale up; hides afterward when the next view takes over */}
      <main
        className={cn(
          "viewport-lock home-grid bg-cross-subtle text-zinc-900",
          phase === "towerZoom" && "is-zooming",
          phase !== "idle" && phase !== "towerZoom" && "is-gone"
        )}
        aria-hidden={busy}
      >
        {/* HUD chrome */}
        <div className="hud-chrome pointer-events-none">
          <div className="hud-tick hud-tl" />
          <div className="hud-tick hud-tr" />
          <div className="hud-tick hud-bl" />
          <div className="hud-tick hud-br" />
          <div className="hud-bar hud-bar-top">
            <span>JUNIOR / OS · v0.9.4</span>
            <span className="hud-bar-dot" />
            <span>HALKIN BUILDING ▸ LOBBY</span>
            <span className="hud-bar-dot" />
            <span>PROTOTYPE</span>
          </div>
          <div className="hud-bar hud-bar-bot">
            <span>LAT 51.5135 · LON -0.0902</span>
            <span className="hud-bar-dot" />
            <span>FLOOR 13 · 5 SUITES</span>
            <span className="hud-bar-dot" />
            <span>SCAN OK</span>
          </div>
        </div>

        <div className="home-inner">
          <section className="home-copy">
            <p className="home-eyebrow">
              <span className="home-eyebrow-dot" /> AGENT INGRESS
            </p>

            <div className="home-title-wrap">
              <h1
                className={`${syneFont.className} home-title`}
                style={{ fontWeight: 800 }}
              >
                JUNIOR
              </h1>
              <span className="home-strike" aria-hidden />
            </div>

            <div className="home-meta">
              <span>JUNIOR/OS</span>
              <span className="home-meta-dot" />
              <span>HALKIN BUILDING</span>
              <span className="home-meta-dot" />
              <span>L13 · SUITE GRID</span>
            </div>

            <div className="home-desc">
              <p>
                The original surface is deprecated. Junior was a working title for an
                institutional mailroom that never learned to stay quiet — we are crossing it
                out on purpose.
              </p>
              <p>
                Beyond this lobby is a sterile shell on Floor 13: five suites, fifteen
                analysts. Pick a door, pick a person — their inbox opens for you.
              </p>
            </div>

            <nav className="home-actions" aria-label="Primary">
              <button
                type="button"
                disabled={busy}
                onClick={() => void enter("begin")}
                className="home-cta home-cta-ghost"
              >
                <span className="home-cta-tag">B1</span>
                <span className="home-cta-label">Begin</span>
                <span className="home-cta-sub">Hallway · 5 suites</span>
                <span className="home-cta-arrow" aria-hidden>→</span>
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void enter("pitch")}
                className="home-cta home-cta-primary"
              >
                <span className="home-cta-tag">B2</span>
                <span className="home-cta-label">Pitch deck</span>
                <span className="home-cta-sub">Lobby · direct</span>
                <span className="home-cta-arrow" aria-hidden>→</span>
              </button>
            </nav>
          </section>

          <section className="home-tower-wrap" aria-label="HALKIN tower">
            <div className="home-tower" style={towerStyle()}>
              <HalkinSkyscraper className="home-tower-svg" />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
