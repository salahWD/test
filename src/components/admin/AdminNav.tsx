"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/admin/site", label: "Business info" },
  { href: "/admin/home", label: "Home page" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/catering", label: "Catering" },
  { href: "/admin/testimonials", label: "Reviews" },
  { href: "/admin/faq", label: "FAQ" },
] as const;

/** Admin section links with the current page highlighted. Client component
    only for usePathname — the layout around it stays server-rendered. */
export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin sections" className="hidden gap-6 sm:flex">
      {SECTIONS.map((s) => {
        const active = pathname.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? "page" : undefined}
            className={[
              "text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-250",
              active
                ? "text-forest underline decoration-gold-ink decoration-2 underline-offset-8"
                : "text-charcoal-60 hover:text-forest",
            ].join(" ")}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
