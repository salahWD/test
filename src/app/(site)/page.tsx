import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSequence from "@/components/hero/HeroSequence";
import TrustStrip from "@/components/home/TrustStrip";
import StorySection from "@/components/home/StorySection";
import GallerySection from "@/components/home/GallerySection";
import MounehCorner from "@/components/home/MounehCorner";
import HeritageSection from "@/components/home/HeritageSection";
import VisitSection from "@/components/home/VisitSection";
import FinalCta from "@/components/home/FinalCta";

// Below-fold interactive sections: code-split (next/dynamic) so their JS
// never sits in the boot-critical preload list — still fully SSR'd, the
// chunks arrive during hydration, well after the LCP has painted.
const SignatureDishes = dynamic(
  () => import("@/components/home/SignatureDishes"),
);
const MenuPreview = dynamic(() => import("@/components/home/MenuPreview"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
import Divider from "@/components/ui/Divider";
import ContentHydrator from "@/components/ContentHydrator";
import { HOME_MENU_IDS } from "@/components/home/home-menu-ids";
import { JsonLd, pageGraph } from "@/lib/jsonld";
import { loadContent } from "@/lib/cms/store";
import { getSite } from "@/lib/content";

export default async function HomePage() {
  // prime the server snapshot; hydrate the extra data THIS page's client
  // components read: the carousel's testimonials and ONLY the menu items the
  // dishes/preview sections look up by id — the other ~45 items are dead
  // bytes in the flight payload (client render stays identical: those
  // sections .find() by id, so a superset-consistent subset can't mismatch)
  const content = await loadContent();
  const site = getSite();
  return (
    <ContentHydrator
      data={{
        menu: content.menu.filter((m) => HOME_MENU_IDS.has(m.id)),
        testimonials: content.testimonials,
        home: content.home,
      }}
    >
      <JsonLd
        data={pageGraph({
          path: "/",
          title: site.seo.titleDefault,
          description: site.seo.description,
        })}
      />
      <HeroSequence />
      <TrustStrip />
      <StorySection />
      {/* Suspense around each below-fold CLIENT section: the HTML is fully
          prerendered either way, but each boundary hydrates as its own
          interruptible task instead of one long block — keeps TBT near zero
          on throttled mobile. (Server sections don't hydrate at all.) */}
      <Suspense>
        <SignatureDishes />
      </Suspense>
      <div className="grain bg-cream">
        <Divider className="mx-auto max-w-[1100px] px-5" />
      </div>
      <Suspense>
        <MenuPreview />
      </Suspense>
      <GallerySection />
      <Suspense>
        <Testimonials />
      </Suspense>
      <div className="grain bg-cream">
        <Divider className="mx-auto max-w-[1100px] px-5" />
      </div>
      <MounehCorner />
      <HeritageSection />
      <div className="grain bg-cream">
        <Divider className="mx-auto max-w-[1100px] px-5" />
      </div>
      <VisitSection />
      <FinalCta />
    </ContentHydrator>
  );
}
