/**
 * The twine-bow motif from the wrapped cone — used exactly ONCE site-wide,
 * as the list bullet in the story section. Do not reuse elsewhere.
 */
export default function TwineKnot({ className = "h-4 w-5" }: { className?: string }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 22 16" className={className} aria-hidden>
      {/* left loop */}
      <path {...s} d="M10.5 8C8.6 5.4 5.7 4.4 3.9 5.8 2.2 7.1 2.6 9.6 4.6 10.4c2 .8 4.4-.4 5.9-2.4Z" />
      {/* right loop */}
      <path {...s} d="M11.5 8c1.9-2.6 4.8-3.6 6.6-2.2 1.7 1.3 1.3 3.8-.7 4.6-2 .8-4.4-.4-5.9-2.4Z" />
      {/* knot */}
      <path {...s} d="M9.8 6.9h2.4v2.2H9.8z" />
      {/* tails */}
      <path {...s} d="M10.4 9.1c-.8 1.7-2.3 3-4.1 3.6M11.8 9.1c.7 1.9 1 3.4.6 5" />
    </svg>
  );
}
