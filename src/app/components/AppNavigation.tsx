"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/statistics", label: "Statistics" },
  { href: "/tracker", label: "Tracker" },
  { href: "/missing", label: "Missing" },
  { href: "/missing-2d", label: "Missing 2D" },
  { href: "/model-ranking", label: "Ranking" },
  { href: "/admin", label: "Admin" },
];

export default function AppNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
  <img
    src="/logo.png"
    alt="Lao Lottery Analyzer"
    className="h-full w-full scale-[1.8] object-contain"
  />
</div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black leading-tight text-slate-950 sm:text-base">
                Lao Lottery Analyzer
              </p>
              <p className="truncate text-xs font-medium leading-tight text-slate-500">
                Advanced Analytics Dashboard
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                      : "rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-black text-slate-950 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 lg:hidden"
            aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? "×" : "☰"}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-xl lg:hidden">
            <div className="border-b border-slate-200 px-2 pb-3">
              <p className="text-sm font-black text-slate-950">
                Navigation
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                เลือกหน้าที่ต้องการดูข้อมูล
              </p>
            </div>

            <div className="mt-3 grid gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={
                      active
                        ? "flex min-h-12 items-center rounded-2xl bg-slate-950 px-4 py-3 text-base font-bold text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                        : "flex min-h-12 items-center rounded-2xl px-4 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-200"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}