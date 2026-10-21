import type { Dietary } from "@/lib/content";

/**
 * The single consistent dietary badge set — minimal line icons in the brand
 * palette (replaces the raster reference badges, same meaning and labels).
 */

const LABELS: Record<Dietary, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  "gluten-free": "Gluten-Free",
  "contains-nuts": "Contains Nuts",
};

function Icon({ kind }: { kind: Dietary }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "vegan":
      // single leaf with midrib
      return (
        <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" aria-hidden>
          <path {...common} d="M12.8 3.2C8 3.4 4.6 5.6 4.2 9.6c-.2 1.9.8 3.2 2.5 3.2 3.9 0 6-3.9 6.1-9.6Z" />
          <path {...common} d="M4.6 12.9c1.9-3.3 4.3-5.6 6.9-7.3" />
        </svg>
      );
    case "vegetarian":
      // sprout — two leaves on a stem
      return (
        <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" aria-hidden>
          <path {...common} d="M8 13.5V8.2" />
          <path {...common} d="M8 8.2C8 5.7 6.4 4.1 3.6 4c0 2.7 1.6 4.3 4.4 4.2Z" />
          <path {...common} d="M8 7.2c0-2 1.3-3.3 3.6-3.4 0 2.2-1.3 3.5-3.6 3.4Z" />
        </svg>
      );
    case "gluten-free":
      // wheat stalk, struck through
      return (
        <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" aria-hidden>
          <path {...common} d="M8 13.8V4.4" />
          <path {...common} d="M8 6.6C6.6 6.6 5.7 5.8 5.6 4.3 7 4.3 7.9 5.1 8 6.6Zm0 0c1.4 0 2.3-.8 2.4-2.3-1.4 0-2.3.8-2.4 2.3ZM8 9.4C6.6 9.4 5.7 8.6 5.6 7.1 7 7.1 7.9 7.9 8 9.4Zm0 0c1.4 0 2.3-.8 2.4-2.3-1.4 0-2.3.8-2.4 2.3Z" />
          <path {...common} d="M3.4 12.6 12.6 3.4" />
        </svg>
      );
    case "contains-nuts":
      // hazelnut outline
      return (
        <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" aria-hidden>
          <path {...common} d="M8 13.6c2.6 0 4.3-1.7 4.3-4.1 0-2.2-1.7-4.4-4.3-6-2.6 1.6-4.3 3.8-4.3 6 0 2.4 1.7 4.1 4.3 4.1Z" />
          <path {...common} d="M4 6.9c2.6 1 5.4 1 8 0" />
        </svg>
      );
  }
}

export default function DietaryBadge({
  kind,
  withLabel = false,
}: {
  kind: Dietary;
  withLabel?: boolean;
}) {
  const label = LABELS[kind];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-olive"
      title={withLabel ? undefined : label}
    >
      <Icon kind={kind} />
      {withLabel ? (
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-charcoal-60">
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
