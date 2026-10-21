import { getSite } from "@/lib/content";
import Button from "@/components/ui/Button";
import BrandMap from "@/components/home/BrandMap";

export default function VisitSection() {
  const site = getSite();
  return (
    <section aria-labelledby="visit-heading" className="grain bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-16 md:grid-cols-2 md:items-center md:gap-20 md:px-10 md:py-32">
        <div>
          <p className="eyebrow text-gold-ink" data-reveal>
            Visit us
          </p>
          <h2 id="visit-heading" className="display-section mt-4 text-charcoal" data-reveal>
            On Washington Street,
            <br />
            just off the 10
          </h2>

          <dl className="mt-8 space-y-5 md:mt-10 md:space-y-7">
            <div data-reveal>
              <dt className="eyebrow text-charcoal-60">Address</dt>
              <dd className="mt-1.5 text-[17px] leading-relaxed">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region}{" "}
                {site.address.postalCode}
              </dd>
            </div>
            <div data-reveal>
              <dt className="eyebrow text-charcoal-60">Hours</dt>
              <dd className="mt-1.5 text-[17px]">
                {site.hours.display}
                <span className="mt-1 block text-[14px] text-charcoal-60">
                  {site.hours.orderingWindow}
                </span>
              </dd>
            </div>
            <div data-reveal>
              <dt className="eyebrow text-charcoal-60">Phone</dt>
              <dd className="mt-1.5 text-[17px]">
                <a
                  href={site.phoneHref}
                  className="underline decoration-tahini underline-offset-4 transition-colors duration-250 hover:decoration-gold"
                >
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-8 md:mt-11" data-reveal>
            <Button href={site.mapsUrl} external>
              Get directions
            </Button>
          </div>
        </div>

        <div data-reveal>
          <BrandMap className="aspect-[4/3]" />
        </div>
      </div>
    </section>
  );
}
