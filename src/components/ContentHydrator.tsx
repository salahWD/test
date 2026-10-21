"use client";

import { __setContent, type ContentBundle } from "@/lib/content";

/**
 * Primes the client-side content snapshot before any descendant renders,
 * so every client component's `@/lib/content` accessors return the same
 * CMS-merged bundle the server rendered with. Deliberately set during
 * render (not an effect): descendants read the snapshot in their render.
 * Idempotent, so Strict Mode double-rendering is harmless.
 *
 * Pass ONLY the data the page's client components read — the layout
 * hydrates {site, cloverUrl} for the chrome; pages layer their own needs
 * (home: testimonials + just the menu items in home-menu-ids; menu: nothing
 * extra — its card list is server HTML and MenuShell takes props). Whatever
 * isn't hydrated falls back to the compiled-in seeds, which no client
 * component may then read — every byte here ships in the flight payload
 * of every page load, so audit reads before adding data.
 */
export default function ContentHydrator({
  data,
  children,
}: {
  data: Partial<ContentBundle>;
  children: React.ReactNode;
}) {
  __setContent(data);
  return children;
}
