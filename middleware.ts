import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only guard the admin backend; the marketing site at "/" stays public.
  matcher: ["/admin/:path*"],
};
