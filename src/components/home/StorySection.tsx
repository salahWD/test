import Image from "next/image";
import Button from "@/components/ui/Button";
import TwineKnot from "@/components/ui/TwineKnot";
import ParallaxImage from "@/components/motion/ParallaxImage";
import PullLine from "@/components/motion/PullLine";

const CRAFT = [
  "Shawarma stacked and roasted in-house, every morning",
  "Garlic sauce from a family recipe — small batches, never a jar",
  "Bread warmed to order, not a minute before",
] as const;

/** Forest-green full-bleed chapter. Holds the site's ONE non-hero parallax
 *  and the ONE twine-knot bullet motif. */
export default function StorySection() {
  return (
    <section aria-labelledby="story-heading" className="bg-forest text-cream">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-20 md:px-10 md:py-36">
        <div>
          <p className="eyebrow text-gold" data-reveal>
            Our story
          </p>
          <PullLine className="mt-6 text-[clamp(2rem,3.8vw,3.4rem)] font-medium leading-[1.15]">
            Recipes carried from Middle East to the desert — and never
            &ldquo;updated.&rdquo;
          </PullLine>
          <div className="body-copy mt-8 space-y-5 text-[16px] leading-[1.8] text-sage">
            <p data-reveal>
              The Wrap Shack runs on the kind of recipes written in a
              grandmother&rsquo;s hand and measured in pinches. Every morning we
              stack the shawarma spit by hand, season it the way our family
              always has, and let it roast slow until the edges char.
            </p>
            <p data-reveal>
              The rest is Mediterranean hospitality: warm bread, sharp pickles,
              a table that always has room. Halal isn&rsquo;t a footnote here —
              it&rsquo;s every single item, every single day.
            </p>
          </div>
          <ul className="mt-9 space-y-3.5">
            {CRAFT.map((line) => (
              <li key={line} className="flex items-center gap-4" data-reveal>
                <TwineKnot className="h-4 w-5 shrink-0 text-sand" />
                <span className="text-[15px] text-cream">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 md:mt-11" data-reveal>
            <Button href="/about" variant="light">
              Read our story
            </Button>
          </div>
        </div>

        <ParallaxImage className="relative aspect-[4/5] overflow-hidden rounded-[16px]">
          <Image
            src="/images/story-ingredients.webp"
            alt="Chicken shawarma stacked on twin vertical spits, roasting in the kitchen"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            quality={60}
            className="object-cover"
          />
        </ParallaxImage>
      </div>
    </section>
  );
}
