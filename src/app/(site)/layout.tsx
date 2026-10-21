import { loadContent } from "@/lib/cms/store";
import SmoothScroll from "@/components/motion/SmoothScroll";
import HashScroll from "@/components/motion/HashScroll";
import RevealManager from "@/components/motion/RevealManager";
import ContentHydrator from "@/components/ContentHydrator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Marketing-site chrome: smooth scrolling, reveals, header/footer — kept out
 * of the root layout so /admin renders without any of it.
 */

// ISR for every marketing route: admin saves revalidate instantly via
// revalidatePath (actions.ts); the hourly re-render is the safety net for
// content that changed outside a save (DB restored from backup, redeploy
// whose build ran against a stale/empty database).
export const revalidate = 3600;
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // CMS-merged content: primes the server snapshot; the client gets only
  // what the chrome's client components read (pages layer their own sections)
  const content = await loadContent();
  return (
    <ContentHydrator
      data={{ site: content.site, cloverUrl: content.cloverUrl }}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll />
      <HashScroll />
      <RevealManager />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </ContentHydrator>
  );
}
