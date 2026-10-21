import Image from "next/image";
import { getSite, getCloverUrl, getHome } from "@/lib/content";

export default function FinalCta() {
  const site = getSite();
  const clover = getCloverUrl();
  const cta = getHome().finalCta;
  return (
    <section aria-labelledby="cta-heading" className="overflow-hidden bg-forest text-cream">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-16 md:grid-cols-[1fr_auto] md:gap-24 md:px-10 md:py-32">
        <div>
          <p className="eyebrow text-gold" data-reveal>
            {cta.eyebrow}
          </p>
          <h2
            id="cta-heading"
            className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-medium leading-[1.02]"
            data-reveal
          >
            {cta.headlineTop}
            <br />
            <span className="italic">{cta.headlineItalic}</span>
          </h2>
          <p className="body-copy mt-6 text-[16px] leading-relaxed text-sage" data-reveal>
            {cta.body} {site.hours.orderingWindow}.
          </p>
          <div className="mt-8 md:mt-10" data-reveal>
            <a
              href={clover}
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-[13.5px] font-semibold uppercase tracking-[0.1em] text-forest transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-garlic hover:shadow-[inset_0_0_0_1px_var(--color-gold)]"
            >
              Order Online
              <span
                aria-hidden
                className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        <div className="justify-self-center md:justify-self-end" data-reveal>
          <Image
            src="/images/shawarma-cutout.webp"
            alt="Chicken shawarma wrap in kraft paper"
            width={633}
            height={1335}
            sizes="(max-width: 768px) 60vw, 300px"
            quality={60}
            className="float-gently h-auto w-[min(58vw,300px)] drop-shadow-[0_24px_48px_rgba(22,41,31,0.45)]"
          />
        </div>
      </div>
    </section>
  );
}
