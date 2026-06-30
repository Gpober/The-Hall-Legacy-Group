# Deploying the Hall Legacy CRM to `admin.thehalllegacygrp.com`

The CRM is a Next.js app living in the **`admin/`** folder of this repo. The
database (Supabase) is already provisioned and configured — you only need to
deploy the front end to Vercel and point the subdomain at it.

## 1. Import the project into Vercel

1. Go to <https://vercel.com/new> (use the **I am CFO** team).
2. Import the GitHub repo **`Gpober/The-Hall-Legacy-Group`**.
3. In the import screen, set:
   - **Root Directory** → `admin`  ← important (the app is in a subfolder)
   - **Framework Preset** → Next.js (auto-detected)
   - Build/Output settings → leave defaults.

## 2. Add environment variables

Add these two variables (Production, Preview, and Development):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wgvlgzvfldncdogslvng.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_dn5B53WCi1B1jVrFKmLObQ_oiWprn9I` |
| `NEXT_PUBLIC_BASE_PATH` | `/admin`  ← only while serving from `thehalllegacygrp.com/admin` |

These are public keys (safe in the browser). All data access is protected by
Row Level Security + an admin allowlist in Supabase.

Click **Deploy**. You'll get a `*.vercel.app` URL. With `NEXT_PUBLIC_BASE_PATH=/admin`
the app lives at `…vercel.app/admin` (the bare root will 404 — that's expected).

## 2b. Serve it at `thehalllegacygrp.com/admin` (no new DNS)

Because the main site is already on Vercel, you can expose the CRM under a path
on the existing domain with a rewrite — no DNS change needed today.

In the **main site's** Vercel project, add a `vercel.json` (or merge into the
existing one) that proxies `/admin` to this CRM deployment:

```json
{
  "rewrites": [
    { "source": "/admin", "destination": "https://YOUR-CRM.vercel.app/admin" },
    { "source": "/admin/:path*", "destination": "https://YOUR-CRM.vercel.app/admin/:path*" }
  ]
}
```

Replace `YOUR-CRM` with this project's actual Vercel URL. Redeploy the main
site. The CRM is then reachable at `https://thehalllegacygrp.com/admin`.

### Moving to the `admin.` subdomain later (one flip, no refactor)

1. Remove the `NEXT_PUBLIC_BASE_PATH` env var from this project and redeploy
   (app now serves at root).
2. Remove the `/admin` rewrite from the main site project.
3. Follow step 3 below to attach `admin.thehalllegacygrp.com`.

## 3. Attach the custom domain

1. In the Vercel project → **Settings → Domains**, add
   `admin.thehalllegacygrp.com`.
2. Vercel shows a DNS record to create. At the registrar/DNS host for
   `thehalllegacygrp.com`, add:

   ```
   Type:  CNAME
   Name:  admin
   Value: cname.vercel-dns.com
   ```

   (If your DNS is already on Vercel, it adds the record automatically.)
3. Wait for DNS to propagate; Vercel issues the SSL certificate automatically.

## 4. Recommended Supabase hardening (one-time, in the dashboard)

- **Authentication → Providers → Email** → turn **off** "Allow new users to
  sign up". The app has no public sign-up, and the database already blocks
  non-allowlisted accounts, but this closes the door entirely.
- **Authentication → Policies / Password** → enable **Leaked password
  protection** (HaveIBeenPwned check).
- (Optional) **Authentication → URL Configuration** → set the Site URL to
  `https://admin.thehalllegacygrp.com` so any future password-reset emails link
  correctly.

## Adding more admins later

Each new admin must (a) be a user in Supabase Auth and (b) be in the
`admin_users` allowlist table. Quickest path:

```sql
-- after creating/inviting the auth user in the Supabase dashboard:
insert into admin_users (user_id, email)
select id, email from auth.users where email = 'newperson@example.com';
```

## Local development

```bash
cd admin
cp .env.example .env.local   # fill in the two values from step 2
npm install
npm run dev                  # http://localhost:3000
```
