/**
 * Clean inline-SVG redraw of the Halal certification seal (crisp at any size),
 * harmonized to the brand's greens. Meaning and composition match the original:
 * scalloped seal, inner ring, Arabic حلال over "HALAL".
 */
export default function HalalBadge({
  className = "h-14 w-14",
  tone = "forest",
}: {
  className?: string;
  tone?: "forest" | "cream";
}) {
  const fill = tone === "forest" ? "var(--color-forest)" : "var(--color-cream)";
  const ink = tone === "forest" ? "var(--color-cream)" : "var(--color-forest)";

  // 28-point scalloped rosette
  const points = 28;
  const outer = 50;
  const inner = 46;
  let d = "";
  for (let i = 0; i <= points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const x = 50 + r * Math.cos(a) * 0.96;
    const y = 50 + r * Math.sin(a) * 0.96;
    d += i === 0 ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`;
  }
  d += "Z";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="100% Halal certified"
    >
      <path d={d} fill={fill} />
      <circle cx="50" cy="50" r="40" fill="none" stroke={ink} strokeWidth="1.6" />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fill={ink}
        style={{ fontSize: "26px", fontFamily: "'Segoe UI', 'Noto Naskh Arabic', serif" }}
      >
        {"حلال"}
      </text>
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fill={ink}
        style={{
          fontSize: "13px",
          fontFamily: "var(--font-body), sans-serif",
          fontWeight: 600,
          letterSpacing: "0.14em",
        }}
      >
        HALAL
      </text>
    </svg>
  );
}
