import HalalBadge from "@/components/ui/HalalBadge";

const ITEMS = [
  "Vegan Options",
  "Gluten-Free Options",
  "Fresh Daily",
  "Palm Desert, CA",
] as const;

/** Understated single-row trust strip that slides up as the hero releases. */
export default function TrustStrip() {
  return (
    <section
      aria-label="What we stand for"
      className="relative z-10 border-y border-tahini bg-garlic"
    >
      <ul className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-7 md:gap-x-16">
        <li className="flex items-center gap-3">
          <HalalBadge className="h-9 w-9" />
          <span className="eyebrow text-charcoal-60">100% Halal</span>
        </li>
        {ITEMS.map((label) => (
          <li key={label} className="eyebrow text-charcoal-60">
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
