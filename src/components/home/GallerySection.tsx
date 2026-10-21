import Image from "next/image";

/**
 * Editorial masonry of the real menu photography. Each tile reveals once, then
 * lifts a caption + scrim on hover (transform/opacity only — motion law).
 * TODO(owner): extend with real photography as it arrives.
 */
const SHOTS = [
  { src: "/images/menu/chicken-shawarma-wrap.webp", label: "Chicken Shawarma", alt: "Chicken shawarma wrap halves stacked, garlic sauce at the cut", tall: false },
  { src: "/images/menu/kefta-wrap.webp", label: "Kefta Kebab Wrap", alt: "Kefta kebab wrap with one long grilled skewer over flatbread", tall: true },
  { src: "/images/menu/mixed-grill-platter.webp", label: "Mixed Grill", alt: "Platter of kefta, chicken, and beef skewers over rice", tall: false },
  { src: "/images/menu/tabbouleh.webp", label: "Tabbouleh", alt: "Bowl of parsley-first tabbouleh with romaine hearts", tall: true },
  { src: "/images/menu/lamb-chop-plate.webp", label: "Grilled Lamb Chops", alt: "Grilled lamb chops over rice with hummus and salad", tall: false },
  { src: "/images/menu/falafel-wrap.webp", label: "Falafel Wrap", alt: "Rolled falafel wrap cut to show crisp falafel and greens", tall: true },
  { src: "/images/menu/muhamara.webp", label: "Muhamara", alt: "Red muhamara dip topped with walnuts and sesame", tall: false },
  { src: "/images/menu/chicken-shawarma-plate-v2.webp", label: "Shawarma Plate", alt: "Chicken shawarma over rice with hummus, salad, and pita", tall: true },
  { src: "/images/menu/baba-ghanoush.webp", label: "Baba Ghanoush", alt: "Smoky baba ghanoush swirled with olive oil", tall: false },
  { src: "/images/menu/baklava.webp", label: "Baklava", alt: "Layered pistachio-and-walnut baklava soaked in syrup", tall: false },
] as const;

export default function GallerySection() {
  return (
    <section aria-labelledby="gallery-h" className="border-y border-tahini bg-garlic">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-28">
        <div className="mb-10 max-w-[52ch] md:mb-14" data-reveal>
          <p className="eyebrow text-gold-ink">Straight from the counter</p>
          <h2
            id="gallery-h"
            className="mt-4 font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.1] text-charcoal"
          >
            Cooked to order, shot the same day.
          </h2>
        </div>

        <div className="columns-2 gap-4 md:columns-3 md:gap-6 [&>figure]:mb-4 md:[&>figure]:mb-6">
          {SHOTS.map((s) => (
            <figure
              key={s.src}
              data-reveal
              className="group relative overflow-hidden break-inside-avoid rounded-[14px]"
            >
              <div className={`relative ${s.tall ? "aspect-3/4" : "aspect-4/3"}`}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={62}
                  className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]"
                />
                {/* hover scrim + caption — opacity/transform only */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-charcoal/70 to-transparent opacity-0 transition-opacity duration-500 ease-brand group-hover:opacity-100"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream opacity-0 transition-[opacity,transform] duration-500 ease-brand group-hover:translate-y-0 group-hover:opacity-100 md:p-5">
                  {s.label}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
