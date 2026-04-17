"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import ScrollElement from "@/components/ui/scroll-animation";
import { cn } from "@/lib/utils";
import { AMENITIES } from "./AmenitiesBar";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const viewport = { amount: 0.45, margin: "0px 0px 0px 0px" } as const;

const IMAGES = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85",
];

type LineVariant = "left" | "right";

function AmenityLine({
  item,
  variant,
  index,
}: {
  item: (typeof AMENITIES)[number];
  variant: LineVariant;
  index: number;
}) {
  // Mapping to your semantic Neo-Brutalist variables
  const colors = [
    "bg-[var(--neo-accent-1)]",
    "bg-[var(--neo-accent-2)]",
    "bg-[var(--neo-accent-3)]",
    "bg-[var(--neo-accent-4)]",
  ];
  const bgColor = colors[index % colors.length];

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-6",
        variant === "left" ? "justify-start text-left" : "justify-end text-right"
      )}
    >
      {variant === "left" && (
        <div className={cn(
          "shrink-0 border-4 border-[var(--neo-border)] p-4 shadow-[4px_4px_0px_0px_var(--neo-shadow)] -rotate-3 transition-transform group-hover:rotate-0",
          bgColor
        )}>
          <div className="text-black [&_svg]:h-10 [&_svg]:w-10">
            {item.icon}
          </div>
        </div>
      )}

      <p className="max-w-[12ch] text-5xl font-black uppercase leading-[0.85] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl text-foreground drop-shadow-[2px_2px_0px_var(--background)]">
        {item.label}
      </p>

      {variant === "right" && (
        <div className={cn(
          "shrink-0 border-4 border-[var(--neo-border)] p-4 shadow-[-4px_4px_0px_0px_var(--neo-shadow)] rotate-3 transition-transform group-hover:rotate-0",
          bgColor
        )}>
          <div className="text-black [&_svg]:h-10 [&_svg]:w-10">
            {item.icon}
          </div>
        </div>
      )}
    </div>
  );
}

function AmenityTextGroup({
  items,
  align,
  eyebrow,
  startIndex = 0,
}: {
  items: readonly (typeof AMENITIES)[number][];
  align: LineVariant;
  eyebrow: string;
  startIndex?: number;
}) {
  return (
    <div className={cn("flex flex-col gap-10", align === "right" ? "items-end" : "items-start")}>
      <span className="bg-foreground text-background px-4 py-1 text-sm font-black uppercase tracking-widest border-2 border-[var(--neo-border)] shadow-[4px_4px_0px_0px_var(--neo-accent-1)]">
        {eyebrow}
      </span>

      <div className="flex flex-col gap-12 md:gap-16">
        {items.map((item, i) => (
          <ScrollElement
            key={item.label}
            direction={align === "left" ? "left" : "right"}
            viewport={viewport}
          >
            <AmenityLine item={item} variant={align} index={startIndex + i} />
          </ScrollElement>
        ))}
      </div>
    </div>
  );
}

function AmenityImage({
  src,
  alt,
  size = "large",
  rotate = 0,
}: {
  src: string;
  alt: string;
  size?: "large" | "small";
  rotate?: number;
}) {
  return (
    <div className="relative p-4 md:p-8">
      <div
        className={cn(
          "relative border-[6px] border-[var(--neo-border)] bg-card shadow-[24px_24px_0px_0px_var(--neo-shadow)]",
          size === "large" && "min-h-[420px] md:min-h-[620px] lg:min-h-[720px]",
          size === "small" && "min-h-[320px] md:min-h-[440px] lg:min-h-[520px]"
        )}
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            data-amenity-img
            className="absolute left-0 top-[-18%] h-[136%] w-full will-change-transform"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 bg-foreground text-background px-3 py-1 font-mono text-[10px] uppercase tracking-tighter">
          IMG_DATA_EXP_{alt.split(' ')[0].toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export function AmenitiesScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const firstGroup = AMENITIES.slice(0, 2);
  const secondGroup = AMENITIES.slice(2, 4);

  useGSAP(
    () => {
      if (reduceMotion) return;

      gsap.utils.toArray<HTMLElement>("[data-amenity-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { y: "-10%", scale: 1.05 },
          {
            y: "10%",
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [reduceMotion] }
  );

  return (
    <section
      ref={sectionRef}
      // Triggering your sub-theme morph
      data-scroll-theme-light="theme-deep-teal"
      data-scroll-theme-dark="theme-deep-teal"
      className="bg-background text-foreground overflow-x-clip transition-colors duration-700"
      aria-label="Mall amenities"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
        <div className="flex flex-col gap-32 lg:gap-48">
          
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <AmenityTextGroup
              items={firstGroup}
              align="left"
              eyebrow="01 // Eat & gather"
              startIndex={0}
            />
            <AmenityImage src={IMAGES[0]} alt="CFC shop" size="large" rotate={2} />
          </div>

          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div className="order-2 lg:order-1 lg:translate-y-12">
              <AmenityImage src={IMAGES[1]} alt="Smokin shop" size="small" rotate={-2} />
            </div>
            <div className="order-1 lg:order-2">
              <AmenityTextGroup
                items={secondGroup}
                align="right"
                eyebrow="02 // Shop & discover"
                startIndex={2}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}