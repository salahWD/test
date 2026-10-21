import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "light" | "outline";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  /** Hide the trailing arrow glyph. */
  noArrow?: boolean;
}

const base =
  "group inline-flex items-center gap-3 rounded-full px-8 py-[15px] " +
  "font-semibold text-[13px] uppercase tracking-[0.1em] " +
  "transition-[background-color,box-shadow,color] duration-250 ease-brand";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-cream hover:bg-forest-deep " +
    "hover:shadow-[inset_0_0_0_1px_var(--color-gold)]",
  light:
    "bg-cream text-forest hover:bg-garlic " +
    "hover:shadow-[inset_0_0_0_1px_var(--color-gold)]",
  outline:
    "bg-transparent text-forest shadow-[inset_0_0_0_1px_var(--color-forest)] " +
    "hover:bg-forest hover:text-cream hover:shadow-[inset_0_0_0_1px_var(--color-gold)]",
};

function Arrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
    >
      →
    </span>
  );
}

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  noArrow = false,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cls}>
        {children}
        {!noArrow && <Arrow />}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {!noArrow && <Arrow />}
    </Link>
  );
}
