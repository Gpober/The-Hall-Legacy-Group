// Shared helpers for the public-site password gate.
// Works in both the Edge middleware and Node server actions (Web Crypto).

export const GATE_COOKIE = "hlg_gate";

// A non-reversible token derived from the site password. We store this in the
// cookie (never the raw password) and compare it in middleware.
export async function gateToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`hlg-gate:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
