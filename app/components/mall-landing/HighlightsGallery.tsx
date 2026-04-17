"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
} from "@/components/uilayouts/progressive-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TextAnimation } from "@/components/ui/text-animation";
import { cn } from "@/lib/utils";
import { IMG } from "./constants";
import {
  SectionHeading,
  sectionHeaderContainerClass,
  sectionTitleAccentWordClass,
  sectionTitleLeadWordClass,
} from "./section-heading";

const HIGHLIGHT_ITEMS = [
  {
    img: IMG.gallery1,
    title: "Dining & cafés",
    desc: "From quick bites to sit-down meals, find flavors that fit every craving.",
    sliderName: "cfc",
    color: "bg-[var(--km-spot-red)]",
  },
  {
    img: IMG.gallery2,
    title: "Smokehouse & grill",
    desc: "Bold grills and smoky aromas — heart and satisfying.",
    sliderName: "smokin",
    color: "bg-[var(--km-spot-amber)]",
  },
  {
    img: IMG.gallery3,
    title: "Sweet treats",
    desc: "Cool off with ice cream and desserts perfect for families.",
    sliderName: "nice-cream",
    color: "bg-[var(--km-spot-cyan)]",
  },
  {
    img: IMG.building,
    title: "Shopping & strolls",
    desc: "Browse stores, meet friends, and enjoy a welcoming place.",
    sliderName: "mall",
    color: "bg-[var(--km-spot-lime)]",
  },
] as const;

// Neo-Brutalist Shell: Thick borders, sharp corners, and a hard shadow
const cardShellClassName =
  "border-[4px] border-border relative mx-auto overflow-hidden bg-background text-foreground shadow-[16px_16px_0px_0px_var(--foreground)]";

export function HighlightsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  // Shrink the motion range for a snappier "pop-in" effect rather than a long glide
  const t = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  
  const widthPx = useTransform(t, (p) => {
    if (typeof window === "undefined") return 1200;
    const vw = window.innerWidth;
    const sidePad = 24;
    const wCompact = Math.min(1100, vw - 2 * sidePad);
    /* End state: full viewport width (edge-to-edge highlight) */
    return wCompact + p * (vw - wCompact);
  });

  return (
    <section
      id="highlights"
      className="scroll-mt-24 overflow-x-clip bg-background"
    >
      <div className={cn(sectionHeaderContainerClass, "pt-16 pb-12")}>
        <SectionHeading
          title={
            <div className="flex flex-col">
              <span className={cn(sectionTitleLeadWordClass, "font-black uppercase")}>Check</span>
              <span className={cn(sectionTitleAccentWordClass, "text-primary italic -mt-4")}>Highlights</span>
            </div>
          }
        />
      </div>

      <div
        ref={scrollRef}
        className="relative w-full"
        style={{ minHeight: "200vh" }}
      >
        <div className="sticky top-24 z-0 flex h-[calc(100dvh-6rem)] min-h-[calc(100dvh-6rem)] w-full max-w-[100vw] items-center justify-center px-0">
          {hasMounted ? (
            <motion.div
              className={cardShellClassName}
              style={{
                width: widthPx,
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <HighlightsCarouselInner />
            </motion.div>
          ) : (
            <div className={cn(cardShellClassName, "h-full w-full max-w-6xl")}>
              <HighlightsCarouselInner />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HighlightsCarouselInner() {
  const isSmUp = useMediaQuery("(min-width: 640px)");

  return (
    <ProgressSlider
      vertical={isSmUp}
      fastDuration={300}
      duration={4000}
      activeSlider={HIGHLIGHT_ITEMS[0].sliderName}
      className="flex h-full min-h-0 flex-col-reverse sm:flex-row"
    >
      <SliderBtnGroup className="z-10 grid h-fit w-full grid-cols-2 overflow-hidden sm:flex sm:h-full sm:w-[380px] sm:shrink-0 sm:flex-col sm:bg-card">
        {HIGHLIGHT_ITEMS.map((item) => (
          <SliderBtn
            key={item.sliderName}
            value={item.sliderName}
            className={cn(
              "group relative border-border p-4 text-left transition-all sm:flex-1 sm:border-b-4 last:border-b-0",
              "hover:bg-background/5 aria-selected:bg-background"
            )}
            progressBarClass={cn(
              "absolute bottom-0 left-0 h-2 sm:top-0 sm:left-0 sm:h-full sm:w-4 border-r-2 border-border",
              item.color
            )}
          >
            <div className="relative z-10 pl-2 sm:pl-6">
              <h3 className={cn(
                "mb-2 w-fit border-2 border-border px-3 py-1 text-sm font-black uppercase tracking-tighter shadow-[3px_3px_0px_0px_var(--foreground)]",
                item.color
              )}>
                {item.title}
              </h3>
              <p className="text-muted-foreground font-bold line-clamp-2 text-xs md:text-sm leading-tight">
                {item.desc}
              </p>
            </div>
          </SliderBtn>
        ))}
      </SliderBtnGroup>

      <SliderContent className="relative min-h-0 w-full flex-1 sm:h-full sm:min-w-0 border-l-4 border-border">
        {HIGHLIGHT_ITEMS.map((item) => (
          <SliderWrapper key={item.sliderName} value={item.sliderName} className="absolute inset-0 h-full">
            <div className="relative h-full w-full transition-all duration-500">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 60vw"
                priority={item.sliderName === HIGHLIGHT_ITEMS[0].sliderName}
              />
              {/* Corner accent for Y2K feel */}
              <div className="absolute top-4 right-4 bg-background text-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                HD_DATA_REF_{item.sliderName.toUpperCase()}
              </div>
            </div>
          </SliderWrapper>
        ))}
      </SliderContent>
    </ProgressSlider>
  );
}