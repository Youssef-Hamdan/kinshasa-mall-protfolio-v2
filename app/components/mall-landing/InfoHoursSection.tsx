import Image from "next/image";
import { GoogleMapEmbed } from "./GoogleMapEmbed";
import { IMG, MALL_LOCATION } from "./constants";
import { sectionCardTitleClass } from "./section-heading";
import { SocialRow } from "./SocialRow";
import { TextReveal } from "./TextReveal";

export function InfoHoursSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative min-h-[22rem] overflow-hidden rounded-2xl p-8">
          <Image src={IMG.cityNight} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
          <div className="bg-gradient-photo-scrim-t absolute inset-0" aria-hidden />
          <div className="relative z-10 flex h-full min-h-[18rem] flex-col">
            <div>
              <TextReveal>
                <h3 className={sectionCardTitleClass}>Find Us</h3>
              </TextReveal>
              <TextReveal delayMs={80}>
                <p className="text-photo-text-secondary mt-3 max-w-sm text-sm leading-relaxed">
                  123 Avenue du Commerce, Kinshasa, DRC
                </p>
              </TextReveal>
            </div>
            <SocialRow className="absolute bottom-8 left-8 z-10" />
          </div>
        </div>

        <div className="bg-muted relative min-h-[22rem] overflow-hidden rounded-2xl p-8">
          <div>
            <TextReveal>
              <h3 className={sectionCardTitleClass}>Opening hours</h3>
            </TextReveal>
            <TextReveal delayMs={70}>
              <p className="text-foreground mt-3 text-sm font-semibold">Mon–Sat 10:00 – 22:00 · Sun 10:00 – 21:00</p>
            </TextReveal>
            <TextReveal delayMs={120}>
              <p className="text-foreground-secondary mt-2 text-sm">123 Avenue du Commerce, Kinshasa, DRC</p>
            </TextReveal>
            <TextReveal delayMs={170}>
              <p className="text-foreground-secondary mt-2 max-w-md text-sm">
                Holiday hours may vary. Visit our info desk on the ground floor for the latest schedule.
              </p>
            </TextReveal>
          </div>
          <div className="border-border bg-card absolute right-8 bottom-8 h-24 w-36 overflow-hidden rounded-md border shadow-sm">
            <GoogleMapEmbed
              fill
              title={MALL_LOCATION.title}
              lat={MALL_LOCATION.lat}
              lng={MALL_LOCATION.lng}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
