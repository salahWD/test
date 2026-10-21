import { Cormorant_Garamond, Montserrat } from "next/font/google";

// Weight 500 only: every display style on the site sets font-weight 500
// (600 is brand-permitted but unused — shipping it would preload two extra
// faces that compete with the LCP on throttled mobile).
export const cormorant = Cormorant_Garamond({
  weight: ["500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const montserrat = Montserrat({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
