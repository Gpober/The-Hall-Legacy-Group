# Hall Legacy Group

One **Next.js (App Router)** app that serves both the public marketing website
and the internal CRM, backed by **Supabase** (Postgres, Auth, Storage) and
styled with Tailwind in the Hall Legacy green/gold brand.

- **`/`** — marketing website (insurance restoration landing page)
- **`/admin`** — CRM backend (auth-protected)

Deployed as a single Vercel project: `thehalllegacygrp.com` and
`thehalllegacygrp.com/admin`.

## CRM features

- **Auth** — email/password login, middleware-protected `/admin`, admin allowlist.
- **Leads** — inbound inspection requests (captured from the public site form),
  status pipeline, notes/activity, convert-to-customer.
- **Customers** — profiles with contact, insurance, and address details.
- **Jobs** — restoration projects with a visual stage tracker, claim/adjuster
  info, values, and document uploads (Supabase Storage).
- **Calendar** — inspections, walkthroughs, and meetings.
- **Reports** — lead funnel, conversion rate, pipeline value, sources.
- **Settings** — change your own password in-app.

## How leads arrive

The marketing page's "Request a Free Inspection" form calls the `submitLead`
server action, which inserts into the `leads` table. Row Level Security lets
anonymous visitors **insert** website leads only — they cannot read, update, or
delete anything. New leads appear instantly in the CRM at `/admin/leads`.

## Project layout

```
app/
  layout.tsx            root layout (loads globals.css + site.css)
  page.tsx              marketing homepage (renders <Landing/>)
  site.css             marketing styles, scoped under .hlg-site
  actions.ts           submitLead server action (public form)
  admin/
    layout.tsx         noindex metadata for the whole backend
    login/             sign-in page + auth actions
    (dashboard)/       protected CRM pages (dashboard, leads, customers,
                       jobs, calendar, reports, settings)
components/
  landing.tsx          marketing site (client component)
  sidebar, badges, forms, timelines, trackers, ...
lib/
  supabase/            server / browser / middleware clients
  constants.ts         statuses, stages, enums + labels
  types.ts             row types
  format.ts            formatting helpers
middleware.ts          guards /admin/* (session refresh + auth redirect)
```

## Adding more admins

Each admin must be a Supabase Auth user **and** be in the `admin_users`
allowlist:

```sql
insert into admin_users (user_id, email)
select id, email from auth.users where email = 'newperson@example.com';
```

See **DEPLOYMENT.md** for Vercel + Supabase setup.
