import Anthropic from "@anthropic-ai/sdk";
import type { ActionType, DealAnalysis } from "@/types/deal";

const MODEL = "claude-sonnet-4-20250514";

const BASE_FUND_CONTEXT = `You write for a UK private credit fund focused on senior secured loans £3m–£15m,
max 70% LTV, UK assets only, tilt to logistics/industrial/mixed-use.
Voice: precise, institutional, short sentences, no fluff.`;

function buildUserPrompt(
  actionType: ActionType,
  deal: DealAnalysis,
  emailBody: string
): string {
  const dealJson = JSON.stringify(deal, null, 2);
  switch (actionType) {
    case "memo":
      return `${BASE_FUND_CONTEXT}

Draft an Investment Committee memo of approximately 400 words.
Structure: Investment summary, Borrower & Sponsor, Structure & Terms, Covenant & Security briefly, Key risks mitigants, Mandate alignment, Recommendation.

Deal analysis (Junior):
${dealJson}

Source email text:
"""
${emailBody}
"""

Output the memo body only — no preamble.`;

    case "reply":
      return `${BASE_FUND_CONTEXT}

Draft a concise, professional reply to the broker acknowledging receipt and asking 5–8 sharp diligence questions tailored to gaps and mandate fit implied by this deal.

Deal analysis:
${dealJson}

Email thread body:
"""
${emailBody}
"""

Output the reply body only — suitable to paste into email.`;

    case "skip":
      return `${BASE_FUND_CONTEXT}

The fund is passing / skipping this opportunity. Produce a short internal rationale (bullet style or 2 compact paragraphs): why we pass relative to mandate, and optionally one sentence suitable for polite broker decline tone (professional, no bridge-burning).

Deal analysis:
${dealJson}

Source email:
"""
${emailBody}
"""

Output rationale only.`;
    default:
      return "";
  }
}

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return new Response("Server misconfiguration: missing ANTHROPIC_API_KEY", { status: 500 });
  }

  let payload: {
    actionType?: ActionType;
    dealData?: DealAnalysis;
    emailBody?: string;
  };

  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { actionType, dealData, emailBody } = payload;
  const actions: ActionType[] = ["memo", "reply", "skip"];

  if (!actionType || !actions.includes(actionType)) {
    return new Response("Invalid actionType", { status: 400 });
  }
  if (
    typeof dealData !== "object" ||
    dealData === null ||
    typeof emailBody !== "string" ||
    !emailBody.trim()
  ) {
    return new Response("Invalid dealData or emailBody", { status: 400 });
  }

  const client = new Anthropic({ apiKey: key });
  const userContent = buildUserPrompt(actionType, dealData as DealAnalysis, emailBody);

  const msgStream = client.messages.stream({
    model: MODEL,
    max_tokens: actionType === "memo" ? 3500 : 1200,
    temperature: actionType === "memo" ? 0.35 : 0.5,
    messages: [{ role: "user", content: userContent }]
  });

  const encoder = new TextEncoder();

  const streamOut = new ReadableStream({
    async start(controller) {
      msgStream.on("text", (delta: string) => {
        controller.enqueue(encoder.encode(delta));
      });

      try {
        await msgStream.finalText();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\n\n[Generation interrupted: ${msg}]`));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(streamOut, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
