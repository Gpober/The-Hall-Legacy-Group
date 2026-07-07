import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth (Google) redirect lands here. Exchange the code for a session,
// stash the Google refresh token for Calendar sync, then enter the CRM.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const refreshToken = data.session?.provider_refresh_token;
      const user = data.session?.user;
      if (refreshToken && user) {
        // Persist the refresh token so we can mint Calendar access tokens later.
        await supabase.from("google_tokens").upsert(
          {
            user_id: user.id,
            email: user.email,
            refresh_token: refreshToken,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Google sign-in failed. Make sure your account is authorized.")}`
  );
}
