/**
 * Hand-drawn-style irregular hairline — the site's section divider.
 * Echoes the logo's line-illustration style. Never use border-top instead.
 */
export default function Divider({
  className = "",
  tone = "olive",
}: {
  className?: string;
  tone?: "olive" | "tahini" | "sage";
}) {
  const colors = {
    olive: "var(--color-olive)",
    tahini: "var(--color-tahini)",
    sage: "var(--color-sage)",
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 14"
      preserveAspectRatio="none"
      className={`block h-[10px] w-full ${className}`}
    >
      <path
        d="M0 8 C 60 6.4, 118 9.1, 180 7.6 S 300 5.8, 362 7.9 S 480 9.4, 545 7.2 S 660 5.6, 724 8.1 S 840 9.6, 905 7.0 S 1020 5.9, 1082 8.3 S 1160 8.9, 1200 7.4"
        fill="none"
        stroke={colors[tone]}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
      />
    </svg>
  );
}
