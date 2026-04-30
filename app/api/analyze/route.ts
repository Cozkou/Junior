import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { parseJsonFromModelOutput } from "@/lib/parse-json-from-model";
import type { DealAnalysis, RiskFlag } from "@/types/deal";

const MODEL = "claude-sonnet-4-20250514";

const ANALYZE_SYSTEM = `You are Junior, an AI analyst for a private credit fund.
The fund's mandate: senior secured loans, £3m-£15m, max 70% LTV,
UK only, preferred sectors logistics/industrial/mixed-use,
avoid pure residential and retail exposure where possible unless mitigated.
Extract all deal terms, check mandate fit, identify risk flags.
Also include patternObservations: an array of exactly 2-3 concise strings highlighting how this deal aligns or conflicts with repeatable patterns from mandate history (e.g. sponsor quality, leverage, sector concentration).
Return ONLY valid JSON (no prose, no markdown fences) matching this shape:
{
  "loanSize": string,
  "ltv": string,
  "sponsor": string,
  "sector": string,
  "exitStrategy": string,
  "term": string,
  "mandateFit": { "pass": boolean, "reason": string },
  "riskFlags": [{ "flag": string, "severity": "high"|"medium"|"low" }],
  "confidence": number,
  "summary": string,
  "patternObservations": string[]
}`;

function isRiskSeverity(s: unknown): s is RiskFlag["severity"] {
  return s === "high" || s === "medium" || s === "low";
}

function normalizeAnalysis(raw: unknown): DealAnalysis | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  const mf = o.mandateFit;
  if (typeof mf !== "object" || mf === null) return null;
  const mfRec = mf as Record<string, unknown>;
  const pass = mfRec.pass;
  const reason = mfRec.reason;
  if (typeof pass !== "boolean" || typeof reason !== "string") return null;

  const flagsUnknown = o.riskFlags;
  if (!Array.isArray(flagsUnknown)) return null;
  const riskFlags: RiskFlag[] = [];
  for (const f of flagsUnknown) {
    if (typeof f !== "object" || f === null) return null;
    const fr = f as Record<string, unknown>;
    if (typeof fr.flag !== "string" || !isRiskSeverity(fr.severity)) return null;
    riskFlags.push({ flag: fr.flag, severity: fr.severity });
  }

  const po = o.patternObservations;
  if (!Array.isArray(po) || po.length < 1) return null;
  const patternObservations: string[] = [];
  for (const p of po) {
    if (typeof p !== "string") return null;
    patternObservations.push(p);
  }

  const str = (k: string) => (typeof o[k] === "string" ? (o[k] as string) : null);
  const keys = ["loanSize", "ltv", "sponsor", "sector", "exitStrategy", "term", "summary"] as const;
  for (const k of keys) {
    if (str(k) === null) return null;
  }

  let confidence = Number(o.confidence);
  if (!Number.isFinite(confidence)) return null;
  confidence = Math.min(100, Math.max(0, Math.round(confidence)));

  return {
    loanSize: str("loanSize")!,
    ltv: str("ltv")!,
    sponsor: str("sponsor")!,
    sector: str("sector")!,
    exitStrategy: str("exitStrategy")!,
    term: str("term")!,
    mandateFit: { pass, reason },
    riskFlags,
    confidence,
    summary: str("summary")!,
    patternObservations: patternObservations.slice(0, 5)
  };
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Server misconfiguration: ANTHROPIC_API_KEY is not set." },
      { status: 500 }
    );
  }

  let emailBody: string;
  try {
    const json = (await req.json()) as { body?: unknown };
    if (typeof json.body !== "string" || !json.body.trim()) {
      return NextResponse.json({ error: "Invalid body: expected { body: string }" }, { status: 400 });
    }
    emailBody = json.body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: key });

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 2048,
      temperature: 0,
      system: ANALYZE_SYSTEM,
      messages: [{ role: "user", content: emailBody }]
    });

    const block = message.content.find((c) => c.type === "text");
    if (!block || block.type !== "text") {
      return NextResponse.json({ error: "No text in model response" }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = parseJsonFromModelOutput(block.text);
    } catch {
      return NextResponse.json({ error: "Model returned invalid JSON" }, { status: 502 });
    }

    const analysis = normalizeAnalysis(parsed);
    if (!analysis) {
      return NextResponse.json({ error: "Model JSON did not match expected schema" }, { status: 502 });
    }

    return NextResponse.json(analysis);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
