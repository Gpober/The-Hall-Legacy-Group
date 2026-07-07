import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { GATE_COOKIE, gateToken } from "@/lib/gate";

// Optional public-site password gate. Enabled only when SITE_PASSWORD is set.
// Never gates /admin (own login), /enter (the gate itself), or OAuth returns.
async function siteGate(request: NextRequest): Promise<NextResponse | null> {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;

  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/admin") ||
    path.startsWith("/enter") ||
    path.startsWith("/api") ||
    request.nextUrl.searchParams.has("code") ||
    request.nextUrl.searchParams.has("error")
  ) {
    return null;
  }

  const token = request.cookies.get(GATE_COOKIE)?.value;
  const expected = await gateToken(password);
  if (token === expected) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/enter";
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const gate = await siteGate(request);
  if (gate) return gate;

  // Admin area keeps its own Supabase session handling + auth guard.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
