/**
 * The menu-item ids the home page's client sections actually read. The home
 * page hydrates EXACTLY these items into the client content snapshot — never
 * the full menu (that once cost ~15 KB of dead flight payload on every home
 * load). Shared (no "use client") so the server page and the client sections
 * import the same source of truth; a value imported FROM a client module
 * would arrive in server code as a client reference, not an array.
 */
export const PREVIEW_IDS = [
  "chicken-shawarma-wrap",
  "falafel-wrap",
  "gyro-wrap",
  "chicken-shawarma-bowl",
  "hummus",
  "fattoush",
  "tabouleh",
  "baklava",
] as const;

/** Items SignatureDishes pulls price/dietary/category from (⊆ PREVIEW_IDS today). */
export const SIGNATURE_IDS = [
  "chicken-shawarma-wrap",
  "gyro-wrap",
  "falafel-wrap",
  "tabouleh",
] as const;

export type SignatureId = (typeof SIGNATURE_IDS)[number];

/** Union the home page hydrates — recomputed, so neither list needs the other. */
export const HOME_MENU_IDS: ReadonlySet<string> = new Set<string>([
  ...PREVIEW_IDS,
  ...SIGNATURE_IDS,
]);
