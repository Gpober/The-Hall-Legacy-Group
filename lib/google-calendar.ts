// Minimal Google Calendar helpers. Uses the admin's stored refresh token to
// mint a short-lived access token, then calls the Calendar REST API.
//
// Required env vars (set in Vercel) — the SAME OAuth client used for Google
// sign-in in Supabase:
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET

type EventInput = {
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: string; // ISO
  endsAt?: string | null; // ISO
};

export function googleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

async function getAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

export async function createCalendarEvent(
  refreshToken: string,
  ev: EventInput
): Promise<string | null> {
  const accessToken = await getAccessToken(refreshToken);
  if (!accessToken) return null;

  const end =
    ev.endsAt || new Date(new Date(ev.startsAt).getTime() + 60 * 60 * 1000).toISOString();

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: ev.title,
        description: ev.description || undefined,
        location: ev.location || undefined,
        start: { dateTime: new Date(ev.startsAt).toISOString() },
        end: { dateTime: new Date(end).toISOString() },
      }),
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { id?: string };
  return json.id ?? null;
}

export async function deleteCalendarEvent(
  refreshToken: string,
  eventId: string
): Promise<void> {
  const accessToken = await getAccessToken(refreshToken);
  if (!accessToken) return;
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
  );
}
