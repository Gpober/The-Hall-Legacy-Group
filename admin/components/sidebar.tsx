"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "Dashboard", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
  { href: "/leads", label: "Leads", icon: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z" },
  { href: "/customers", label: "Customers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { href: "/jobs", label: "Jobs", icon: "M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" },
  { href: "/calendar", label: "Calendar", icon: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { href: "/reports", label: "Reports", icon: "M3 3v18h18M7 14l4-4 3 3 5-6" },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-brand-900 px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          className="rounded-md p-2 text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? "M6 6l12 12M18 6L6 18" : "M3 12h18M3 6h18M3 18h18"} />
          </svg>
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } w-full shrink-0 bg-brand-900 lg:block lg:w-64`}
      >
        <div className="hidden px-5 py-6 lg:block">
          <Logo />
        </div>
        <nav className="space-y-1 px-3 py-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive(item.href)
                  ? "bg-brand-700 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 px-5 py-4">
          <p className="truncate text-xs text-white/50">{email}</p>
          <form action="/auth/signout" method="post" className="mt-2">
            <button className="text-xs font-semibold text-gold-soft hover:text-gold-bright">
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
