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
        // Tower zooms into the lobby entrance over 700 ms, then flash + navigate
        await wait(680);
        setPhase("exit");
        await wait(260);
        router.push("/pitch-deck");
        return;
      }

      // Begin: deep tower zoom overlaps with the corridor entering animation.
      // 1) Tower begins scaling (ease-in, large scale, 720 ms total).
      // 2) At 320 ms the corridor snaps to "entering" (scale 1.55, opacity 0) — no transition.
      // 3) 55 ms later we flip to "in" → corridor decelerates from 1.55→1 while fading in.
      // 4) After the corridor settles (~600 ms), we make the hallway interactive.
      await wait(320);
      setHallwayPhase("entering");
      await wait(55);
      setHallwayPhase("in");
      await wait(580);
      setPhase("hallway");
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

  // Tower transform — origin targets a convincing depth point inside the building.
  // "begin" zooms toward the mid-facade (floors 8-12 area) so the hallway corridor
  // feels like it lives behind those windows.
  // "pitch" zooms into the lobby entrance at the base.
  const towerStyle = (): CSSProperties => {
    if (phase === "idle") {
      return {
        transform: "scale(1)",
        opacity: 1,
        transformOrigin: "50% 50%",
        transition: "transform 0.4s cubic-bezier(0.5, 0, 0.32, 1)"
      };
    }
    const origin = mode === "pitch" ? "50% 93%" : "50% 48%";
    return {
      // scale(22) fills the screen with building texture — the corridor
      // fades in at scale(1.55) before the zoom finishes, creating the overlap.
      transform: "scale(22)",
      opacity: 1,
      transformOrigin: origin,
      // Ease-in acceleration: starts gentle, rushes in at the end
      transition: "transform 0.72s cubic-bezier(0.42, 0, 1, 1)"
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

      {/* Home shell */}
      <main
        className={cn(
          "viewport-lock home-grid bg-cross-subtle text-zinc-900",
          phase === "towerZoom" && "is-zooming",
          phase !== "idle" && phase !== "towerZoom" && "is-gone"
        )}
        aria-hidden={busy}
      >
        <div className="home-inner">
          <section className="home-copy">

            <div className="home-title-wrap">
              <h1
                className={`${syneFont.className} home-title`}
                style={{ fontWeight: 800 }}
              >
                JUNIOR
              </h1>
              {/* Graffiti spray-paint strike-through */}
              <svg
                className="home-graffiti"
                viewBox="0 0 320 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Wide diffuse halo — simulates the mist edge of spray paint */}
                  <filter id="gr-halo" x="-12%" y="-250%" width="124%" height="600%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                  {/* Soft mid-range blur for the body of the spray */}
                  <filter id="gr-mid" x="-6%" y="-120%" width="112%" height="340%">
                    <feGaussianBlur stdDeviation="2.8" />
                  </filter>
                </defs>

                {/* Outermost halo — very faint, wide */}
                <path
                  d="M2 29 C18 22, 50 37, 88 27 C124 17, 160 34, 198 25 C230 16, 266 31, 298 21 C310 17, 320 22, 326 19"
                  stroke="#ef4444"
                  strokeWidth="34"
                  strokeLinecap="round"
                  opacity="0.07"
                  filter="url(#gr-halo)"
                />
                {/* Mid spray body */}
                <path
                  d="M2 29 C20 23, 52 38, 88 27 C124 17, 160 34, 198 25 C230 16, 265 31, 297 21 C309 18, 319 23, 325 20"
                  stroke="#ef4444"
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity="0.22"
                  filter="url(#gr-mid)"
                />
                {/* Core paint band — dense, slightly textured */}
                <path
                  d="M2 29 C22 23, 52 39, 88 28 C124 17, 160 35, 198 25 C230 16, 266 32, 296 22 C308 19, 318 24, 324 21"
                  stroke="#ef4444"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.9"
                />
                {/* Thin sharp centre-line (densest paint deposit) */}
                <path
                  d="M2 29 C22 24, 52 39, 88 28 C124 17, 160 35, 198 25 C230 16, 266 32, 296 22 C308 19, 318 24, 324 21"
                  stroke="#dc2626"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                {/* Upper overspray wisp */}
                <path
                  d="M4 23 C22 17, 52 31, 88 21 C124 11, 160 28, 196 18 C228 9, 264 25, 296 15"
                  stroke="#f87171"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.28"
                  filter="url(#gr-mid)"
                />
                {/* Lower drip / run of paint */}
                <path
                  d="M3 36 C24 30, 54 44, 90 34 C126 24, 162 40, 200 31 C232 22, 268 38, 298 28"
                  stroke="#b91c1c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.48"
                />
                {/* Secondary thin drip below */}
                <path
                  d="M4 40 C26 34, 56 47, 92 37 C128 27, 164 43, 202 33 C234 24, 270 40, 300 30"
                  stroke="#dc2626"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.2"
                />
              </svg>
            </div>

            <p className="home-tagline">
              AI deal-flow inbox for private credit funds.
            </p>

            <div className="home-desc">
              <p>
                Junior reads broker submissions, extracts deal terms, scores mandate
                fit, flags risk, and drafts replies — so your team spends time on
                decisions, not admin.
              </p>
            </div>

            <nav className="home-actions" aria-label="Primary navigation">
              <button
                type="button"
                disabled={busy}
                onClick={() => void enter("begin")}
                className="home-btn home-btn-ghost"
              >
                Begin <span aria-hidden>→</span>
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void enter("pitch")}
                className="home-btn home-btn-dark"
              >
                Pitch deck <span aria-hidden>→</span>
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
