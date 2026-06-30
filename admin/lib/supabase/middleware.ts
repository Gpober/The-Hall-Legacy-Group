import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path === "/login" || path.startsWith("/auth");
  const isPublicAsset =
    path.startsWith("/_next") || path === "/favicon.ico" || path.startsWith("/api/public");

  // When the app is reverse-proxied (e.g. thehalllegacygrp.com/admin -> this
  // deployment), redirects must point back at the public host, not the raw
  // Vercel deployment URL. Vercel forwards the original host in x-forwarded-host.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();
    if (forwardedHost) url.host = forwardedHost;
    url.pathname = pathname;
    url.search = "";
    return NextResponse.redirect(url);
  };

  if (!user && !isAuthRoute && !isPublicAsset) {
    return redirectTo("/login");
  }

  if (user && isAuthRoute) {
    return redirectTo("/");
  }

  return supabaseResponse;
}
