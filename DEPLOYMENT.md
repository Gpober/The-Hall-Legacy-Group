# Deploying Hall Legacy Group

This repository is **one Next.js app** that serves both:

- **`/`** — the marketing website
- **`/admin`** — the CRM backend (auth-protected)

So there is a **single Vercel project** and a single deployment. The Supabase
database is already provisioned and configured.

## Vercel settings (existing project from this repo)

In the Vercel project linked to `Gpober/The-Hall-Legacy-Group`:

1. **Settings → Build & Development → Framework Preset → `Next.js`.**
   (The repo used to be plain static HTML; this switch tells Vercel to build
   the Next.js app.)
2. **Root Directory** → repository root (leave blank / default).
3. **Environment Variables** (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://wgvlgzvfldncdogslvng.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_dn5B53WCi1B1jVrFKmLObQ_oiWprn9I` |

   These are public keys (safe in the browser). All data is protected by Row
   Level Security + an admin allowlist in Supabase.
4. **Redeploy.**

That's it:
- `https://thehalllegacygrp.com` → marketing site
- `https://thehalllegacygrp.com/admin` → CRM (redirects to `/admin/login`)

No second project, no rewrites, no extra DNS.

## Admin login

- Email: `Gpober@iamcfo.com`
- Set/rotate the password under **/admin → Settings → Change Password**.

Add more admins later by inserting them into the `admin_users` allowlist (see
README) after creating the user in the Supabase dashboard.

## Local development

```bash
cp .env.example .env.local   # fill in the two Supabase values
npm install
npm run dev                  # http://localhost:3000  (/ and /admin)
```

## Supabase hardening (one-time, in the dashboard)

- **Authentication → Providers → Email** → turn off "Allow new users to sign
  up" (the app has no public sign-up and the allowlist already blocks
  non-admins, but this closes the door entirely).
- **Authentication → Password** → enable **Leaked password protection**.
