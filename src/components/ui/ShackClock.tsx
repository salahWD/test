"use client";

import { useEffect, useState } from "react";
import { getSite } from "@/lib/content";
import { parseHM, minutesNowInTz, fmtMinutes, fmt } from "@/lib/hours";

/**
 * A living line of copy: the current time at the shop, in the shop's own
 * timezone, with a word on what the kitchen is doing right now. Renders
 * nothing until mounted so server HTML never disagrees with the client.
 */
export default function ShackClock({ className = "" }: { className?: string }) {
  const site = getSite();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(minutesNowInTz());
    const id = setInterval(() => setNow(minutesNowInTz()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) return null;

  const opens = parseHM(site.hours.opens);
  const closes = parseHM(site.hours.closes);
  const tail =
    now >= opens && now < closes
      ? "the spit is turning"
      : now < opens
        ? `doors open at ${fmt(site.hours.opens)}`
        : `the kitchen rests until ${fmt(site.hours.opens)}`;

  return (
    <p className={`font-display text-[1.05rem] italic leading-snug ${className}`}>
      It&rsquo;s {fmtMinutes(now)} in {site.marketingLocation} &mdash; {tail}.
    </p>
  );
}
