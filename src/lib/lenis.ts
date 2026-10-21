import type Lenis from "lenis";

/**
 * Module-level handle to the one Lenis instance (created by SmoothScroll),
 * so leaf components (e.g. back-to-top) can drive smooth scrolling without
 * prop drilling or a context provider. Null under reduced motion / pre-init.
 */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
