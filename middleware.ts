import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Hosts
function classifyHost(host: string) {
  const h = host.toLowerCase().split(":")[0];
  const isAdmin = h.startsWith("admin.");
  const isApex = h === "thehalllegacygrp.com" || h === "www.thehalllegacygrp.com";
  return { isAdmin, isApex, apexRoot: h.replace(/^www\./, "") };
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { isAdmin, isApex, apexRoot } = classifyHost(host);
  const path = request.nextUrl.pathname;

  // ---- Marketing (apex domain) ----
  // The public site is open to everyone; there is no password gate.
  if (isApex) {
    // Serve the marketing page (app/site) at the root.
    if (path === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/site";
      return NextResponse.rewrite(url);
    }
    // Marketing-owned paths pass through; everything else is CRM -> subdomain.
    if (
      path === "/site" ||
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
