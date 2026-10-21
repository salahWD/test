"use client";

import { useEffect, useState } from "react";
import { getSite } from "@/lib/content";
import { parseHM, minutesNowInTz, fmt } from "@/lib/hours";

/**
 * Live "Open now / Opens at …" chip, computed in the restaurant's timezone
 * (open daily, so only the clock matters). Renders nothing until mounted so
 * the server HTML never disagrees with the client.
 */
export default function OpenNow({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Short two-line label for tight spots (e.g. the mobile order bar). */
  compact?: boolean;
}) {
  const { hours } = getSite();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(minutesNowInTz());
    const id = setInterval(() => setNow(minutesNowInTz()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const open = now >= parseHM(hours.opens) && now < parseHM(hours.closes);
  const label = compact
    ? open
      ? ["Open now", `until ${fmt(hours.closes)}`]
      : ["Closed", `opens ${fmt(hours.opens)}`]
    : open
      ? [`Open now · until ${fmt(hours.closes)}`]
      : [`Closed · opens ${fmt(hours.opens)}`];

  return (
    <span
      className={`inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] ${className}`}
    >
      <span
        aria-hidden
        className={`h-[7px] w-[7px] shrink-0 rounded-full ${open ? "bg-olive" : "bg-sand"}`}
      />
      {compact ? (
        <span className="whitespace-nowrap leading-normal">
          {label[0]}
          <span className="block text-[11px] font-medium normal-case tracking-normal opacity-80">
            {label[1]}
          </span>
        </span>
      ) : (
        label[0]
      )}
    </span>
  );
}
