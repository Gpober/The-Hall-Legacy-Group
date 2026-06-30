# Hall Legacy Group — CRM

Internal CRM and lead-management backend for Hall Legacy Group, intended to run
at **admin.thehalllegacygrp.com**.

Built with **Next.js (App Router)** + **Supabase** (Postgres, Auth, Storage),
styled with Tailwind in the Hall Legacy green/gold brand.

## Features

- **Auth** — email/password login, middleware-protected routes, admin allowlist.
- **Leads** — inbound inspection requests (auto-captured from the public website
  form), status pipeline, notes/activity, convert-to-customer.
- **Customers** — profiles with contact, insurance, and address details.
- **Jobs** — restoration projects with a visual stage tracker, claim/adjuster
  info, values, and document uploads (Supabase Storage).
- **Calendar** — inspections, walkthroughs, and meetings.
- **Reports** — lead funnel, conversion rate, pipeline value, sources.
- **Settings** — change your own password in-app.

## How leads arrive

The public marketing site (`/index.html` at the repo root) posts inspection
requests directly into the `leads` table via the Supabase REST API using the
public anon key. Row Level Security allows anonymous visitors to **insert**
website leads only — they cannot read, update, or delete anything.

## Project layout

```
admin/
  app/
    (dashboard)/        protected CRM pages (dashboard, leads, customers, jobs, calendar, reports, settings)
    login/              sign-in page + auth actions
    auth/signout/       sign-out route
  components/           UI: sidebar, badges, forms, timelines, trackers
  lib/
    supabase/           server / browser / middleware clients
    constants.ts        statuses, stages, enums + labels
    types.ts            row types
    format.ts           formatting helpers
  middleware.ts         session refresh + route protection
```

See **DEPLOYMENT.md** for deploy + domain setup.
