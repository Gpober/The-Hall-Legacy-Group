import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

// Hosts
function classifyHost(host: string) {
  const h = host.toLowerCase().split(":")[0];
  const isAdmin = h.startsWith("admin.");
  const isApex = h === "thehalllegacygrp.com" || h === "www.thehalllegacygrp.com";
  return { isAdmin, isApex, apexRoot: h.replace(/^www\./, "") };
}

// Public-site password gate (marketing only). Enabled when SITE_PASSWORD is set.
async function gateBlocked(request: NextRequest): Promise<boolean> {
  const password = process.env.SITE_PASSWORD;
  if (!password) return false;
  const token = request.cookies.get(GATE_COOKIE)?.value;
  const expected = await gateToken(password);
  return token !== expected;
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { isAdmin, isApex, apexRoot } = classifyHost(host);
  const path = request.nextUrl.pathname;

  // ---- Marketing (apex domain) ----
  if (isApex) {
    // Public pages that stay reachable even when the site is password-gated
    // (legal pages must be crawlable for Google OAuth verification).
    const alwaysPublic =
      path === "/enter" ||
      path === "/privacy" ||
      path === "/terms" ||
      path === "/app" ||
      path.startsWith("/api");

    if (!alwaysPublic && (await gateBlocked(request))) {
      const url = request.nextUrl.clone();
      url.pathname = "/enter";
      url.search = "";
      return NextResponse.redirect(url);
    }

    // Serve the marketing page (app/site) at the root.
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/site";
      return NextResponse.rewrite(url);
    }
    // Marketing-owned paths pass through; everything else is CRM -> subdomain.
    if (
      path === "/site" ||
      path === "/enter" ||
      path === "/privacy" ||
      path === "/terms" ||
      path === "/app" ||
      path.startsWith("/api")
    ) {
      return NextResponse.next();
    }
    const dest = request.nextUrl.clone();
    dest.host = `admin.${apexRoot}`;
    return NextResponse.redirect(dest);
  }

  // ---- CRM (admin subdomain, localhost, and preview deployments) ----
  // If an OAuth code lands anywhere but the callback, forward it there.
  const sp = request.nextUrl.searchParams;
  if ((sp.has("code") || sp.has("error")) && !path.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return NextResponse.redirect(url);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
