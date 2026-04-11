"use client";

import ScrollElement from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";
import { AMENITIES } from "./AmenitiesBar";

const viewport = { amount: 0.5, margin: "0px 0px 0px 0px" } as const;

type LineVariant = "left" | "right" | "center";

function AmenityLine({
  item,
  variant,
}: {
  item: (typeof AMENITIES)[number];
  variant: LineVariant;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center gap-5 sm:gap-6",
        variant === "left" && "justify-start",
        variant === "right" && "justify-end",
        variant === "center" && "justify-center",
      )}
    >
      <div className="text-primary shrink-0 [&_svg]:h-[1em] [&_svg]:w-[1em] [&_svg]:max-h-14 [&_svg]:max-w-14 md:[&_svg]:max-h-16 md:[&_svg]:max-w-16">
        {item.icon}
      </div>
      <p className="font-semibold leading-snug tracking-tight">{item.label}</p>
    </div>
  );
}

export function AmenitiesScrollSection() {
  return (
    <section className="bg-background text-foreground overflow-x-clip" aria-label="Mall amenities">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-14 md:gap-20 lg:gap-24">
          {AMENITIES.map((item, i) => {
            const isLast = i === AMENITIES.length - 1;
            const isLeft = !isLast && i % 2 === 0;

            return (
              <ScrollElement
                key={item.label}
                direction={isLast ? "down" : isLeft ? "left" : "right"}
                viewport={viewport}
                className="mx-auto w-max max-w-full text-center text-4xl sm:whitespace-nowrap sm:text-5xl md:text-6xl"
              >
                <AmenityLine item={item} variant="center" />
              </ScrollElement>
            );
          })}
        </div>
      </div>
    </section>
  );
}
