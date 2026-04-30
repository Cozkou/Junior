/**
 * Strips optional markdown code fences and parses JSON from model output.
 */
export function parseJsonFromModelOutput(raw: string): unknown {
  let t = raw.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  }
  return JSON.parse(t) as unknown;
}
