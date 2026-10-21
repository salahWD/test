import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/cms/auth";
import { loadContent, overlayStatus } from "@/lib/cms/store";

const CARDS = [
  {
    href: "/admin/site",
    title: "Business info",
    blurb: "Phone, email, hours, ordering link, and social profiles.",
  },
  {
    href: "/admin/home",
    title: "Home page",
    blurb: "The hero lines, the mouneh corner, and the order call-out.",
  },
  {
    href: "/admin/menu",
    title: "Menu",
    blurb: "Items, prices, descriptions, dietary badges, and house favorites.",
  },
  {
    href: "/admin/catering",
    title: "Catering",
    blurb: "Trays and platters for ten, prices, and the 48-hour notice line.",
  },
  {
    href: "/admin/testimonials",
    title: "Reviews",
    blurb: "The customer quotes rotating on the homepage.",
  },
  {
    href: "/admin/faq",
    title: "FAQ",
    blurb: "Questions and answers on the Visit Us page.",
  },
] as const;

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const content = await loadContent();
  const status = await overlayStatus();

  return (
    <div>
      <h1 className="font-display text-[2.4rem] font-medium text-charcoal">
        Content editor
      </h1>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-charcoal-60">
        Changes go live on the site as soon as you save — no rebuild needed.{" "}
        {status.savedAt
          ? `Last saved ${new Date(status.savedAt).toLocaleString("en-US")}.`
          : "No edits saved yet — the site is running on its built-in content."}
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group border border-tahini bg-garlic p-7 transition-colors duration-250 hover:border-olive"
          >
            <h2 className="font-display text-[1.5rem] font-medium text-charcoal">
              {c.title}
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal-60">
              {c.blurb}
            </p>
            <span className="mt-4 inline-block text-[12px] font-semibold uppercase tracking-[0.1em] text-forest">
              Edit{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-5 border-t border-tahini pt-8 sm:grid-cols-4">
        {[
          ["Menu items", content.menu.length],
          ["Catering trays", content.catering.reduce((n, s) => n + s.items.length, 0)],
          ["Reviews", content.testimonials.length],
          ["FAQ entries", content.faq.length],
        ].map(([label, n]) => (
          <div key={label}>
            <dt className="eyebrow text-charcoal-60">{label}</dt>
            <dd className="mt-1 font-display text-[1.9rem] font-medium text-charcoal">
              {n}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
